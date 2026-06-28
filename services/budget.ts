import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export interface BudgetCategory {
  _id: string;
  name: string;
  limit: number;
  spent: number;
  color?: string;
}

export interface Budget {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  period: string;
  categories?: BudgetCategory[];
  createdAt: string;
}

export const budgetService = {
  getAll() {
    return apiClient.get<Budget[]>(ENDPOINTS.BUDGET.ALL);
  },

  getById(id: string) {
    return apiClient.get<Budget>(ENDPOINTS.BUDGET.BY_ID(id));
  },

  create(data: { name: string; amount: number; period?: string; categories?: string[] }) {
    return apiClient.post<Budget>(ENDPOINTS.BUDGET.ALL, data);
  },

  getCategories() {
    return apiClient.get<BudgetCategory[]>(ENDPOINTS.BUDGET.CATEGORIES);
  },

  getInsights() {
    return apiClient.get<Record<string, unknown>>(ENDPOINTS.REPORTS.BUDGET_INSIGHTS);
  },

  getExpenses() {
    return apiClient.get<unknown[]>(ENDPOINTS.EXPENSES.ALL);
  },
};
