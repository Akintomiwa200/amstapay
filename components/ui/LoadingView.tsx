import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface LoadingViewProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export function LoadingView({ message, fullScreen = false, size = 'large' }: LoadingViewProps) {
  const { theme } = useTheme();

  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen, { backgroundColor: fullScreen ? theme.colors.background : 'transparent' }]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>}
    </View>
  );

  return content;
}

export function EmptyView({ message = 'No data available', icon }: { message?: string; icon?: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, styles.empty]}>
      {icon}
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, styles.empty]}>
      <Text style={[styles.emptyText, { color: theme.colors.error }]}>{message}</Text>
      {onRetry && (
        <Text
          style={[styles.retry, { color: theme.colors.primary }]}
          onPress={onRetry}
        >
          Tap to retry
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  fullScreen: { flex: 1 },
  message: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  empty: { paddingVertical: 60 },
  emptyText: { fontSize: 15, textAlign: 'center', fontWeight: '500' },
  retry: { marginTop: 12, fontSize: 14, fontWeight: '600' },
});

