import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { PersonalizationProvider } from "../context/PersonalizationContext";
import { AppProvider } from "../context/AppContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { useEffect } from "react";
import { registerPushToken } from "../utils/pushNotifications";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <PersonalizationProvider>
            <AppProvider>
              <SafeAreaProvider>
                <AppContent />
              </SafeAreaProvider>
            </AppProvider>
          </PersonalizationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, isDarkMode } = useTheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const first = segments[0];
    const isPublic =
      !first ||
      first === '(auth)' ||
      first === 'onboarding' ||
      first === 'login' ||
      first === 'signup' ||
      first === 'verify' ||
      first === 'forgot-password' ||
      first === 'verification-pending';

    if (!user && !isPublic) {
      router.replace('/login');
    } else if (user && (first === '(auth)' || first === 'login' || first === 'signup')) {
      router.replace('/dashboard');
    }
  }, [user, loading, segments]);

  useEffect(() => {
    if (user) registerPushToken();
  }, [user]);

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),

      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
      notification: theme.colors.secondaryContainer,
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