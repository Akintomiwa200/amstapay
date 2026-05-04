// Centralized color tokens for AmstaPay
export const colors = {
  // Primary colors
  primary: '#2D0057',
  primaryLight: '#F3EFF8',
  primaryDark: '#1A0035',

  // Accent colors
  mint: '#22f0c3',
  blue: '#2db3ff',
  violet: '#8b5cf6',
  pink: '#ff3cac',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Text colors
  text: '#1a0035',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  // Background colors
  bg: '#FFFFFF',
  bgSecondary: '#F3EFF8',
  bgDark: '#1A0035',

  // Border colors
  border: '#E8E0F0',
  borderLight: '#F3F4F6',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
