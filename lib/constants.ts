import { Platform } from 'react-native';

const DEV_API_URL = Platform.select({
  android: 'https://amstapay-backend.onrender.com',
  ios: 'http://localhost:3000',
  default: 'https://amstapay-backend.onrender.com',
});

const PROD_API_URL = 'https://amstapay-backend.onrender.com';

export const APP_NAME = 'AmstaPay';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const API = {
  BASE_URL: API_BASE_URL,
  PREFIX: '/api/v1',
  TIMEOUT: 30000,
  RETRY_COUNT: 2,
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  THEME: 'themePreference',
  CURRENCY: 'currency',
  ONBOARDING_COMPLETE: 'onboardingComplete',
} as const;

export const DEFAULT_CURRENCY = 'NGN';
export const DEFAULT_LOCALE = 'en-NG';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
};
