import { apiRequest } from './api';

export interface WalletBalance {
  balance: number;
}

export const getWalletBalance = async (token: string): Promise<WalletBalance> => {
  return apiRequest('/wallets/balance', {}, token);
};

export const fundWallet = async (
  amount: number,
  paymentMethod: string,
  token: string
) => {
  return apiRequest('/wallets/fund', {
    method: 'POST',
    body: JSON.stringify({ amount, paymentMethod }),
  }, token);
};

export const withdrawFromWallet = async (
  amount: number,
  accountDetails: any,
  token: string
) => {
  return apiRequest('/wallets/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount, accountDetails }),
  }, token);
};

export const transferToWallet = async (
  amount: number,
  recipient: string,
  token: string
) => {
  return apiRequest('/wallets/transfer', {
    method: 'POST',
    body: JSON.stringify({ amount, recipient }),
  }, token);
};

export const getWalletTransactions = async (token: string) => {
  return apiRequest('/wallets/transactions', {}, token);
};
