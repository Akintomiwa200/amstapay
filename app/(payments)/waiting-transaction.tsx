import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { transactionService } from '@/services/transactions';
import { useSocket } from '@/context/SocketContext';

const WaitingTransaction = () => {
  const router = useRouter();
  const { socket } = useSocket();
  const params = useLocalSearchParams();

  const {
    accountName = 'Sender',
    accountNumber = '',
    bank = 'AmstaPay',
    amount = '₦0.00',
    transactionId = '',
  } = params;

  useEffect(() => {
    const navigateSuccess = (reference?: string) => {
      router.replace({
        pathname: '/transaction-success',
        params: {
          accountName,
          accountNumber,
          bank,
          amount,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          reference: reference || `REF-${Date.now()}`,
        },
      } as any);
    };

    const pollStatus = async () => {
      if (!transactionId) return false;
      try {
        const data = await transactionService.getById(transactionId as string);
        const tx = (data as { data?: { status?: string; reference?: string } })?.data ?? data;
        const status = (tx as { status?: string }).status;
        if (status === 'success' || status === 'completed') {
          navigateSuccess((tx as { reference?: string }).reference);
          return true;
        }
        if (status === 'failed' || status === 'reversed') {
          router.replace('/transactions');
          return true;
        }
      } catch {
        // keep polling
      }
      return false;
    };

    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      interval = setInterval(async () => {
        const done = await pollStatus();
        if (done && interval) clearInterval(interval);
      }, 3000);
    };

    if (transactionId) {
      pollStatus().then((done) => {
        if (!done) startPolling();
      });
    } else {
      const timeout = setTimeout(() => navigateSuccess(), 8000);
      return () => clearTimeout(timeout);
    }

    const onStatus = (payload: { transactionId?: string; status?: string; reference?: string }) => {
      if (transactionId && payload.transactionId !== transactionId) return;
      if (payload.status === 'success' || payload.status === 'completed') {
        navigateSuccess(payload.reference);
      }
    };

    socket?.on('transaction:status', onStatus);
    socket?.on('transaction:new', onStatus);

    return () => {
      if (interval) clearInterval(interval);
      socket?.off('transaction:status', onStatus);
      socket?.off('transaction:new', onStatus);
    };
  }, [transactionId, socket]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F97316" style={styles.spinner} />
      <Text style={styles.title}>Waiting for Transaction</Text>
      <Text style={styles.subtitle}>Processing payment of {amount} from {accountName}</Text>
      {!!accountNumber && <Text style={styles.detailText}>Account: {accountNumber}</Text>}
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
  spinner: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 15 },
  detailText: { fontSize: 14, color: '#9CA3AF', marginBottom: 5 },
});
