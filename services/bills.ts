import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type {
  AirtimeInput, DataInput, ElectricityInput, Bill,
} from '@/lib/models';

export const billsService = {
  buyAirtime(input: AirtimeInput) {
    return apiClient.post<{ success: boolean; data: { bill: Bill; balance: number } }>(
      ENDPOINTS.BILLS.AIRTIME, input,
    );
  },

  buyData(input: DataInput) {
    return apiClient.post<{ success: boolean; data: { plan: string; balance: number } }>(
      ENDPOINTS.BILLS.DATA, input,
    );
  },

  payElectricity(input: ElectricityInput) {
    return apiClient.post<{ success: boolean; data: { token: string; balance: number } }>(
      ENDPOINTS.BILLS.ELECTRICITY, input,
    );
  },

  paySchoolFees(data: { studentId: string; amount: number; schoolName: string; session?: string; term?: string }) {
    return apiClient.post<{ success: boolean; data: { receiptNumber: string; balance: number } }>(
      ENDPOINTS.BILLS.SCHOOL_FEES, data,
    );
  },

  payTransport(data: { amount: number; transportType: string; route?: string; bookingReference?: string }) {
    return apiClient.post<{ success: boolean; data: { ticketNumber: string; balance: number } }>(
      ENDPOINTS.BILLS.TRANSPORT, data,
    );
  },
};
