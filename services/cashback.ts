import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export type CashbackEntry = {
  id: string;
  amount: number;
  points?: number;
  description?: string;
  type?: string;
  createdAt?: string;
};

export type CashbackSummary = {
  totalPoints?: number;
  totalEarned?: number;
  balance?: number;
  entries?: CashbackEntry[];
};

export const cashbackService = {
  getAll() {
    return apiClient.get<CashbackSummary | CashbackEntry[]>(ENDPOINTS.CASHBACK.ALL);
  },

  getHistory() {
    return apiClient.get<CashbackEntry[]>(ENDPOINTS.CASHBACK.HISTORY);
  },

  getEarnWays() {
    return apiClient.get<{ title: string; desc: string; points: string }[]>(ENDPOINTS.CASHBACK.EARN_WAYS);
  },

  redeem(rewardId: string, points: number) {
    return apiClient.post<{ message: string; points?: number }>(ENDPOINTS.CASHBACK.REDEEM, {
      rewardId,
      points,
    });
  },
};
