import { Platform } from 'react-native';
import { userService } from '@/services/user';
import { logger } from '@/lib/logger';

let registered = false;

export async function registerPushToken(): Promise<void> {
  if (registered || Platform.OS === 'web') return;

  try {
    const Notifications = await import('expo-notifications');
    const Device = await import('expo-device');

    if (!Device.isDevice) return;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    if (token) {
      await userService.updateDeviceToken(token);
      registered = true;
      logger.debug('Push token registered');
    }
  } catch (error) {
    logger.debug('Push registration skipped:', error);
  }
}

export function resetPushRegistration() {
  registered = false;
}
