import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Building2,
  Zap,
  CreditCard,
  Users,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react-native';

type FilterButtonProps = {
  filter: string;
  label: string;
};

type Transaction = {
  id: string;
  type: 'income' | 'expense' | string;
  amount: string;
  description?: string;
  date?: string;
  time?: string;
  title: string;  
  recipient?: string;  
  reference?: string;
};

const sampleTransactions = [
  { 
    id: '1', 
    title: 'Airtime Purchase', 
    amount: '-₦500', 
    date: '2025-08-10', 
    time: '14:30',
    type: 'airtime',
    status: 'completed',
    reference: 'TXN001234567',
    recipient: 'MTN Nigeria'
  },
  { 
    id: '2', 
    title: 'Bank Deposit', 
    amount: '+₦5,000', 
    date: '2025-08-09', 
    time: '09:15',
    type: 'deposit',
    status: 'completed',
    reference: 'TXN001234566',
    recipient: 'AmstaPay Wallet'
  },
  { 
    id: '3', 
    title: 'POS Withdrawal', 
    amount: '-₦1,000', 
    date: '2025-08-07', 
    time: '16:45',
    type: 'withdrawal',
    status: 'completed',
    reference: 'TXN001234565',
    recipient: 'Lagos Island POS'
  },
  { 
    id: '4', 
    title: 'Data Bundle', 
    amount: '-₦1,500', 
    date: '2025-08-06', 
    time: '11:20',
    type: 'data',
    status: 'completed',
    reference: 'TXN001234564',
    recipient: 'Airtel Nigeria'
  },
  { 
    id: '5', 
    title: 'Electricity Bill', 
    amount: '-₦3,200', 
    date: '2025-08-05', 
    time: '19:30',
    type: 'utilities',
    status: 'completed',
    reference: 'TXN001234563',
    recipient: 'EEDC Prepaid'
  },
  { 
    id: '6', 
    title: 'Wallet Transfer', 
    amount: '+₦2,500', 
    date: '2025-08-04', 
    time: '13:10',
    type: 'transfer',
    status: 'completed',
    reference: 'TXN001234562',
    recipient: 'John Doe'
  },
  { 
    id: '7', 
    title: 'QR Payment', 
    amount: '-₦750', 
    date: '2025-08-03', 
    time: '10:45',
    type: 'qr_payment',
    status: 'completed',
    reference: 'TXN001234561',
    recipient: 'Shop Rite Store'
  },
  { 
    id: '8', 
    title: 'Cashback Reward', 
    amount: '+₦50', 
    date: '2025-08-02', 
    time: '08:30',
    type: 'cashback',
    status: 'completed',
    reference: 'TXN001234560',
    recipient: 'AmstaPay Rewards'
  }
];

export default function TransactionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getTransactionIcon = (type: string) => { 
    switch (type) {
      case 'airtime':
        return Smartphone;
      case 'data':
        return Smartphone;
      case 'deposit':
        return Building2;
      case 'withdrawal':
        return CreditCard;
      case 'utilities':
        return Zap;
      case 'transfer':
        return Users;
      case 'qr_payment':
        return CreditCard;
      case 'cashback':
        return TrendingUp;
      default:
        return MoreHorizontal;
    }
  };

  const filteredTransactions = sampleTransactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'income') return matchesSearch && transaction.amount.startsWith('+');
    if (selectedFilter === 'expense') return matchesSearch && transaction.amount.startsWith('-');
    
    return matchesSearch;
  });

  const totalIncome = sampleTransactions
    .filter(t => t.amount.startsWith('+'))
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^\d.-]/g, '')), 0);
  
  const totalExpenses = sampleTransactions
    .filter(t => t.amount.startsWith('-'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.replace(/[^\d.-]/g, ''))), 0);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const Icon = getTransactionIcon(item.type);
    const isIncome = item.amount.startsWith('+');
    
    return (
      <TouchableOpacity 
        style={styles.transactionCard}
        onPress={() => {
          console.log('View transaction details:', item.id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.transactionContent}>
          <View style={styles.transactionLeft}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: isIncome ? '#E8F5E8' : '#FFF4E6' }
            ]}>
              <Icon 
                size={20} 
                color={isIncome ? '#16A34A' : '#FF8C00'} 
              />
              <View style={[
                styles.amountIndicator,
                { backgroundColor: isIncome ? '#16A34A' : '#FF8C00' }
              ]}>
                {isIncome ? 
                  <ArrowDownLeft size={10} color="#FFFFFF" /> :
                  <ArrowUpRight size={10} color="#FFFFFF" />
                }
              </View>
            </View>
            
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionRecipient}>{item.recipient}</Text>
              <Text style={styles.transactionReference}>Ref: {item.reference}</Text>
            </View>
          </View>
          
          <View style={styles.transactionRight}>
            <Text style={[
              styles.transactionAmount,
              { color: isIncome ? '#16A34A' : '#FF8C00' }
            ]}>
              {item.amount}
            </Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
            <Text style={styles.transactionTime}>{item.time}</Text>
            <ChevronRight size={16} color="#666666" style={styles.chevron} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FilterButton: React.FC<FilterButtonProps> = ({ filter, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <TrendingUp size={24} color="#16A34A" />
          </View>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>+₦{totalIncome.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <TrendingDown size={24} color="#FF8C00" />
          </View>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>-₦{totalExpenses.toLocaleString()}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}>
          <Filter size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterSection}>
        <FilterButton filter="all" label="All" />
        <FilterButton filter="income" label="Income" />
        <FilterButton filter="expense" label="Expenses" />
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Recent Transactions</Text>
          <Text style={styles.listCount}>{filteredTransactions.length} transactions</Text>
        </View>

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No transactions found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        />
      </View>
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