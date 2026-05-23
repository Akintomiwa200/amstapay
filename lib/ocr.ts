// lib/ocr.ts - Shared OCR utility for account extraction
import * as FileSystem from 'expo-file-system';

// Try to import TextRecognition, but handle if it's not available
let TextRecognition: any = null;
try {
  TextRecognition = require('react-native-text-recognition');
} catch (error) {
  console.warn('react-native-text-recognition not available:', error);
}

export type AccountType = 'nigerian' | 'international' | 'crypto' | 'unknown';

export interface ExtractedAccountData {
  accountNumber: string;
  accountName: string;
  bankName: string;
  confidence: number;
  type: AccountType;
  amount?: string;
}

// Nigerian Banks Database
export const NIGERIAN_BANKS = [
  { name: 'Access Bank', codes: ['044', 'access', 'access bank'] },
  { name: 'Guaranty Trust Bank', codes: ['058', 'gtb', 'gtbank', 'gt bank'] },
  { name: 'Zenith Bank', codes: ['057', 'zenith'] },
  { name: 'First Bank', codes: ['011', 'firstbank', 'first bank', 'fbn'] },
  { name: 'United Bank for Africa', codes: ['033', 'uba'] },
  { name: 'Fidelity Bank', codes: ['070', 'fidelity'] },
  { name: 'Union Bank', codes: ['032', 'union'] },
  { name: 'Sterling Bank', codes: ['232', 'sterling'] },
  { name: 'Stanbic IBTC', codes: ['221', 'stanbic'] },
  { name: 'Ecobank', codes: ['050', 'ecobank'] },
  { name: 'First City Monument Bank', codes: ['214', 'fcmb'] },
  { name: 'Heritage Bank', codes: ['030', 'heritage'] },
  { name: 'Keystone Bank', codes: ['082', 'keystone'] },
  { name: 'Polaris Bank', codes: ['076', 'polaris'] },
  { name: 'Providus Bank', codes: ['101', 'providus'] },
  { name: 'Standard Chartered', codes: ['068', 'standard chartered', 'stanchart'] },
  { name: 'Wema Bank', codes: ['035', 'wema', 'alat'] },
  { name: 'Unity Bank', codes: ['215', 'unity'] },
  { name: 'OPay', codes: ['999992', 'opay'] },
  { name: 'PalmPay', codes: ['999991', 'palmpay'] },
  { name: 'Moniepoint', codes: ['999993', 'moniepoint'] },
  { name: 'Kuda Bank', codes: ['090', 'kuda'] },
  { name: 'Carbon', codes: ['carbon', 'paylater'] },
  { name: 'Rubies Bank', codes: ['rubies'] },
  { name: 'VFD Microfinance Bank', codes: ['vfd'] },
  { name: 'FairMoney', codes: ['fairmoney'] },
  { name: 'Branch', codes: ['branch'] },
  { name: 'Mintyn Bank', codes: ['mintyn'] },
  { name: 'Sparkle', codes: ['sparkle'] },
  { name: 'Titan Trust Bank', codes: ['titan'] },
  { name: 'Globus Bank', codes: ['globus'] },
  { name: 'Jaiz Bank', codes: ['jaiz'] },
  { name: 'Lotus Bank', codes: ['lotus'] },
  { name: 'TAJBank', codes: ['taj'] },
  { name: 'SunTrust Bank', codes: ['suntrust'] },
  { name: 'Peace Microfinance Bank', codes: ['peace'] },
  { name: 'Paycom (OPay)', codes: ['paycom'] },
] as const;

// International Bank Keywords
export const INTERNATIONAL_BANKS = [
  'Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'HSBC',
  'Barclays', 'Lloyds', 'Santander', 'Deutsche Bank', 'BNP Paribas',
  'Standard Chartered', 'UBS', 'Credit Suisse', 'Goldman Sachs',
  'JP Morgan', 'ICICI', 'HDFC', 'SBI', 'Axis Bank', 'PNC Bank',
  'Capital One', 'TD Bank', 'US Bank', 'Truist', 'Ally Bank',
  'Discover Bank', 'Fifth Third Bank', 'KeyBank', 'Regions Bank',
  ' Huntington Bank', 'M&T Bank', 'Citizens Bank', 'Comerica',
  'SVB', 'First Republic', 'SoFi', 'Marcus', 'Synchrony',
] as const;

export function detectBankName(text: string): { name: string; type: 'nigerian' | 'international' | 'unknown' } {
  const lowerText = text.toLowerCase();

  // Check Nigerian banks first
  for (const bank of NIGERIAN_BANKS) {
    for (const code of bank.codes) {
      if (lowerText.includes(code.toLowerCase())) {
        return { name: bank.name, type: 'nigerian' };
      }
    }
  }

  // Check international banks
  for (const bank of INTERNATIONAL_BANKS) {
    if (lowerText.includes(bank.toLowerCase())) {
      return { name: bank, type: 'international' };
    }
  }

  // Try to extract bank name using common patterns
  const bankPatterns = [
    /(?:bank|banking|trust|financial|microfinance)\s*[:\-]?\s*([a-z\s]{3,40})/i,
    /(?:b(?:an)?k\.?)\s*[:\-]?\s*([a-z\s]{3,40})/i,
  ];

  for (const pattern of bankPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (candidate.length > 2) {
        return { name: candidate, type: 'international' };
      }
    }
  }

  return { name: '', type: 'unknown' };
}

export function detectAccountName(text: string): string {
  const namePatterns = [
    /(?:name|acct\s*name|account\s*name|holder|beneficiary|recipient)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})/i,
    /(?:to\s*[:\-]?)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})/i,
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
    /(?:a\/c\s*name)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})/i,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return '';
}

export function detectCryptoAddress(text: string): { address: string; type: string } | null {
  // Ethereum: 0x + 40 hex chars
  const ethMatch = text.match(/\b(0x[a-fA-F0-9]{40})\b/);
  if (ethMatch) return { address: ethMatch[1], type: 'Ethereum' };

  // Bitcoin: starts with 1, 3, or bc1
  const btcMatch = text.match(/\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/);
  if (btcMatch) return { address: btcMatch[1], type: 'Bitcoin' };

  // Solana: base58 string, typically 32-44 chars
  const solMatch = text.match(/\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/);
  if (solMatch && /solana|sol/i.test(text)) {
    return { address: solMatch[1], type: 'Solana' };
  }

  // BNB Smart Chain
  const bscMatch = text.match(/\b(0x[a-fA-F0-9]{40})\b/);
  if (bscMatch && /bsc|binance|bnb/i.test(text)) {
    return { address: bscMatch[1], type: 'BNB Smart Chain' };
  }

  return null;
}

export function detectAmount(text: string): string | undefined {
  // Naira symbol amounts
  const nairaMatch = text.match(/[₦N]\s*([\d,]+(?:\.\d{2})?)/i);
  if (nairaMatch) return nairaMatch[1].replace(/,/g, '');

  // Dollar amounts
  const dollarMatch = text.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
  if (dollarMatch) return dollarMatch[1].replace(/,/g, '');

  // Amount keyword patterns
  const amountPatterns = [
    /(?:amount|sum|total|price|value)\s*[:\-]?\s*([\d,]+(?:\.\d{2})?)/i,
    /(?:amt)\s*[:\-]?\s*([\d,]+(?:\.\d{2})?)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/,/g, '');
    }
  }

  return undefined;
}

export async function extractAccountData(imageUri: string): Promise<ExtractedAccountData> {
  try {
    // Check if TextRecognition is available
    if (!TextRecognition || typeof TextRecognition.recognize !== 'function') {
      throw new Error('OCR library not available. Please ensure react-native-text-recognition is properly installed.');
    }

    const recognizedLines = await TextRecognition.recognize(imageUri);
    
    if (!recognizedLines || !Array.isArray(recognizedLines)) {
      throw new Error('OCR recognition returned invalid data');
    }

    const recognizedText = recognizedLines.join('\n');

    // Check for crypto wallet first
    const cryptoResult = detectCryptoAddress(recognizedText);
    if (cryptoResult) {
      return {
        accountNumber: cryptoResult.address,
        accountName: '',
        bankName: cryptoResult.type + ' Wallet',
        confidence: 0.98,
        type: 'crypto',
        amount: detectAmount(recognizedText),
      };
    }

    // Detect bank name
    const bankResult = detectBankName(recognizedText);

    // Detect account name
    const accountName = detectAccountName(recognizedText);

    // Detect amount
    const amount = detectAmount(recognizedText);

    // Extract 10-digit account number (Nigerian format)
    const accountRegex = /\b\d{10}\b/g;
    const matches = recognizedText.match(accountRegex);

    if (matches && matches.length > 0) {
      return {
        accountNumber: matches[0],
        accountName,
        bankName: bankResult.name,
        confidence: 0.95,
        type: bankResult.type === 'unknown' ? 'nigerian' : bankResult.type,
        amount,
      };
    }

    // Try to find numbers with spaces/dashes
    const flexibleRegex = /(\d[\d\s\-]{8,}\d)/g;
    const flexibleMatches = recognizedText.match(flexibleRegex);

    if (flexibleMatches) {
      const cleaned = flexibleMatches[0].replace(/[\s\-]/g, '');
      if (cleaned.length === 10) {
        return {
          accountNumber: cleaned,
          accountName,
          bankName: bankResult.name,
          confidence: 0.85,
          type: bankResult.type === 'unknown' ? 'nigerian' : bankResult.type,
          amount,
        };
      }
      // International account (longer numbers)
      if (cleaned.length > 10 && cleaned.length <= 18) {
        return {
          accountNumber: cleaned,
          accountName,
          bankName: bankResult.name || 'International Bank',
          confidence: 0.80,
          type: 'international',
          amount,
        };
      }
      // IBAN-style (very long)
      if (cleaned.length > 18 && cleaned.length <= 34) {
        return {
          accountNumber: cleaned,
          accountName,
          bankName: bankResult.name || 'International Bank',
          confidence: 0.75,
          type: 'international',
          amount,
        };
      }
    }

    return {
      accountNumber: '',
      accountName: '',
      bankName: '',
      confidence: 0,
      type: 'unknown',
      amount,
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    throw new Error('Failed to extract account information from image');
  }
}

export async function cleanupImageFile(imageUri: string | null): Promise<void> {
  if (!imageUri) return;
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri, { idempotent: true });
    }
  } catch (error) {
    // Silently ignore cleanup errors
    console.warn('Failed to cleanup image file:', error);
  }
}
