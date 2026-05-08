export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PIN: '/auth/change-pin',
    FORGOT_PIN: '/auth/forgot-pin',
    VERIFY_PIN_RESET_CODE: '/auth/verify-pin-reset-code',
    RESET_PIN: '/auth/reset-pin',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    SESSIONS: '/auth/sessions',
    SESSION: (deviceId: string) => `/auth/sessions/${deviceId}`,
    UPLOAD_DOCUMENTS: '/auth/upload-documents',
  },

  USERS: {
    ME: '/users/me',
    CHANGE_PASSWORD: '/users/change-password',
    CHANGE_PIN: '/users/change-pin',
    AVATAR: '/users/avatar',
    KYC_DOCUMENTS: '/users/kyc-documents',
    DELETE: '/users/delete',
    DEVICE_TOKEN: '/users/device-token',
    ALL: '/users',
    BY_ID: (userId: string) => `/users/${userId}`,
  },

  WALLETS: {
    BALANCE: '/wallets/balance',
    FUND: '/wallets/fund',
    WITHDRAW: '/wallets/withdraw',
    TRANSFER: '/wallets/transfer',
    TRANSACTIONS: '/wallets/transactions',
    CURRENCIES: '/wallets/currencies',
    CURRENCIES_FUND: '/wallets/currencies/fund',
    CURRENCIES_WITHDRAW: '/wallets/currencies/withdraw',
  },

  TRANSACTIONS: {
    ALL: '/transactions',
    CREATE: '/transactions',
    BY_ID: (id: string) => `/transactions/${id}`,
    STATUS: (id: string) => `/transactions/${id}/status`,
  },

  BILLS: {
    AIRTIME: '/bills/airtime',
    DATA: '/bills/data',
    ELECTRICITY: '/bills/electricity',
    SCHOOL_FEES: '/bills/schoolfees',
    TRANSPORT: '/bills/transport',
  },

  PAYMENTS: {
    SEND: '/payments/send',
    RECEIVE: '/payments/receive',
  },

  SAVINGS: {
    GOALS: '/goals',
    GOAL: (id: string) => `/goals/${id}`,
    GOAL_DEPOSIT: (id: string) => `/goals/${id}/deposit`,
    GOAL_WITHDRAW: (id: string) => `/goals/${id}/withdraw`,
  },

  INVESTMENTS: {
    PLANS: '/investments/plans',
    PLAN: (planId: string) => `/investments/plans/${planId}`,
    ALL: '/investments',
    CREATE: '/investments',
    BY_ID: (id: string) => `/investments/${id}`,
  },

  LOANS: {
    APPLY: '/loans',
    ALL: '/loans',
    BY_ID: (id: string) => `/loans/${id}`,
    REPAY: (id: string) => `/loans/${id}/repay`,
  },

  BENEFICIARIES: {
    ALL: '/beneficiaries',
    CREATE: '/beneficiaries',
    UPDATE: (id: string) => `/beneficiaries/${id}`,
    DELETE: (id: string) => `/beneficiaries/${id}`,
  },

  CARDS: {
    ALL: '/cards',
    CREATE: '/cards',
    BY_ID: (id: string) => `/cards/${id}`,
    FREEZE: (id: string) => `/cards/${id}/freeze`,
    FUND: (id: string) => `/cards/${id}/fund`,
  },

  VERIFICATION: {
    BVN: '/verification/bvn',
    NIN: '/verification/nin',
    BANK: '/verification/bank',
  },

  BANK: {
    BALANCE: '/bank/balance',
    TRANSFER: '/bank/transfer',
  },

  INTERNATIONAL: {
    TRANSFER: '/international/transfer',
    RATES: '/international/rates',
    COUNTRIES: '/international/countries',
    SEND_OTP: '/international/send-otp',
    VERIFY_OTP: '/international/verify-otp',
  },

  WEB3: {
    WALLET: '/web3/wallet',
    BALANCE: '/web3/balance',
    BALANCES: '/web3/balances',
    DEPOSIT: '/web3/deposit',
    SEND: '/web3/send',
    CONVERT: '/web3/convert',
    PRICE: '/web3/price',
    PRICES: '/web3/prices',
  },

  REPORTS: {
    STATEMENT: '/reports/statement',
    BUDGET_INSIGHTS: '/reports/budget-insights',
    BY_ID: (id: string) => `/reports/${id}`,
    EXPORT: (id: string) => `/reports/${id}/export`,
  },

  SUBSCRIPTIONS: {
    ALL: '/subscriptions',
    CANCEL: (id: string) => `/subscriptions/${id}`,
  },

  VOUCHERS: {
    ALL: '/vouchers',
    CREATE: '/vouchers',
    REDEEM: '/vouchers/redeem',
  },

  SUPPORT: {
    TICKETS: '/support/tickets',
  },

  NOTIFICATIONS: {
    PREFERENCES: '/notifications/preferences',
  },

  CASHBACK: {
    ALL: '/cashback',
  },

  BUDGET: {
    ALL: '/budget',
    CATEGORIES: '/budget/categories',
    BY_ID: (id: string) => `/budget/${id}`,
  },

  EXPENSES: {
    ALL: '/expenses',
    CATEGORIES: '/expenses/categories',
  },
};
