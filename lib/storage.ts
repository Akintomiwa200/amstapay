import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const secureKeys = new Set(['token', 'refreshToken', 'pin']);

const isSecure = (key: string) => secureKeys.has(key);

export const storage = {
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = isSecure(key)
        ? await SecureStore.getItemAsync(key)
        : await AsyncStorage.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      if (isSecure(key)) {
        await SecureStore.setItemAsync(key, stringValue);
      } else {
        await AsyncStorage.setItem(key, stringValue);
      }
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      if (isSecure(key)) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      for (const key of secureKeys) {
        await SecureStore.deleteItemAsync(key).catch(() => {});
      }
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};
