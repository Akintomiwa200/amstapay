// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color tokens for Light Theme
export const LightTheme = {
  colors: {
    // Brand Colors
    primary: "#2D0057",
    primaryLight: "#F3EFF8",
    primaryDark: "#1a0035",
    
    // Accent Colors
    mint: "#22f0c3",
    blue: "#2db3ff",
    violet: "#8b5cf6",
    pink: "#ff3cac",
    
    // UI Colors
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#FAF8FC",
    
    // Text Colors
    text: "#1a0035",
    textSecondary: "#6B7280",
    textDisabled: "#B0A8C0",
    
    // Border & Status
    border: "#E8E0F0",
    error: "#ef4444",
    success: "#22f0c3",
    warning: "#f59e0b",
    info: "#2db3ff",
    
    // Gradients
    gradientPrimary: ["#2D0057", "#8b5cf6"],
    gradientAccent: ["#22f0c3", "#2db3ff", "#8b5cf6", "#ff3cac"],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: '800' as const, lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },
};

// Dark Theme
export const DarkTheme = {
  colors: {
    primary: "#8b5cf6",
    primaryLight: "#2D0057",
    primaryDark: "#F3EFF8",
    
    mint: "#22f0c3",
    blue: "#2db3ff",
    violet: "#a78bfa",
    pink: "#ff3cac",
    
    background: "#0a0a0a",
    surface: "#1a1a1a",
    surfaceAlt: "#2a2a2a",
    
    text: "#FFFFFF",
    textSecondary: "#9ca3af",
    textDisabled: "#6b7280",
    
    border: "#2a2a2a",
    error: "#ef4444",
    success: "#22f0c3",
    warning: "#f59e0b",
    info: "#2db3ff",
    
    gradientPrimary: ["#8b5cf6", "#2D0057"],
    gradientAccent: ["#22f0c3", "#2db3ff", "#8b5cf6", "#ff3cac"],
  },
  spacing: { ...LightTheme.spacing },
  typography: {
    h1: { ...LightTheme.typography.h1, color: "#FFFFFF" },
    h2: { ...LightTheme.typography.h2, color: "#FFFFFF" },
    h3: { ...LightTheme.typography.h3, color: "#FFFFFF" },
    h4: { ...LightTheme.typography.h4, color: "#FFFFFF" },
    body: { ...LightTheme.typography.body, color: "#e5e5e5" },
    bodySmall: { ...LightTheme.typography.bodySmall, color: "#9ca3af" },
    caption: { ...LightTheme.typography.caption, color: "#6b7280" },
  },
  borderRadius: { ...LightTheme.borderRadius },
};

type ThemeType = typeof LightTheme;

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      } else if (savedTheme === 'light') {
        setIsDarkMode(false);
      } else {
        // Use system preference
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    await AsyncStorage.setItem('themePreference', newDarkMode ? 'dark' : 'light');
  };

  const setTheme = async (theme: 'light' | 'dark') => {
    const newDarkMode = theme === 'dark';
    setIsDarkMode(newDarkMode);
    await AsyncStorage.setItem('themePreference', newDarkMode ? 'dark' : 'light');
  };

  const theme = isDarkMode ? DarkTheme : LightTheme;

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};