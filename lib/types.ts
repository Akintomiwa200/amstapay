// Common TypeScript types for AmstaPay

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

// Navigation types
export type RootStackParamList = {
  dashboard: undefined;
  login: undefined;
  signup: undefined;
  onboarding: undefined;
  'forgot-password': undefined;
  'verify': undefined;
  'verification-pending': undefined;
  'add-money': undefined;
  'send-money': undefined;
  'request-money': undefined;
  'scan': undefined;
  'scan-send': undefined;
  'qr-code': undefined;
  'my-qr': undefined;
  'process-qr': undefined;
  'snap-pay': undefined;
  'snap-account': undefined;
  'bankTransfer': undefined;
  'airtime': undefined;
  'data': undefined;
  'betting': undefined;
  'tv': undefined;
  'giftcard': undefined;
  'schoolfees': undefined;
  'transport': undefined;
  'insurance': undefined;
  'gaming': undefined;
  'bill-payment': undefined;
  'merchant-payment': undefined;
  'wallet': undefined;
  'card': undefined;
  'reward': undefined;
  'rewards': undefined;
  'earn-points': undefined;
  'recent-reward-transaction': undefined;
  'amstawealth': undefined;
  'invest-confirm': undefined;
  'confirm-transaction': undefined;
  'transaction-success': undefined;
  'waiting-transaction': undefined;
  'web-payment': undefined;
  'notification': undefined;
  'invitation': undefined;
  'help-support': undefined;
  'accountSuccess': undefined;
  'transactions': undefined;
  'transactions/[id]': { id: string };
  'budget': undefined;
  'budget/create': undefined;
  'budget/insights': undefined;
  'budget/[id]': { id: string };
  'invest': undefined;
  'invest/[id]': { id: string };
  'loan': undefined;
  'loan/history': undefined;
  'loan/[id]': { id: string };
  'receipt/[transactionId]': { transactionId: string };
  'accounts/[id]': { id: string };
  'insights': undefined;
  'settings': undefined;
  'settings/profile': undefined;
  'settings/change-password': undefined;
  'settings/change-pin': undefined;
  'settings/currency': undefined;
  'settings/payment-methods': undefined;
  'settings/privacy': undefined;
  'settings/privacy-policy': undefined;
  'settings/terms': undefined;
  'settings/referral': undefined;
  'settings/rate-us': undefined;
  'settings/about': undefined;
  'settings/help-support': undefined;
  'settings/wallet': undefined;
};

// Tab navigation types
export type TabType = 'dashboard' | 'finance' | 'card' | 'reward' | 'me';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Form types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

// Common component props
export interface BaseComponentProps {
  style?: any;
  testID?: string;
}

// Callback types
export type VoidCallback = () => void;
export type Callback<T = void> = (value: T) => void;
export type AsyncCallback<T = void> = (value: T) => Promise<void>;
