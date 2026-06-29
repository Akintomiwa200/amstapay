import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export type SupportMessage = {
  _id?: string;
  message: string;
  isStaff?: boolean;
  createdAt?: string;
};

export type SupportTicket = {
  _id: string;
  subject: string;
  category?: string;
  status?: string;
  messages?: SupportMessage[];
};

export const supportService = {
  getTickets(status?: string) {
    const q = status ? `?status=${status}` : '';
    return apiClient.get<SupportTicket[]>(`${ENDPOINTS.SUPPORT.TICKETS}${q}`);
  },

  createTicket(data: { subject: string; category?: string; message: string }) {
    return apiClient.post<SupportTicket>(ENDPOINTS.SUPPORT.TICKETS, data);
  },

  reply(ticketId: string, message: string) {
    return apiClient.post(ENDPOINTS.SUPPORT.REPLY(ticketId), { message });
  },
};
