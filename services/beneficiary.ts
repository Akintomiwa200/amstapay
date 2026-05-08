import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Beneficiary } from '@/lib/models';

export const beneficiaryService = {
  getAll() {
    return apiClient.get<Beneficiary[]>(ENDPOINTS.BENEFICIARIES.ALL);
  },

  create(data: { name: string; accountNumber: string; bankName: string; bankCode?: string; nickname?: string }) {
    return apiClient.post<Beneficiary>(ENDPOINTS.BENEFICIARIES.CREATE, data);
  },

  update(id: string, data: Partial<Beneficiary>) {
    return apiClient.put<Beneficiary>(ENDPOINTS.BENEFICIARIES.UPDATE(id), data);
  },

  delete(id: string) {
    return apiClient.delete<{ message: string }>(ENDPOINTS.BENEFICIARIES.DELETE(id));
  },
};
