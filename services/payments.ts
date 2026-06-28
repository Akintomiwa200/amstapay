import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export const paymentsService = {
  requestMoney(data: { amount: number; recipient: string; note?: string }) {
    return apiClient.post<{ success: boolean; data: { requestId: string } }>(
      ENDPOINTS.PAYMENTS.REQUEST,
      data,
    );
  },

  sendPayment(data: Record<string, unknown>) {
    return apiClient.post(ENDPOINTS.PAYMENTS.SEND, data);
  },

  receivePayment(data: Record<string, unknown>) {
    return apiClient.post(ENDPOINTS.PAYMENTS.RECEIVE, data);
  },
};
