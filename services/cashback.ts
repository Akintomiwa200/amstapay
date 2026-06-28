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
};
