// App-wide constants
export const APP_NAME = 'AmstaPay';
export const APP_VERSION = '1.0.0';

// API
export const API_BASE_URL = 'https://amstapay-backend.onrender.com/api/v1';
// export const API_BASE_URL = 'http://localhost:3000/api'; // Local development

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  THEME: 'theme',
  CURRENCY: 'currency',
} as const;

// Default values
export const DEFAULT_CURRENCY = 'NGN';
export const DEFAULT_LOCALE = 'en-NG';

// Transaction types
export const TRANSACTION_TYPES = {
  TRANSFER: 'transfer',
  PAYMENT: 'payment',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  BILL_PAYMENT: 'bill_payment',
  AIRTIME: 'airtime',
  DATA: 'data',
} as const;

// Transaction status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Account types
export const ACCOUNT_TYPES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
} as const;

// KYC levels
export const KYC_LEVELS = {
  NONE: 0,
  BASIC: 1,
  INTERMEDIATE: 2,
  FULL: 3,
} as const;

// Timeout values (in milliseconds)
export const TIMEOUT = {
  API_REQUEST: 10000,
  REFRESH_TOKEN: 5000,
} as const;
