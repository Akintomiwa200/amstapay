import { DEFAULT_CURRENCY } from './constants';

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
  GHS: 'GH₵',
  KES: 'KSh',
  ZAR: 'R',
};

export function getCurrencySymbol(code = DEFAULT_CURRENCY): string {
  return CURRENCY_SYMBOLS[code] || code;
}

export function formatMoney(amount: number, currency = DEFAULT_CURRENCY): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}
