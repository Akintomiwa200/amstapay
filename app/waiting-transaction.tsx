// waiting-transaction.tsx
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const WaitingTransaction = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    accountName = "Sender",
    accountNumber = "1234567890",
    bank = "AmstaPay",
    amount = "₦5,000.00"
  } = params;

  useEffect(() => {
    // After 5 seconds, navigate to transaction success
    const timer = setTimeout(() => {
      router.push({
        pathname: '/transaction-success',
        params: {
          accountName,
          accountNumber,
          bank,
          amount,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          reference: "REF-" + Math.random().toString(36).substring(2, 11).toUpperCase()
        }
      } as any);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F97316" style={styles.spinner} />
      <Text style={styles.title}>Waiting for Transaction</Text>
      <Text style={styles.subtitle}>Processing payment of {amount} from {accountName}</Text>
      <Text style={styles.detailText}>Account: {accountNumber}</Text>
      <Text style={styles.detailText}>Bank: {bank}</Text>
    </View>
  );
};

export default WaitingTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 5,
  },
});