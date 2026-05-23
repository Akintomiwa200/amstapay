import { API } from './constants';
import { logger } from './logger';
import { storage } from './storage';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
}

interface TokenRefreshResponse {
  token: string;
  refreshToken?: string;
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const getAccessToken = () => storage.get<string>('token');
const getRefreshToken = () => storage.get<string>('refreshToken');

const processRefreshQueue = (token: string) => {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
};

const rejectRefreshQueue = (error: unknown) => {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
};

const refreshTokens = async (): Promise<string> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await fetch(`${API.BASE_URL}${API.PREFIX}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw new Error('Token refresh failed');

  const data: TokenRefreshResponse = await response.json();
  await storage.set('token', data.token);
  if (data.refreshToken) {
    await storage.set('refreshToken', data.refreshToken);
  }
  return data.token;
};

const buildUrl = (endpoint: string, params?: RequestConfig['params']): string => {
  const url = `${API.BASE_URL}${API.PREFIX}${endpoint}`;
  if (!params) return url;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `${url}?${query}` : url;
};

export class ApiClientError extends Error {
  status: number;
  data: unknown;
  code?: string;

  constructor(message: string, status: number, data?: unknown, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

export const apiClient = {
  async request<T = unknown>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = API.TIMEOUT,
      retries = API.RETRY_COUNT,
    } = config;

    const token = await getAccessToken();
    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    if (body && !(body instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const execute = async (attempt: number): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        logger.debug(`API ${method} ${endpoint} (attempt ${attempt + 1})`);
        logger.debug(`Request URL: ${buildUrl(endpoint, params)}`);

        const response = await fetch(buildUrl(endpoint, params), {
          method,
          headers: requestHeaders,
          body: body instanceof FormData ? body as FormData : body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        logger.debug(`Response status: ${response.status}`);

        clearTimeout(timeoutId);

        if (response.status === 401 && attempt < retries) {
          logger.debug('Received 401, attempting token refresh');

          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newToken = await refreshTokens();
              isRefreshing = false;
              processRefreshQueue(newToken);
              requestHeaders['Authorization'] = `Bearer ${newToken}`;
              return await execute(attempt + 1);
            } catch (refreshError) {
              isRefreshing = false;
              rejectRefreshQueue(refreshError);
              await storage.clear();
              throw new ApiClientError('Session expired. Please login again.', 401, null, 'SESSION_EXPIRED');
            }
          } else {
            return new Promise((resolve, reject) => {
              refreshQueue.push({
                resolve: (newToken: string) => {
                  requestHeaders['Authorization'] = `Bearer ${newToken}`;
                  execute(attempt + 1).then(resolve).catch(reject);
                },
                reject,
              });
            });
          }
        }

        const responseData = await response.text();
        let parsed: T;
        try {
          parsed = JSON.parse(responseData) as T;
        } catch {
          parsed = responseData as unknown as T;
        }

        if (!response.ok) {
          const errorData = parsed as Record<string, unknown>;
          const message =
            (errorData?.message as string) ||
            (errorData?.error as string) ||
            `Request failed with status ${response.status}`;
          throw new ApiClientError(message, response.status, parsed);
        }

        return parsed;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ApiClientError) throw error;

        if (error instanceof Error && error.name === 'AbortError') {
          throw new ApiClientError('Request timed out', 408, null, 'TIMEOUT');
        }

        if (error instanceof TypeError && error.message.includes('Network')) {
          if (attempt < retries) {
            logger.debug(`Network error, retrying (${attempt + 1}/${retries})`);
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            return execute(attempt + 1);
          }
          throw new ApiClientError('Network error. Please check your connection.', 0, null, 'NETWORK_ERROR');
        }

        throw error;
      }
    };

    return execute(0);
  },

  get<T>(endpoint: string, params?: RequestConfig['params'], config?: Omit<RequestConfig, 'method' | 'body' | 'params'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET', params });
  },

  post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  },
};
