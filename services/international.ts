import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export const internationalService = {
  getCountries() {
    return apiClient.get<{ code: string; name: string; currency: string }[]>(ENDPOINTS.INTERNATIONAL.COUNTRIES);
  },

  getRates() {
    return apiClient.get(ENDPOINTS.INTERNATIONAL.RATES);
  },

  sendOtp(phone: string) {
    return apiClient.post(ENDPOINTS.INTERNATIONAL.SEND_OTP, { phone });
  },

  verifyOtp(phone: string, code: string) {
    return apiClient.post(ENDPOINTS.INTERNATIONAL.VERIFY_OTP, { phone, code });
  },

  transfer(data: {
    amount: number;
    currency: string;
    country: string;
    recipientName: string;
    accountNumber: string;
    bankName?: string;
  }) {
    return apiClient.post(ENDPOINTS.INTERNATIONAL.TRANSFER, data);
  },
};
