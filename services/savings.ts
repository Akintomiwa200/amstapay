import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { SavingsGoal } from '@/lib/models';

export const savingsService = {
  getAll() {
    return apiClient.get<SavingsGoal[]>(ENDPOINTS.SAVINGS.GOALS);
  },

  getById(id: string) {
    return apiClient.get<SavingsGoal>(ENDPOINTS.SAVINGS.GOAL(id));
  },

  create(data: { name: string; targetAmount: number; deadline?: string }) {
    return apiClient.post<SavingsGoal>(ENDPOINTS.SAVINGS.GOALS, data);
  },

  deposit(id: string, amount: number) {
    return apiClient.post<{ message: string }>(ENDPOINTS.SAVINGS.GOAL_DEPOSIT(id), { amount });
  },

  withdraw(id: string, amount: number) {
    return apiClient.post<{ message: string }>(ENDPOINTS.SAVINGS.GOAL_WITHDRAW(id), { amount });
  },

  cancel(id: string) {
    return apiClient.delete<{ message: string }>(ENDPOINTS.SAVINGS.GOAL(id));
  },
};
