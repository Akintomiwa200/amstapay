import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

export const LightTheme = {
  dark: false,
  colors: {
    primary: '#2D0057',
    primaryLight: '#F3EFF8',
    primaryDark: '#1A0035',
    mint: '#22f0c3',
    blue: '#2db3ff',
    violet: '#8b5cf6',
    pink: '#ff3cac',
    background: '#FAF8FF',
    surface: '#FFFFFF',
    surfaceVariant: '#F3EFF8',
    text: '#1a0035',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    border: '#E8E0F0',
    borderLight: '#F3F4F6',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradientSplash: ['#22f0c3', '#2db3ff', '#8b5cf6', '#ff3cac'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    primary: '#bac3ff',
    primaryLight: '#2D0057',
    primaryDark: '#1A0035',
    mint: '#22f0c3',
    blue: '#2db3ff',
    violet: '#8b5cf6',
    pink: '#ff3cac',
    background: '#0D1117',
    surface: '#161B22',
    surfaceVariant: '#21262D',
    text: '#F0F6FC',
    textSecondary: '#8B949E',
    textLight: '#6B7280',
    border: '#30363D',
    borderLight: '#21262D',
    error: '#F85149',
    success: '#3FB950',
    warning: '#D29922',
    info: '#58A6FF',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradientSplash: ['#22f0c3', '#2db3ff', '#8b5cf6', '#ff3cac'],
  },
  spacing: { ...LightTheme.spacing },
  borderRadius: { ...LightTheme.borderRadius },
};

export type Theme = typeof LightTheme;

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get<string>(STORAGE_KEYS.THEME);
        if (saved === 'dark') setIsDarkMode(true);
        else if (saved === 'light') setIsDarkMode(false);
        else setIsDarkMode(systemColorScheme === 'dark');
      } catch {
        setIsDarkMode(systemColorScheme === 'dark');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [systemColorScheme]);

  const toggleTheme = useCallback(async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await storage.set(STORAGE_KEYS.THEME, next ? 'dark' : 'light');
  }, [isDarkMode]);

  const setThemeMode = useCallback(async (mode: 'light' | 'dark') => {
    const next = mode === 'dark';
    setIsDarkMode(next);
    await storage.set(STORAGE_KEYS.THEME, mode);
  }, []);

  const theme = isDarkMode ? DarkTheme : LightTheme;

  const value = useMemo(
    () => ({ theme, isDarkMode, toggleTheme, setThemeMode }),
    [theme, isDarkMode, toggleTheme, setThemeMode],
  );

  if (isLoading) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Backward-compatible re-export
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
