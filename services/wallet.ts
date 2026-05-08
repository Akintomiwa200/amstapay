import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type {
  FundWalletInput, WithdrawInput, TransferInput,
  Wallet, CurrencyWallet, Transaction,
} from '@/lib/models';

export const walletService = {
  getBalance() {
    return apiClient.get<{ balance: number }>(ENDPOINTS.WALLETS.BALANCE);
  },

  fund(input: FundWalletInput) {
    return apiClient.post<{ message: string; balance: number }>(ENDPOINTS.WALLETS.FUND, input);
  },

  withdraw(input: WithdrawInput) {
    return apiClient.post<{ message: string; balance: number }>(ENDPOINTS.WALLETS.WITHDRAW, input);
  },

  transfer(input: TransferInput) {
    return apiClient.post<{ message: string; balance: number }>(ENDPOINTS.WALLETS.TRANSFER, input);
  },

  getTransactions() {
    return apiClient.get<Transaction[]>(ENDPOINTS.WALLETS.TRANSACTIONS);
  },

  getMultiCurrencyBalances() {
    return apiClient.get<CurrencyWallet[]>(ENDPOINTS.WALLETS.CURRENCIES);
  },

  fundCurrencyWallet(currency: string, amount: number) {
    return apiClient.post<{ message: string }>(ENDPOINTS.WALLETS.CURRENCIES_FUND, { currency, amount });
  },

  withdrawCurrencyWallet(currency: string, amount: number) {
    return apiClient.post<{ message: string }>(ENDPOINTS.WALLETS.CURRENCIES_WITHDRAW, { currency, amount });
  },
};
