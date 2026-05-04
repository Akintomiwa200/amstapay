// components/PullToRefresh.tsx
import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView, ScrollViewProps } from 'react-native';

interface PullToRefreshProps extends ScrollViewProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children, ...scrollViewProps }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
}
