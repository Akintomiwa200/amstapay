import { apiRequest } from './api';

export interface Transaction {
  _id: string;
  sender: string;
  receiverName: string;
  receiverAccountNumber: string;
  receiverBank: string;
  amount: number;
  type: string;
  qrData?: string;
  reference?: string;
  merchantId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export const getTransactions = async (token: string): Promise<Transaction[]> => {
  return apiRequest('/transactions', {}, token);
};

export const getTransaction = async (id: string, token: string): Promise<Transaction> => {
  return apiRequest(`/transactions/${id}`, {}, token);
};

export const updateTransactionStatus = async (
  id: string,
  status: string,
  token: string
) => {
  return apiRequest(`/transactions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token);
};
