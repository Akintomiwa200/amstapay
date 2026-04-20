// app/transactions/index.tsx
import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, Filter, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

const TransactionsScreen = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const transactions = [
    { id: 1, type: 'Salary Deposit', amount: '+50,000', date: '2024-03-15', time: '10:45 AM', category: 'income', status: 'completed' },
    { id: 2, type: 'Electricity Bill', amount: '-15,000', date: '2024-03-14', time: '3:20 PM', category: 'expense', status: 'completed' },
    { id: 3, type: 'Transfer to John', amount: '-25,000', date: '2024-03-12', time: '9:15 AM', category: 'expense', status: 'completed' },
    { id: 4, type: 'Airtime Purchase', amount: '-2,500', date: '2024-03-10', time: '6:30 PM', category: 'expense', status: 'completed' },
    { id: 5, type: 'Investment Return', amount: '+8,200', date: '2024-03-08', time: '11:00 AM', category: 'income', status: 'completed' },
    { id: 6, type: 'Bill Payment', amount: '-10,000', date: '2024-03-05', time: '2:00 PM', category: 'expense', status: 'pending' },
  ];

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === filter);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transactions</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={C.textSub} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={C.textSub}
          />
          <TouchableOpacity>
            <Filter size={18} color={C.violet} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {['all', 'income', 'expense'].map((f) => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {filteredTransactions.map((txn) => (
          <TouchableOpacity key={txn.id} style={styles.transactionCard}>
            <View style={[
              styles.transactionIcon,
              txn.category === 'income' ? styles.incomeBg : styles.expenseBg
            ]}>
              {txn.category === 'income' ? 
                <ArrowDownRight size={20} color="#fff" /> : 
                <ArrowUpRight size={20} color="#fff" />
              }
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{txn.type}</Text>
              <View style={styles.transactionMeta}>
                <Calendar size={12} color={C.textSub} />
                <Text style={styles.transactionDate}>{txn.date} • {txn.time}</Text>
              </View>
              {txn.status === 'pending' && (
                <Text style={styles.pendingBadge}>Pending</Text>
              )}
            </View>
            <Text style={[
              styles.transactionAmount,
              txn.category === 'income' ? styles.positiveAmount : styles.negativeAmount
            ]}>
              {txn.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, fontSize: 15, color: C.text },
  filterRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { fontSize: 13, color: C.textSub },
  filterTextActive: { color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  transactionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  incomeBg: { backgroundColor: C.success },
  expenseBg: { backgroundColor: C.error },
  transactionInfo: { flex: 1 },
  transactionType: { fontSize: 15, fontWeight: '600', color: C.text, marginBottom: 4 },
  transactionMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  transactionDate: { fontSize: 12, color: C.textSub },
  pendingBadge: { fontSize: 10, color: C.warning, marginTop: 4 },
  transactionAmount: { fontSize: 16, fontWeight: '700' },
  positiveAmount: { color: C.success },
  negativeAmount: { color: C.error },
});

export default TransactionsScreen;