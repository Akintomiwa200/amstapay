import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export const voucherService = {
  redeem(code: string) {
    return apiClient.post<{ message: string }>(ENDPOINTS.VOUCHERS.REDEEM, { code });
  },
};
