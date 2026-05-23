// app/snap-account.tsx - Redirects to unified scan-send flow
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function SnapAccountScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified scan-send screen
    router.replace('/scan-send');
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6B4EFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
