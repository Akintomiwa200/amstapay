// app/wallet.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, Clock, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';

const Wallet = () => {
  const router = useRouter();
  const { getWalletBalance, getTransactions } = useAuth();
  const { socket } = useSocket();

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [balRes, txRes] = await Promise.all([getWalletBalance?.(), getTransactions?.()]);

        setBalance(Number((balRes as any)?.balance || 0));

        const list = Array.isArray(txRes)
          ? txRes
          : Array.isArray((txRes as any)?.transactions)
          ? (txRes as any).transactions
          : Array.isArray((txRes as any)?.data)
          ? (txRes as any).data
          : [];

        setTransactions(list.slice(0, 10));
      } catch {
        setBalance(0);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    load();

    if (socket) {
      socket.on('wallet:update', (data: any) => {
        setBalance(Number(data.balance));
      });
      socket.on('transaction:new', (data: any) => {
        setTransactions(prev => [data.transaction, ...prev].slice(0, 10));
      });

      return () => {
        socket.off('wallet:update');
        socket.off('transaction:new');
      };
    }
  }, [getWalletBalance, getTransactions, socket]);

  const trendText = useMemo(() => (transactions.length > 0 ? `${transactions.length} recent transactions` : 'No recent transactions'), [transactions.length]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet Balance</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={() => router.push('/transactions')}>
          <Download size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
          <View style={styles.balanceTrend}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.trendText}>{trendText}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/add-money')}>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/add-account')}>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactions}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {loading && <ActivityIndicator color="#FF8C00" style={{ marginVertical: 12 }} />}
          {!loading && transactions.length === 0 && <Text style={styles.transactionDate}>No wallet transactions found.</Text>}
          {transactions.map((txn, idx) => {
            const amount = Number(txn?.amount || 0);
            const isPositive = amount >= 0;
            const createdAt = txn?.createdAt ? new Date(txn.createdAt).toLocaleString() : 'Recently';

            return (
              <View key={txn?._id || idx} style={styles.transaction}>
                <View style={styles.transactionLeft}>
                  <Clock size={20} color="#666666" />
                  <View>
                    <Text style={styles.transactionType}>{txn?.type || 'Transaction'}</Text>
                    <Text style={styles.transactionDate}>{createdAt}</Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, isPositive ? styles.positive : styles.negative]}>
                  {isPositive ? '+' : '-'}₦{Math.abs(amount).toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000000' },
  downloadButton: { padding: 8 },
  scrollView: { flex: 1 },
  balanceCard: { backgroundColor: '#FF8C00', margin: 16, padding: 24, borderRadius: 16 },
  balanceLabel: { color: '#FFFFFF', fontSize: 16, marginBottom: 8 },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  balanceTrend: { flexDirection: 'row', alignItems: 'center' },
  trendText: { color: '#FFFFFF', marginLeft: 8, fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  actionButton: { backgroundColor: '#FF8C00', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  actionText: { color: '#FFFFFF', fontWeight: '600' },
  transactions: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000000', marginBottom: 16 },
  transaction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  transactionType: { fontSize: 16, fontWeight: '500', color: '#000000' },
  transactionDate: { fontSize: 12, color: '#666666' },
  transactionAmount: { fontSize: 16, fontWeight: '600' },
  positive: { color: '#10B981' },
  negative: { color: '#EF4444' },
});

export default Wallet;
