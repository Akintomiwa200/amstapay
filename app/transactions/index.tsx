// app/transactions/index.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, Filter, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';
import { useAuth } from '@/context/AuthContext';

type UiTxn = {
  id: string;
  type: string;
  amount: number;
  date: string;
  time: string;
  category: 'income' | 'expense';
  status: string;
};

const TransactionsScreen = () => {
  const router = useRouter();
  const { getTransactions } = useAuth();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<UiTxn[]>([]);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      const list = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.transactions)
        ? (response as any).transactions
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];
      
      const mapped: UiTxn[] = list.map((t: any) => {
        const amt = Number(t.amount || 0);
        const created = t.createdAt ? new Date(t.createdAt) : new Date();
        return {
          id: t._id || t.id || Math.random().toString(36),
          type: t.type || t.description || 'Transaction',
          amount: Math.abs(amt),
          date: created.toLocaleDateString(),
          time: created.toLocaleTimeString(),
          category: amt >= 0 ? 'income' : 'expense' as 'income' | 'expense',
          status: t.status || 'completed',
        };
      });
      
      setTransactions(mapped);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [getTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleRefresh = useCallback(async () => {
    await loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const base = filter === 'all' ? transactions : transactions.filter((t) => t.category === filter);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter((t) => t.type.toLowerCase().includes(q));
  }, [transactions, filter, search]);

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
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity>
            <Filter size={18} color={C.violet} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {['all', 'income', 'expense'].map((f) => (
            <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        >
          {loading && <ActivityIndicator color={C.violet} style={{ marginVertical: 20 }} />}
          {!loading && filteredTransactions.length === 0 && <Text style={styles.emptyText}>No transactions found.</Text>}
          {filteredTransactions.map((txn) => (
          <TouchableOpacity key={txn.id} style={styles.transactionCard} onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: txn.id } })}>
            <View style={[styles.transactionIcon, txn.category === 'income' ? styles.incomeBg : styles.expenseBg]}>
              {txn.category === 'income' ? <ArrowDownRight size={20} color="#fff" /> : <ArrowUpRight size={20} color="#fff" />}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{txn.type}</Text>
              <View style={styles.transactionMeta}>
                <Calendar size={12} color={C.textSub} />
                <Text style={styles.transactionDate}>{txn.date} • {txn.time}</Text>
              </View>
              {txn.status !== 'completed' && <Text style={styles.pendingBadge}>{txn.status}</Text>}
            </View>
            <Text style={[styles.transactionAmount, txn.category === 'income' ? styles.positiveAmount : styles.negativeAmount]}>
              {txn.category === 'income' ? '+' : '-'}₦{txn.amount.toLocaleString()}
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
  pendingBadge: { fontSize: 10, color: C.warning, marginTop: 4, textTransform: 'capitalize' },
  transactionAmount: { fontSize: 16, fontWeight: '700' },
  positiveAmount: { color: C.success },
  negativeAmount: { color: C.error },
  emptyText: { textAlign: 'center', color: C.textSub, marginTop: 18 },
});

export default TransactionsScreen;
