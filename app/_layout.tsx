import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";


export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, isDarkMode } = useTheme();

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),

      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.violet,
      notification: theme.colors.pink,
    },
  };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}