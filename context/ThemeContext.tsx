// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color tokens for Light Theme - BluPay Theme
export const LightTheme = {
  colors: {
    // Primary colors from HTML
    primary: "#001360",
    primaryContainer: "#002395",
    primaryLight: "#dee1ff",
    primaryDim: "#bac3ff",
    primaryFixed: "#dee1ff",
    primaryFixedDim: "#bac3ff",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#8094ff",
    onPrimaryFixed: "#001159",
    onPrimaryFixedVariant: "#223aa8",

    // Secondary colors
    secondary: "#00677e",
    secondaryContainer: "#00d2fd",
    secondaryFixed: "#b4ebff",
    secondaryFixedDim: "#3cd7ff",
    onSecondary: "#ffffff",
    onSecondaryContainer: "#005669",
    onSecondaryFixed: "#001f27",
    onSecondaryFixedVariant: "#004e5f",

    // Tertiary colors
    tertiary: "#080075",
    tertiaryContainer: "#1509ad",
    tertiaryFixed: "#e1e0ff",
    tertiaryFixedDim: "#c0c1ff",
    onTertiary: "#ffffff",
    onTertiaryContainer: "#8e91ff",
    onTertiaryFixed: "#07006c",
    onTertiaryFixedVariant: "#2f2ebe",

    // Surface colors
    background: "#faf8ff",
    surface: "#faf8ff",
    surfaceDim: "#d2d9f4",
    surfaceBright: "#faf8ff",
    surfaceContainer: "#eaedff",
    surfaceContainerLow: "#f2f3ff",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerHigh: "#e2e7ff",
    surfaceContainerHighest: "#dae2fd",
    surfaceVariant: "#dae2fd",
    surfaceTint: "#3e54c1",
    inverseSurface: "#283044",
    inverseOnSurface: "#eef0ff",
    inversePrimary: "#bac3ff",

    // Text colors
    text: "#131b2e",
    textSecondary: "#444653",
    textDisabled: "#757684",
    onBackground: "#131b2e",
    onSurface: "#131b2e",
    onSurfaceVariant: "#444653",

    // Border & Status
    border: "#c5c5d5",
    outline: "#757684",
    outlineVariant: "#c5c5d5",
    error: "#ba1a1a",
    errorContainer: "#ffdad6",
    onError: "#ffffff",
    onErrorContainer: "#93000a",
    success: "#00d2fd",
    warning: "#f59e0b",
    info: "#3e54c1",

    // Gradient for splash
    gradientSplash: ["#002395", "#001360"],
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
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    bodyLarge: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
    labelSmall: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.04 },
    labelMedium: { fontSize: 14, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.02 },
    display: { fontSize: 48, fontWeight: '800' as const, lineHeight: 56, letterSpacing: -0.02 },
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

// Dark Theme
export const DarkTheme = {
  colors: {
    primary: "#bac3ff",
    primaryContainer: "#223aa8",
    primaryLight: "#001360",
    primaryDim: "#8094ff",
    primaryFixed: "#dee1ff",
    primaryFixedDim: "#bac3ff",
    onPrimary: "#001159",
    onPrimaryContainer: "#dee1ff",
    onPrimaryFixed: "#001159",
    onPrimaryFixedVariant: "#223aa8",

    secondary: "#3cd7ff",
    secondaryContainer: "#004e5f",
    secondaryFixed: "#b4ebff",
    secondaryFixedDim: "#3cd7ff",
    onSecondary: "#001f27",
    onSecondaryContainer: "#b4ebff",
    onSecondaryFixed: "#001f27",
    onSecondaryFixedVariant: "#004e5f",

    tertiary: "#c0c1ff",
    tertiaryContainer: "#2f2ebe",
    tertiaryFixed: "#e1e0ff",
    tertiaryFixedDim: "#c0c1ff",
    onTertiary: "#07006c",
    onTertiaryContainer: "#e1e0ff",
    onTertiaryFixed: "#07006c",
    onTertiaryFixedVariant: "#2f2ebe",

    background: "#131b2e",
    surface: "#1a2035",
    surfaceDim: "#131b2e",
    surfaceBright: "#283044",
    surfaceContainer: "#1e2540",
    surfaceContainerLow: "#181f33",
    surfaceContainerLowest: "#0f1525",
    surfaceContainerHigh: "#232b45",
    surfaceContainerHighest: "#2d3650",
    surfaceVariant: "#283044",
    surfaceTint: "#bac3ff",
    inverseSurface: "#eaedff",
    inverseOnSurface: "#131b2e",
    inversePrimary: "#001360",

    text: "#eef0ff",
    textSecondary: "#c5c5d5",
    textDisabled: "#757684",
    onBackground: "#eef0ff",
    onSurface: "#eef0ff",
    onSurfaceVariant: "#c5c5d5",

    border: "#283044",
    outline: "#757684",
    outlineVariant: "#444653",
    error: "#ffb4ab",
    errorContainer: "#93000a",
    onError: "#690005",
    onErrorContainer: "#ffdad6",
    success: "#3cd7ff",
    warning: "#f59e0b",
    info: "#bac3ff",

    gradientSplash: ["#001360", "#002395"],
  },
  spacing: { ...LightTheme.spacing },
  typography: {
    h1: { ...LightTheme.typography.h1, color: "#eef0ff" },
    h2: { ...LightTheme.typography.h2, color: "#eef0ff" },
    h3: { ...LightTheme.typography.h3, color: "#eef0ff" },
    h4: { ...LightTheme.typography.h4, color: "#eef0ff" },
    body: { ...LightTheme.typography.body, color: "#eef0ff" },
    bodySmall: { ...LightTheme.typography.bodySmall, color: "#c5c5d5" },
    bodyLarge: { ...LightTheme.typography.bodyLarge, color: "#eef0ff" },
    caption: { ...LightTheme.typography.caption, color: "#757684" },
    labelSmall: { ...LightTheme.typography.labelSmall, color: "#c5c5d5" },
    labelMedium: { ...LightTheme.typography.labelMedium, color: "#c5c5d5" },
    display: { ...LightTheme.typography.display, color: "#eef0ff" },
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
    return null;
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
