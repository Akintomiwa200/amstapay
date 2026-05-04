// utils/biometric.ts
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BiometricAuth = {
  // Check if device has biometric hardware and is enrolled
  isAvailable: async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  },

  // Get supported authentication types
  getSupportedTypes: async (): Promise<LocalAuthentication.AuthenticationType[]> => {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  },

  // Authenticate with biometrics
  authenticate: async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error('Error during authentication:', error);
      return false;
    }
  },

  // Check if biometric is enabled in app settings
  isEnabled: async (): Promise<boolean> => {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric setting:', error);
      return false;
    }
  },

  // Enable/disable biometric in app settings
  setEnabled: async (enabled: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem('biometricEnabled', enabled.toString());
    } catch (error) {
      console.error('Error saving biometric setting:', error);
    }
  },

  // Get biometric type name for display
  getTypeName: (type: LocalAuthentication.AuthenticationType): string => {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Fingerprint';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Face Recognition';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Iris Scanner';
      default:
        return 'Biometric';
    }
  },
};
