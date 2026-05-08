import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface PullToRefreshProps extends ScrollViewProps {
  onRefresh: () => Promise<void> | void;
  refreshing?: boolean;
}

export function PullToRefresh({ onRefresh, refreshing: externalRefreshing, children, ...props }: PullToRefreshProps) {
  const { theme } = useTheme();
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const isControlled = externalRefreshing !== undefined;
  const refreshing = isControlled ? externalRefreshing : internalRefreshing;

  const handleRefresh = useCallback(async () => {
    if (!isControlled) setInternalRefreshing(true);
    try {
      await onRefresh();
    } finally {
      if (!isControlled) setInternalRefreshing(false);
    }
  }, [onRefresh, isControlled]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}

