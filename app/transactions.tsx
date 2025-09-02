import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Search, Filter, Calendar, TrendingUp, TrendingDown,
  Smartphone, Building2, Zap, CreditCard, Users, MoreHorizontal,
  ChevronRight, ArrowUpRight, ArrowDownLeft
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

type FilterButtonProps = { filter: string; label: string; };

export default function TransactionsScreen() {
  const router = useRouter();
  const { getWalletTransactions, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
    // Optional: Polling every 30s
    const interval = setInterval(fetchTransactions, 30000);
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

  const getTransactionIcon = (type: string) => { 
    switch (type) {
      case 'airtime': return Smartphone;
      case 'data': return Smartphone;
      case 'deposit': return Building2;
      case 'withdrawal': return CreditCard;
      case 'utilities': return Zap;
      case 'transfer': return Users;
      case 'qr_payment': return CreditCard;
      case 'cashback': return TrendingUp;
      default: return MoreHorizontal;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const title = transaction.title || transaction.type || '';
    const recipient = transaction.recipient || transaction.receiverName || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipient.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'income') return matchesSearch && transaction.amount > 0;
    if (selectedFilter === 'expense') return matchesSearch && transaction.amount < 0;

    return matchesSearch;
  });

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const renderTransaction = ({ item }: { item: any }) => {
    const Icon = getTransactionIcon(item.type);
    const isIncome = item.amount > 0;

    return (
      <TouchableOpacity style={styles.transactionCard} activeOpacity={0.7}>
        <View style={styles.transactionContent}>
          <View style={styles.transactionLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isIncome ? '#E8F5E8' : '#FFF4E6' }]}>
              <Icon size={20} color={isIncome ? '#16A34A' : '#FF8C00'} />
              <View style={[styles.amountIndicator, { backgroundColor: isIncome ? '#16A34A' : '#FF8C00' }]}>
                {isIncome ? <ArrowDownLeft size={10} color="#FFF" /> : <ArrowUpRight size={10} color="#FFF" />}
              </View>
            </View>

            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title || item.type}</Text>
              <Text style={styles.transactionRecipient}>{item.recipient || item.receiverName}</Text>
              <Text style={styles.transactionReference}>Ref: {item.reference || item._id}</Text>
            </View>
          </View>

          <View style={styles.transactionRight}>
            <Text style={[styles.transactionAmount, { color: isIncome ? '#16A34A' : '#FF8C00' }]}>
              {isIncome ? `+₦${item.amount.toLocaleString()}` : `-₦${Math.abs(item.amount).toLocaleString()}`}
            </Text>
            <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <ChevronRight size={16} color="#666666" style={styles.chevron} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FilterButton: React.FC<FilterButtonProps> = ({ filter, label }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterButtonText, selectedFilter === filter && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading || authLoading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}><TrendingUp size={24} color="#16A34A" /></View>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>+₦{totalIncome.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}><TrendingDown size={24} color="#FF8C00" /></View>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>-₦{totalExpenses.toLocaleString()}</Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}><Filter size={20} color="#FFF" /></TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <FilterButton filter="all" label="All" />
        <FilterButton filter="income" label="Income" />
        <FilterButton filter="expense" label="Expenses" />
      </View>

      {/* Transactions */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item._id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No transactions found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your search or filter criteria</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FF8C00',
  },
  summarySection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8C00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  filterIconButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FF8C00',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  listCount: {
    fontSize: 14,
    color: '#666666',
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  amountIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  transactionRecipient: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  transactionReference: {
    fontSize: 12,
    color: '#888888',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 4,
  },
  chevron: {
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});