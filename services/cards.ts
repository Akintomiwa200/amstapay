import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { VirtualCard } from '@/lib/models';

export const cardService = {
  getAll() {
    return apiClient.get<VirtualCard[]>(ENDPOINTS.CARDS.ALL);
  },

  create(cardType: string) {
    return apiClient.post<VirtualCard>(ENDPOINTS.CARDS.CREATE, { cardType });
  },

  getById(id: string) {
    return apiClient.get<VirtualCard>(ENDPOINTS.CARDS.BY_ID(id));
  },

  freeze(id: string) {
    return apiClient.patch<{ message: string }>(ENDPOINTS.CARDS.FREEZE(id));
  },

  fund(id: string, amount: number) {
    return apiClient.post<{ message: string }>(ENDPOINTS.CARDS.FUND(id), { amount });
  },

  cancel(id: string) {
    return apiClient.delete<{ message: string }>(ENDPOINTS.CARDS.BY_ID(id));
  },
};
