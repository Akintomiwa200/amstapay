export interface User {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  accountType?: 'personal' | 'business' | 'enterprise' | 'company' | 'agent';
  isVerified?: boolean;
  isOtpVerified?: boolean;
  role?: string;
  blupayAccountNumber?: string;
  kycLevel?: number;
  dateOfBirth?: string;
  gender?: string;
  residentialAddress?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  guarantorName?: string;
  guarantorRelationship?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;
  passportPhoto?: string;
  idDocument?: string;
  utilityBill?: string;
  termsAgreed?: boolean;
  infoAccurate?: boolean;
  verificationConsent?: boolean;
  verifications?: unknown[];
  deviceToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wallet {
  _id: string;
  user: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyWallet {
  _id: string;
  currency: string;
  balance: number;
}

export interface Transaction {
  _id: string;
  sender: string;
  receiverName: string;
  receiverAccountNumber: string;
  receiverBank: string;
  amount: number;
  type: 'qr_payment' | 'normal_transfer' | 'airtime' | 'data' | 'merchant_payment' | 'payment_url';
  status: 'pending' | 'success' | 'failed' | 'reversed';
  qrData?: string;
  reference?: string;
  merchantId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  _id: string;
  type: 'airtime' | 'data' | 'electricity' | 'schoolfees' | 'transport' | 'betting' | 'tv' | 'insurance';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  provider?: string;
  reference?: string;
  createdAt: string;
}

export interface SavingsGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Investment {
  _id: string;
  plan: InvestmentPlan;
  amount: number;
  duration: number;
  status: 'ACTIVE' | 'PENDING' | 'MATURED' | 'CANCELLED';
  startDate: string;
  maturityDate: string;
  expectedReturns: number;
  autoReinvest: boolean;
  createdAt: string;
}

export interface InvestmentPlan {
  _id: string;
  code: string;
  name: string;
  description: string;
  type: 'mutual-fund' | 'stocks' | 'treasury-bills' | 'bonds' | 'fixed-savings' | 'high-yield';
  roi: number;
  minInvestment: number;
  maxInvestment: number;
  durations: number[];
  riskLevel: 'low' | 'medium' | 'high';
  payoutSchedule: 'monthly' | 'quarterly' | 'yearly' | 'maturity';
}

export interface Loan {
  _id: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'REPAID' | 'DEFAULTED' | 'REJECTED';
  purpose?: string;
  monthlyRepayment: number;
  totalRepayment: number;
  remainingBalance: number;
  nextPaymentDate?: string;
  createdAt: string;
}

export interface Beneficiary {
  _id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  nickname?: string;
  isFavorite?: boolean;
  createdAt: string;
}

export interface VirtualCard {
  _id: string;
  cardType: string;
  last4: string;
  status: 'active' | 'frozen' | 'cancelled';
  balance: number;
  currency: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginInput {
  emailOrPhone: string;
  password: string;
}

export interface SignupInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  accountType: 'personal' | 'business';
  dateOfBirth?: string;
  gender?: string;
  residentialAddress?: string;
  pin?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  termsAgreed: boolean;
  infoAccurate: boolean;
  verificationConsent: boolean;
}

export interface AirtimeInput {
  network: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE';
  phoneNumber: string;
  amount: number;
}

export interface DataInput {
  network: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE';
  phoneNumber: string;
  dataPlanId: string;
  amount: number;
}

export interface ElectricityInput {
  meterNumber: string;
  amount: number;
  provider: 'IKEDC' | 'EKEDC' | 'PHCN' | 'ABUJA_DISCO' | 'LAGOS_DISCO';
  meterType?: 'PREPAID' | 'POSTPAID';
}

export interface TransferInput {
  recipientAccountNumber: string;
  amount: number;
  description?: string;
}

export interface FundWalletInput {
  amount: number;
  paymentMethod?: string;
}

export interface WithdrawInput {
  amount: number;
  accountDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}
