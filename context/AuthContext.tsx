import React, { createContext, useState, useEffect, useCallback, useRef, useContext, type ReactNode } from 'react';
import { storage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { STORAGE_KEYS } from '@/lib/constants';
import { apiClient } from '@/lib/api';
import { authService } from '@/services/auth';
import { userService } from '@/services/user';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, LoginInput, SignupInput } from '@/lib/models';

export interface ParsedQRData {
  type: string;
  data?: string;
  amount?: string;
  recipient?: string;
  reference?: string;
  merchantId?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  changePin: (currentPin: string, newPin: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  // Backward compatible methods used by existing screens
  getWalletBalance?: () => Promise<{ balance: number }>;
  getTransactions?: () => Promise<unknown>;
  fundWallet?: (amount: number, paymentMethod: string) => Promise<unknown>;
  transferToWallet?: (amount: number, recipient: string) => Promise<unknown>;
  buyAirtime?: (payload: { network: string; phoneNumber: string; amount: number }) => Promise<unknown>;
  verifyAccount?: (accountNumber: string) => Promise<{ accountName: string; bankName: string }>;
  sendViaQR?: (qrData: ParsedQRData, amount: number) => Promise<unknown>;
  receiveViaQR?: (qrData: ParsedQRData) => Promise<unknown>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Backward compat: also expose the old service methods via refs
  const getWalletBalance = useCallback(async () => {
    const { walletService } = await import('@/services/wallet');
    return walletService.getBalance();
  }, []);

  const getTransactions = useCallback(async () => {
    const { transactionService } = await import('@/services/transactions');
    return transactionService.getAll();
  }, []);

  const fundWallet = useCallback(async (amount: number, paymentMethod: string) => {
    const { walletService } = await import('@/services/wallet');
    return walletService.fund({ amount, paymentMethod });
  }, []);

  const transferToWallet = useCallback(async (amount: number, recipient: string) => {
    const { walletService } = await import('@/services/wallet');
    return walletService.transfer({ amount, recipientAccountNumber: recipient });
  }, []);

  const buyAirtime = useCallback(async (payload: { network: string; phoneNumber: string; amount: number }) => {
    const { billsService } = await import('@/services/bills');
    return billsService.buyAirtime(payload as any);
  }, []);

  const verifyAccount = useCallback(async (accountNumber: string) => {
    try {
      const data = await apiClient.post('/accounts/verify', { accountNumber });
      return {
        accountName: (data as any).accountName || (data as any).account_name || '',
        bankName: (data as any).bankName || (data as any).bank_name || '',
      };
    } catch {
      return { accountName: '', bankName: '' };
    }
  }, []);

  const sendViaQR = useCallback(async (qrData: ParsedQRData, amount: number) => {
    logger.log('sendViaQR', { recipient: qrData.recipient, amount, merchantId: qrData.merchantId });
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.SEND, {
      amount,
      recipient: qrData.recipient || qrData.data,
      reference: qrData.reference,
      merchantId: qrData.merchantId,
      qrData: JSON.stringify(qrData),
      type: 'qr_payment',
    });
    return response;
  }, []);

  const receiveViaQR = useCallback(async (qrData: ParsedQRData) => {
    logger.log('receiveViaQR', qrData);
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.RECEIVE, {
      qrData: JSON.stringify(qrData),
      reference: qrData.reference,
      type: 'qr_payment',
    });
    return response;
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      try {
        const savedToken = await storage.get<string>(STORAGE_KEYS.TOKEN);
        const savedUser = await storage.get<User>(STORAGE_KEYS.USER);

        if (savedToken) {
          setToken(savedToken);
          if (savedUser) {
            setUser(savedUser);
          }
        }
      } catch (error) {
        logger.error('Failed to initialize auth', error);
        await storage.clear();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    init();
  }, []);

  const persistAuth = useCallback(async (newToken: string, newUser: User) => {
    await Promise.all([
      storage.set(STORAGE_KEYS.TOKEN, newToken),
      storage.set(STORAGE_KEYS.USER, newUser),
    ]);
  }, []);

  const clearAuth = useCallback(async () => {
    setUser(null);
    setToken(null);
    await Promise.all([
      storage.remove(STORAGE_KEYS.TOKEN),
      storage.remove(STORAGE_KEYS.USER),
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    logger.log('Login attempt for', input.emailOrPhone);
    try {
      const response = await authService.login(input);
      const { token: newToken, user: newUser } = response as { token: string; user: User };
      setToken(newToken);
      setUser(newUser);
      await persistAuth(newToken, newUser);
      logger.log('Login successful');
    } catch (error) {
      await clearAuth();
      throw error;
    }
  }, [persistAuth, clearAuth]);

  const signup = useCallback(async (input: SignupInput) => {
    logger.log('Signup attempt for', input.email);
    const response = await authService.signup(input);
    const { token: newToken, user: newUser } = response as { token: string; user: User };
    if (newToken) {
      setToken(newToken);
      setUser(newUser);
      await persistAuth(newToken, newUser);
    }
  }, [persistAuth]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      logger.warn('Logout API call failed', error);
    }
    await clearAuth();
    logger.log('Logout completed');
  }, [clearAuth]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const response = await userService.getProfile();
      const userData = (response as { data: User }).data;
      setUser(userData);
      await storage.set(STORAGE_KEYS.USER, userData);
    } catch (error) {
      logger.error('Failed to refresh user', error);
      if (error instanceof Error && error.message.includes('401')) {
        await clearAuth();
      }
      throw error;
    }
  }, [token, clearAuth]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const response = await userService.updateProfile(data);
    const userData = (response as { data: User }).data;
    setUser(userData);
    await storage.set(STORAGE_KEYS.USER, userData);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await userService.changePassword(currentPassword, newPassword);
  }, []);

  const changePin = useCallback(async (currentPin: string, newPin: string) => {
    await userService.changePin(currentPin, newPin);
  }, []);

  const deleteAccount = useCallback(async () => {
    await userService.deleteAccount();
    await clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initialized,
        login,
        signup,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
        changePin,
        deleteAccount,
        // Backward compatible methods
        getWalletBalance,
        getTransactions,
        fundWallet,
        transferToWallet,
        buyAirtime,
        verifyAccount,
        sendViaQR,
        receiveViaQR,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Backward-compatible re-export for screens importing useAuth from context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
