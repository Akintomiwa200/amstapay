import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE, STORAGE_KEYS } from '@/lib/constants';
import { ENDPOINTS } from '@/lib/endpoints';
import { storage } from '@/lib/storage';
import { useSocket } from '@/context/SocketContext';

export type NotificationPreferences = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEnabled: boolean;
};

const DEFAULT_PREFS: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  transactionAlerts: true,
  securityAlerts: true,
  marketingEnabled: false,
};

interface PersonalizationContextType {
  currency: string;
  locale: string;
  notificationPrefs: NotificationPreferences;
  setCurrency: (code: string) => Promise<void>;
  setLocale: (code: string) => Promise<void>;
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  refreshPreferences: () => Promise<void>;
  loading: boolean;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  const loadLocal = useCallback(async () => {
    const [savedCurrency, savedLocale] = await Promise.all([
      storage.get<string>(STORAGE_KEYS.CURRENCY),
      storage.get<string>('locale'),
    ]);
    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedLocale) setLocaleState(savedLocale);
  }, []);

  const refreshPreferences = useCallback(async () => {
    try {
      const res = await apiClient.get<NotificationPreferences>(ENDPOINTS.NOTIFICATIONS.PREFERENCES);
      const prefs = (res as { data?: NotificationPreferences })?.data ?? res;
      if (prefs && typeof prefs === 'object') {
        setNotificationPrefs({ ...DEFAULT_PREFS, ...prefs });
      }
    } catch {
      const cached = await storage.get<NotificationPreferences>('notificationPrefs');
      if (cached) setNotificationPrefs({ ...DEFAULT_PREFS, ...cached });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadLocal();
      await refreshPreferences();
      setLoading(false);
    })();
  }, [loadLocal, refreshPreferences]);

  useEffect(() => {
    if (!socket) return;
    const onPrefs = (payload: { preferences?: NotificationPreferences }) => {
      if (payload.preferences) {
        setNotificationPrefs((prev) => ({ ...prev, ...payload.preferences }));
      }
    };
    const onSecurity = () => {
      setNotificationPrefs((prev) => ({ ...prev, securityAlerts: true }));
    };
    socket.on('notification:preferences', onPrefs);
    socket.on('security:alert', onSecurity);
    return () => {
      socket.off('notification:preferences', onPrefs);
      socket.off('security:alert', onSecurity);
    };
  }, [socket]);

  const setCurrency = useCallback(async (code: string) => {
    setCurrencyState(code);
    await storage.set(STORAGE_KEYS.CURRENCY, code);
  }, []);

  const setLocale = useCallback(async (code: string) => {
    setLocaleState(code);
    await storage.set('locale', code);
  }, []);

  const updateNotificationPrefs = useCallback(async (prefs: Partial<NotificationPreferences>) => {
    const next = { ...notificationPrefs, ...prefs };
    setNotificationPrefs(next);
    await storage.set('notificationPrefs', next);
    try {
      await apiClient.put(ENDPOINTS.NOTIFICATIONS.PREFERENCES, next);
    } catch {
      // keep local copy when offline
    }
  }, [notificationPrefs]);

  const value = useMemo(
    () => ({
      currency,
      locale,
      notificationPrefs,
      setCurrency,
      setLocale,
      updateNotificationPrefs,
      refreshPreferences,
      loading,
    }),
    [currency, locale, notificationPrefs, setCurrency, setLocale, updateNotificationPrefs, refreshPreferences, loading],
  );

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}

export const usePersonalization = () => {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) throw new Error('usePersonalization must be used within PersonalizationProvider');
  return ctx;
};
