// lib/ocr.ts - OCR utility: on-device text recognition + backend fallback
import * as FileSystem from 'expo-file-system/legacy';
import { ocrService } from '@/services/ocr';

let TextRecognition: { recognize: (uri: string) => Promise<string[]> } | null = null;
try {
  TextRecognition = require('react-native-text-recognition');
} catch {
  console.warn('react-native-text-recognition not available in this build');
}

export type AccountType = 'nigerian' | 'international' | 'crypto' | 'unknown';

export interface ExtractedAccountData {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
  confidence: number;
  type: AccountType;
  amount?: string;
  rawText?: string;
  source?: 'device' | 'server';
}

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

export const INTERNATIONAL_BANKS = [
  'Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'HSBC',
  'Barclays', 'Lloyds', 'Santander', 'Deutsche Bank', 'BNP Paribas',
] as const;

export function detectBankName(text: string): { name: string; code?: string; type: 'nigerian' | 'international' | 'unknown' } {
  const lowerText = text.toLowerCase();

  for (const bank of NIGERIAN_BANKS) {
    for (const code of bank.codes) {
      if (lowerText.includes(code.toLowerCase())) {
        const numericCode = bank.codes.find(c => /^\d+$/.test(c));
        return { name: bank.name, code: numericCode, type: 'nigerian' };
      }
    }
  }

  for (const bank of INTERNATIONAL_BANKS) {
    if (lowerText.includes(bank.toLowerCase())) {
      return { name: bank, type: 'international' };
    }
  }

  const bankPatterns = [
    /(?:bank|banking|trust|financial|microfinance)\s*[:\-]?\s*([a-z\s]{3,40})/i,
  ];

  for (const pattern of bankPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
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
    if (match?.[1]) return match[1].trim();
  }
  return '';
}

export function detectCryptoAddress(text: string): { address: string; type: string } | null {
  const ethMatch = text.match(/\b(0x[a-fA-F0-9]{40})\b/);
  if (ethMatch) return { address: ethMatch[1], type: 'Ethereum' };

  const btcMatch = text.match(/\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/);
  if (btcMatch) return { address: btcMatch[1], type: 'Bitcoin' };

  return null;
}

export function detectAmount(text: string): string | undefined {
  const nairaMatch = text.match(/[₦N]\s*([\d,]+(?:\.\d{2})?)/i);
  if (nairaMatch) return nairaMatch[1].replace(/,/g, '');

  const dollarMatch = text.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
  if (dollarMatch) return dollarMatch[1].replace(/,/g, '');

  const amountPatterns = [
    /(?:amount|sum|total|price|value|pay(?:able)?)\s*[:\-]?\s*([\d,]+(?:\.\d{2})?)/i,
    /\b([\d,]{3,}(?:\.\d{2})?)\s*(?:naira|ngn)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].replace(/,/g, '');
  }

  return undefined;
}

export function parseRecognizedText(recognizedText: string): ExtractedAccountData {
  const cryptoResult = detectCryptoAddress(recognizedText);
  if (cryptoResult) {
    return {
      accountNumber: cryptoResult.address,
      accountName: '',
      bankName: `${cryptoResult.type} Wallet`,
      confidence: 0.98,
      type: 'crypto',
      amount: detectAmount(recognizedText),
      rawText: recognizedText,
      source: 'device',
    };
  }

  const bankResult = detectBankName(recognizedText);
  const accountName = detectAccountName(recognizedText);
  const amount = detectAmount(recognizedText);

  const accountRegex = /\b\d{10}\b/g;
  const matches = recognizedText.match(accountRegex);
  if (matches?.length) {
    return {
      accountNumber: matches[0],
      accountName,
      bankName: bankResult.name,
      bankCode: bankResult.code,
      confidence: 0.95,
      type: bankResult.type === 'unknown' ? 'nigerian' : bankResult.type,
      amount,
      rawText: recognizedText,
      source: 'device',
    };
  }

  const flexibleRegex = /(\d[\d\s\-]{8,}\d)/g;
  const flexibleMatches = recognizedText.match(flexibleRegex);
  if (flexibleMatches) {
    const cleaned = flexibleMatches[0].replace(/[\s\-]/g, '');
    if (cleaned.length === 10) {
      return {
        accountNumber: cleaned,
        accountName,
        bankName: bankResult.name,
        bankCode: bankResult.code,
        confidence: 0.85,
        type: bankResult.type === 'unknown' ? 'nigerian' : bankResult.type,
        amount,
        rawText: recognizedText,
        source: 'device',
      };
    }
  }

  return {
    accountNumber: '',
    accountName,
    bankName: bankResult.name,
    bankCode: bankResult.code,
    confidence: amount ? 0.4 : 0,
    type: 'unknown',
    amount,
    rawText: recognizedText,
    source: 'device',
  };
}

async function recognizeOnDevice(imageUri: string): Promise<string | null> {
  if (!TextRecognition?.recognize) return null;
  const lines = await TextRecognition.recognize(imageUri);
  if (!lines?.length) return null;
  return lines.join('\n');
}

async function recognizeOnServer(imageUri: string): Promise<ExtractedAccountData | null> {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const mimeType = imageUri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';

  try {
    const snap = await ocrService.snapExtract(base64, mimeType);
    const data = (snap as { data?: ExtractedAccountData })?.data ?? snap;
    return { ...data, source: 'server' };
  } catch {
    const result = await ocrService.extractFromImage(base64, mimeType);
    const data = (result as { data?: ExtractedAccountData })?.data ?? result;
    return { ...data, source: 'server' };
  }
}

export async function extractAccountData(imageUri: string): Promise<ExtractedAccountData> {
  let recognizedText: string | null = null;

  try {
    recognizedText = await recognizeOnDevice(imageUri);
    if (recognizedText?.trim()) {
      const parsed = parseRecognizedText(recognizedText);
      if (parsed.accountNumber || parsed.amount) return parsed;
    }
  } catch (error) {
    console.warn('On-device OCR failed:', error);
  }

  try {
    const serverResult = await recognizeOnServer(imageUri);
    if (serverResult && (serverResult.accountNumber || serverResult.amount || serverResult.rawText)) {
      if (!serverResult.rawText && recognizedText) {
        serverResult.rawText = recognizedText;
      }
      return serverResult;
    }
  } catch (error) {
    console.warn('Server OCR fallback failed:', error);
  }

  if (recognizedText?.trim()) {
    return parseRecognizedText(recognizedText);
  }

  throw new Error('Could not read text from the image. Enter details manually or retake the photo.');
}

export async function cleanupImageFile(imageUri: string | null): Promise<void> {
  if (!imageUri) return;
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri, { idempotent: true });
    }
  } catch (error) {
    console.warn('Failed to cleanup image file:', error);
  }
}
