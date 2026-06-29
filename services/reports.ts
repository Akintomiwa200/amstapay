import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export const reportsService = {
  getStatement(params?: { month?: string; year?: string }) {
    const query = new URLSearchParams();
    if (params?.month) query.set('month', params.month);
    if (params?.year) query.set('year', params.year);
    const q = query.toString();
    return apiClient.get(`${ENDPOINTS.REPORTS.STATEMENT}${q ? `?${q}` : ''}`);
  },

  exportReport(id: string) {
    return apiClient.get(ENDPOINTS.REPORTS.EXPORT(id));
  },

  submitFeedback(data: { rating: number; feedback?: string }) {
    return apiClient.post(ENDPOINTS.FEEDBACK.SUBMIT, data);
  },
};
