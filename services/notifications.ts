import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Notification } from '@/lib/models';

export const notificationsService = {
  getAll() {
    return apiClient.get<Notification[]>(ENDPOINTS.NOTIFICATIONS_LIST.ALL);
  },

  getUnreadCount() {
    return apiClient.get<{ count: number }>(`${ENDPOINTS.NOTIFICATIONS_LIST.ALL}/unread-count`);
  },

  markRead(id: string) {
    return apiClient.put(ENDPOINTS.NOTIFICATIONS_LIST.READ(id));
  },

  markAllRead() {
    return apiClient.put(ENDPOINTS.NOTIFICATIONS_LIST.READ_ALL);
  },

  delete(id: string) {
    return apiClient.delete(ENDPOINTS.NOTIFICATIONS_LIST.DELETE(id));
  },

  clearAll() {
    return apiClient.delete(ENDPOINTS.NOTIFICATIONS_LIST.CLEAR_ALL);
  },

  getPreferences() {
    return apiClient.get(ENDPOINTS.NOTIFICATIONS.PREFERENCES);
  },

  updatePreferences(prefs: Record<string, boolean>) {
    return apiClient.put(ENDPOINTS.NOTIFICATIONS.PREFERENCES, prefs);
  },
};
