// components/withRefresh.tsx - HOC for pull-to-refresh
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, ScrollViewProps, ViewStyle } from 'react-native';

type WithRefreshProps = {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  style?: ViewStyle;
} & ScrollViewProps;

export default function WithRefresh({ children, onRefresh, style, ...props }: WithRefreshProps) {
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
      style={style}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}
