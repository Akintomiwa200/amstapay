import * as Crypto from 'expo-crypto';

export const crypto = {
  generateUUID: (): string => {
    return Crypto.randomUUID();
  },

  generateRandomString: async (length = 32): Promise<string> => {
    const bytes = await Crypto.getRandomBytesAsync(length);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  },

  sha256: async (data: string): Promise<string> => {
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);
    return digest;
  },
};
