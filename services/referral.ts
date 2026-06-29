import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export type ReferralEntry = {
  _id?: string;
  id?: string;
  name: string;
  referredName?: string;
  date?: string;
  createdAt?: string;
  status: 'completed' | 'pending' | string;
  reward?: number;
};

export type ReferralStats = {
  code: string;
  totalReferrals: number;
  totalEarned: number;
  pendingRewards: number;
};

export const referralService = {
  getCode() {
    return apiClient.get<{ code: string; link?: string }>(ENDPOINTS.REFERRAL.CODE);
  },

  getList() {
    return apiClient.get<ReferralEntry[]>(ENDPOINTS.REFERRAL.LIST);
  },

  getStats() {
    return apiClient.get<ReferralStats>(ENDPOINTS.REFERRAL.STATS);
  },
};
