import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Copy } from 'lucide-react-native';

const ReceiptScreen = () => {
  const router = useRouter();
  const { transactionId } = useSearchParams(); // get :transactionId param
  const { getTransaction } = useAuth();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transactionId) fetchTransaction(transactionId as string);
  }, [transactionId]);

  const fetchTransaction = async (id: string) => {
    try {
      setLoading(true);
      const data = await getTransaction(id);
      setTransaction(data);
    } catch (err) {
      console.error('Failed to fetch transaction', err);
    } finally {
      setLoading(false);
    }
  };

  const copyReference = () => {
    if (transaction?.reference) {
      navigator.clipboard.writeText(transaction.reference);
      alert('Reference copied!');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;

  if (!transaction)
    return (
      <View style={styles.center}>
        <Text>Transaction not found</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt</Text>
      </View>

      {/* Transaction Summary */}
      <View style={styles.card}>
        <Text style={styles.label}>Transaction Type</Text>
        <Text style={styles.value}>{transaction.type}</Text>

        <Text style={styles.label}>Amount</Text>
        <Text
          style={[
            styles.value,
            transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount,
          ]}
        >
          {transaction.amount > 0
            ? `+₦${transaction.amount.toLocaleString()}`
            : `-₦${Math.abs(transaction.amount).toLocaleString()}`}
        </Text>

        <Text style={styles.label}>Sender</Text>
        <Text style={styles.value}>{transaction.sender}</Text>

        <Text style={styles.label}>Receiver</Text>
        <Text style={styles.value}>{transaction.receiverName}</Text>

        <Text style={styles.label}>Receiver Account</Text>
        <Text style={styles.value}>{transaction.receiverAccountNumber}</Text>

        <Text style={styles.label}>Receiver Bank</Text>
        <Text style={styles.value}>{transaction.receiverBank}</Text>

        <Text style={styles.label}>Reference</Text>
        <View style={styles.referenceContainer}>
          <Text style={styles.value}>{transaction.reference}</Text>
          <TouchableOpacity onPress={copyReference}>
            <Copy size={18} color="#F97316" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, transaction.status === 'completed' ? styles.completed : styles.pending]}>
          {transaction.status}
        </Text>

        {transaction.description && (
          <>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{transaction.description}</Text>
          </>
        )}

        <Text style={styles.label}>Date & Time</Text>
        <Text style={styles.value}>{new Date(transaction.createdAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 8, borderRadius: 8, backgroundColor: '#F8F8F8', marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#111827' },
  card: { backgroundColor: '#FFFFFF', margin: 16, padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  label: { fontSize: 12, color: '#6B7280', marginTop: 12 },
  value: { fontSize: 16, color: '#111827', fontWeight: '500', marginTop: 4 },
  positiveAmount: { color: '#10B981' },
  negativeAmount: { color: '#EF4444' },
  referenceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  completed: { color: '#10B981', fontWeight: '600' },
  pending: { color: '#F97316', fontWeight: '600' },
});

export default ReceiptScreen;
