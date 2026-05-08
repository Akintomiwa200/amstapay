import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Transaction } from '@/lib/models';
import { PAGINATION } from '@/lib/constants';

export const transactionService = {
  getAll(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) {
    return apiClient.get<Transaction[]>(ENDPOINTS.TRANSACTIONS.ALL, { page, limit });
  },

  getById(id: string) {
    return apiClient.get<Transaction>(ENDPOINTS.TRANSACTIONS.BY_ID(id));
  },

  create(data: Partial<Transaction>) {
    return apiClient.post<Transaction>(ENDPOINTS.TRANSACTIONS.CREATE, data);
  },

  updateStatus(id: string, status: string) {
    return apiClient.patch<Transaction>(ENDPOINTS.TRANSACTIONS.STATUS(id), { status });
  },
};
