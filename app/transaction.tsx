import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SectionList, ActivityIndicator } from 'react-native';
import { ArrowUpRight, ArrowDownRight, CreditCard, Filter, Receipt } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const Transactions = () => {
  const router = useRouter();
  const { getWalletTransactions, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
    { id: 'transfer', label: 'Transfer' },
  ];

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000); // optional polling
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getWalletTransactions();
      setTransactions(data);
    } catch (err: any) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptPress = (transactionId: string) => {
    router.push(`/receipt/${transactionId}`);
  };

  // Filter and group by date
  const groupedTransactions = () => {
    let filtered = transactions;

    if (selectedFilter === 'income') filtered = transactions.filter(t => t.amount > 0);
    if (selectedFilter === 'expense') filtered = transactions.filter(t => t.amount < 0);
    if (selectedFilter === 'transfer') filtered = transactions.filter(t => t.type.toLowerCase() === 'transfer');

    // Group by day (Today, Yesterday, or Month Year)
    const groups: { [key: string]: any[] } = {};
    filtered.forEach(txn => {
      const date = dayjs(txn.createdAt);
      const today = dayjs();
      const yesterday = dayjs().subtract(1, 'day');

      let title = date.format('MMMM YYYY');
      if (date.isSame(today, 'day')) title = 'Today';
      else if (date.isSame(yesterday, 'day')) title = 'Yesterday';

      if (!groups[title]) groups[title] = [];
      groups[title].push(txn);
    });

    return Object.keys(groups).map(key => ({ title: key, data: groups[key] }));
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={[
        styles.transactionIcon,
        item.amount > 0 ? styles.incomeBg :
        item.type.toLowerCase() === 'transfer' ? styles.transferBg :
        styles.billBg
      ]}>
        {item.amount > 0 ? <ArrowDownRight size={16} color="#fff" /> :
         item.type.toLowerCase() === 'transfer' ? <ArrowUpRight size={16} color="#fff" /> :
         <CreditCard size={16} color="#fff" />}
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{dayjs(item.createdAt).format('h:mm A')}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.amount > 0 ? styles.positiveAmount : styles.negativeAmount]}>
        {item.amount > 0 ? `+₦${item.amount.toLocaleString()}` : `-₦${Math.abs(item.amount).toLocaleString()}`}
      </Text>
      <TouchableOpacity style={styles.receiptButton} onPress={() => handleReceiptPress(item._id)}>
        <Receipt size={18} color="#F97316" />
      </TouchableOpacity>
    </View>
  );

  if (loading || authLoading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#F97316" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterPill, selectedFilter === filter.id && styles.filterPillActive]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[styles.filterText, selectedFilter === filter.id && styles.filterTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionList
        sections={groupedTransactions()}
        keyExtractor={(item) => item._id}
        renderItem={renderTransaction}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        style={styles.transactionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#F97316', padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#FFFFFF' },
  filterButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 8, borderRadius: 8 },
  filterContainer: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filterPill: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  filterPillActive: { backgroundColor: '#F97316' },
  filterText: { color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  transactionList: { flex: 1, padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12, marginTop: 16 },
  transactionCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  incomeBg: { backgroundColor: '#10B981' },
  billBg: { backgroundColor: '#EF4444' },
  transferBg: { backgroundColor: '#8B5CF6' },
  transactionInfo: { flex: 1 },
  transactionType: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  transactionDate: { fontSize: 12, color: '#6B7280' },
  transactionAmount: { fontSize: 16, fontWeight: '600', marginRight: 12 },
  positiveAmount: { color: '#10B981' },
  negativeAmount: { color: '#EF4444' },
  receiptButton: { padding: 8, borderRadius: 8, backgroundColor: '#FEF3C7' },
});

export default Transactions;
