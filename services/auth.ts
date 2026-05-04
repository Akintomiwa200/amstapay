import { apiRequest } from './api';

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface User {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  accountType?: string;
  isVerified?: boolean;
  role?: string;
  amstapayAccountNumber?: string;
  kycLevel?: number;
}

export const login = async (credentials: LoginCredentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      emailOrPhone: credentials.emailOrPhone.trim(),
      password: credentials.password,
    }),
  });
};

export const fetchUserProfile = async (token: string) => {
  const data = await apiRequest('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  }, token);
  return data.user || data.data || data;
};

export const updateProfile = async (userData: Partial<User>, token: string) => {
  return apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }, token);
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  return apiRequest('/users/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }, token);
};

export const deleteAccount = async (token: string) => {
  return apiRequest('/users/delete', { method: 'DELETE' }, token);
};
