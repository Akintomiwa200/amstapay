import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Loan } from '@/lib/models';

export const loanService = {
  getAll() {
    return apiClient.get<Loan[]>(ENDPOINTS.LOANS.ALL);
  },

  getById(id: string) {
    return apiClient.get<Loan>(ENDPOINTS.LOANS.BY_ID(id));
  },

  apply(data: { amount: number; purpose?: string; duration: number }) {
    return apiClient.post<Loan>(ENDPOINTS.LOANS.APPLY, data);
  },

  repay(id: string, amount: number) {
    return apiClient.post<{ message: string }>(ENDPOINTS.LOANS.REPAY(id), { amount });
  },
};
