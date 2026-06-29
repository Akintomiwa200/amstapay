import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type {
  AuthResponse, LoginInput, SignupInput, AuthSession, TwoFactorStatus,
} from '@/lib/models';

export const authService = {
  login(input: LoginInput) {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      emailOrPhone: input.emailOrPhone.trim(),
      password: input.password,
    });
  },

  signup(input: SignupInput) {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, input);
  },

  verifyEmail(email: string, code: string) {
    return apiClient.post<{ success: boolean }>(ENDPOINTS.AUTH.VERIFY, { email, code });
  },

  forgotPassword(emailOrPhone: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { emailOrPhone });
  },

  resetPassword(emailOrPhone: string, code: string, newPassword: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.RESET_PASSWORD, {
      emailOrPhone, code, newPassword,
    });
  },

  forgotPin(emailOrPhone: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.FORGOT_PIN, { emailOrPhone });
  },

  verifyPinResetCode(emailOrPhone: string, code: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.VERIFY_PIN_RESET_CODE, { emailOrPhone, code });
  },

  resetPin(emailOrPhone: string, code: string, newPin: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.RESET_PIN, { emailOrPhone, code, newPin });
  },

  changePin(currentPin: string, newPin: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.CHANGE_PIN, { currentPin, newPin });
  },

  refreshToken(refreshToken: string) {
    return apiClient.post<{ token: string; refreshToken?: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  },

  logout() {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.LOGOUT);
  },

  uploadDocuments(formData: FormData) {
    return apiClient.post<{ message: string; data: unknown }>(
      ENDPOINTS.AUTH.UPLOAD_DOCUMENTS,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  getSessions() {
    return apiClient.get<AuthSession[]>(ENDPOINTS.AUTH.SESSIONS);
  },

  revokeSession(deviceId: string) {
    return apiClient.delete<{ message: string }>(ENDPOINTS.AUTH.SESSION(deviceId));
  },

  get2FAStatus() {
    return apiClient.get<TwoFactorStatus>(ENDPOINTS.AUTH.TWO_FACTOR_STATUS);
  },

  enable2FA() {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.TWO_FACTOR_ENABLE);
  },

  verify2FA(code: string) {
    return apiClient.post<{ message: string; enabled: boolean }>(ENDPOINTS.AUTH.TWO_FACTOR_VERIFY, { code });
  },

  disable2FA(pin: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.AUTH.TWO_FACTOR_DISABLE, { pin });
  },
};
