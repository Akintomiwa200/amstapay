const BASE_URL = 'https://amstapay-backend.onrender.com/api/v1';
// const BASE_URL = 'http://localhost:3000/api'; // Use for local development

export type ApiRequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {},
  token?: string | null
) => {
  const { method = 'GET', headers = {}, body, timeout = 10000 } = options;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || errorData.error || `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      if (error.message.includes('Network request failed')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }

    throw new Error('An unexpected error occurred');
  }
};
