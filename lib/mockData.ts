// Mock data for UI testing and development
import type { Transaction, User } from '@/lib/models';

interface WalletBalance {
  balance: number;
}

export const MOCK_USER: User = {
  _id: '1',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  accountType: 'personal',
  isVerified: true,
  role: 'user',
  blupayAccountNumber: '1234567890',
  kycLevel: 2,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    _id: '1',
    sender: 'John Doe',
    receiverName: 'Jane Smith',
    receiverAccountNumber: '0987654321',
    receiverBank: 'Bank of America',
    amount: 100,
    type: 'normal_transfer',
    reference: 'REF123456',
    description: 'Dinner payment',
    createdAt: '2023-05-15T14:30:00.000Z',
    updatedAt: '2023-05-15T14:30:00.000Z',
    status: 'success',
  },
  {
    _id: '2',
    sender: 'John Doe',
    receiverName: 'Amazon',
    receiverAccountNumber: '0987654321',
    receiverBank: 'Chase',
    amount: 75.5,
    type: 'qr_payment',
    reference: 'REF789012',
    description: 'Online shopping',
    createdAt: '2023-05-10T10:15:00.000Z',
    updatedAt: '2023-05-10T10:15:00.000Z',
    status: 'success',
  },
  {
    _id: '3',
    sender: 'John Doe',
    receiverName: 'John Doe',
    receiverAccountNumber: '1234567890',
    receiverBank: 'Chase',
    amount: 200,
    type: 'normal_transfer',
    reference: 'REF345678',
    description: 'Wallet funding',
    createdAt: '2023-05-08T09:00:00.000Z',
    updatedAt: '2023-05-08T09:00:00.000Z',
    status: 'success',
  },
];

export const MOCK_WALLET_BALANCE: WalletBalance = {
  balance: 1250.75,
};

// Services data
export const SERVICES = [
  { id: 'airtime', name: 'Airtime', icon: 'phone' },
  { id: 'data', name: 'Data', icon: 'wifi' },
  { id: 'betting', name: 'Betting', icon: 'trophy' },
  { id: 'tv', name: 'TV', icon: 'tv' },
  { id: 'electricity', name: 'Electricity', icon: 'zap' },
  { id: 'giftcard', name: 'Gift Card', icon: 'gift' },
  { id: 'schoolfees', name: 'School Fees', icon: 'graduation-cap' },
  { id: 'transport', name: 'Transport', icon: 'bus' },
  { id: 'insurance', name: 'Insurance', icon: 'shield' },
  { id: 'gaming', name: 'Gaming', icon: 'gamepad' },
];

// Quick actions
export const QUICK_ACTIONS = [
  { id: 'scan', name: 'Scan', icon: 'scan' },
  { id: 'send', name: 'Send', icon: 'send' },
  { id: 'qr', name: 'QR Code', icon: 'qr-code' },
  { id: 'request', name: 'Request', icon: 'receive' },
];
