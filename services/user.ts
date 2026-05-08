import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User } from '@/lib/models';

export const userService = {
  getProfile() {
    return apiClient.get<{ success: boolean; data: User }>(ENDPOINTS.USERS.ME);
  },

  updateProfile(data: Partial<User>) {
    return apiClient.put<{ success: boolean; message: string; data: User }>(ENDPOINTS.USERS.ME, data);
  },

  changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post<{ success: boolean; message: string }>(ENDPOINTS.USERS.CHANGE_PASSWORD, {
      currentPassword, newPassword,
    });
  },

  changePin(currentPin: string, newPin: string) {
    return apiClient.post<{ success: boolean; message: string }>(ENDPOINTS.USERS.CHANGE_PIN, {
      currentPin, newPin,
    });
  },

  uploadAvatar(formData: FormData) {
    return apiClient.post<{ success: boolean; data: { avatar: string } }>(
      ENDPOINTS.USERS.AVATAR,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  uploadKYCDocuments(formData: FormData) {
    return apiClient.post<{ success: boolean; data: unknown }>(
      ENDPOINTS.USERS.KYC_DOCUMENTS,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  deleteAccount() {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.USERS.DELETE);
  },

  updateDeviceToken(deviceToken: string) {
    return apiClient.post<{ success: boolean; message: string }>(ENDPOINTS.USERS.DEVICE_TOKEN, { deviceToken });
  },
};
