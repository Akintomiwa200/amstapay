import * as LocalAuthentication from 'expo-local-authentication';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

export const biometricAuth = {
  isAvailable: async (): Promise<boolean> => {
    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  },

  getSupportedTypes: async (): Promise<LocalAuthentication.AuthenticationType[]> => {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch {
      return [];
    }
  },

  authenticate: async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  },

  isEnabled: async (): Promise<boolean> => {
    const enabled = await storage.get<string>(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return enabled === 'true';
  },

  setEnabled: async (enabled: boolean): Promise<void> => {
    await storage.set(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  },

  getTypeName: (type: LocalAuthentication.AuthenticationType): string => {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Fingerprint';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Face ID';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Iris';
      default:
        return 'Biometric';
    }
  },
};
