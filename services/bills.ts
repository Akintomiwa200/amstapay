import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type {
  AirtimeInput, DataInput, ElectricityInput, Bill,
} from '@/lib/models';

type BillResponse = { success: boolean; data: Record<string, unknown> };

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

  fundBetting(data: { provider: string; accountId: string; amount: number }) {
    return apiClient.post<BillResponse>(ENDPOINTS.BILLS.BETTING, data);
  },

  payTv(data: { provider: string; subscriberId: string; packageId: string; packageName: string; amount: number }) {
    return apiClient.post<BillResponse>(ENDPOINTS.BILLS.TV, data);
  },

  payInsurance(data: { provider: string; policyNumber: string; amount: number }) {
    return apiClient.post<BillResponse>(ENDPOINTS.BILLS.INSURANCE, data);
  },

  buyGiftCard(data: { brand: string; denomination: number; quantity: number; email?: string }) {
    return apiClient.post<BillResponse>(ENDPOINTS.BILLS.GIFTCARD, data);
  },

  topUpGaming(data: { platform: string; gamerTag: string; amount: number }) {
    return apiClient.post<BillResponse>(ENDPOINTS.BILLS.GAMING, data);
  },
};
