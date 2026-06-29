import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export const web3Service = {
  getWallet() {
    return apiClient.get(ENDPOINTS.WEB3.WALLET);
  },

  getBalance() {
    return apiClient.get<{ balance: number; currency?: string }>(ENDPOINTS.WEB3.BALANCE);
  },

  getBalances() {
    return apiClient.get(ENDPOINTS.WEB3.BALANCES);
  },

  getPrices() {
    return apiClient.get(ENDPOINTS.WEB3.PRICES);
  },

  deposit(amount: number, currency: string) {
    return apiClient.post(ENDPOINTS.WEB3.DEPOSIT, { amount, currency });
  },

  send(data: { to: string; amount: number; currency: string }) {
    return apiClient.post(ENDPOINTS.WEB3.SEND, data);
  },

  convert(data: { from: string; to: string; amount: number }) {
    return apiClient.post(ENDPOINTS.WEB3.CONVERT, data);
  },
};
