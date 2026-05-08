import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Investment, InvestmentPlan } from '@/lib/models';

export const investmentService = {
  getPlans() {
    return apiClient.get<InvestmentPlan[]>(ENDPOINTS.INVESTMENTS.PLANS);
  },

  getPlan(planId: string) {
    return apiClient.get<InvestmentPlan>(ENDPOINTS.INVESTMENTS.PLAN(planId));
  },

  getAll() {
    return apiClient.get<Investment[]>(ENDPOINTS.INVESTMENTS.ALL);
  },

  create(data: { planId: string; amount: number; duration?: number; autoReinvest?: boolean }) {
    return apiClient.post<Investment>(ENDPOINTS.INVESTMENTS.CREATE, data);
  },

  getById(id: string) {
    return apiClient.get<Investment>(ENDPOINTS.INVESTMENTS.BY_ID(id));
  },
};
