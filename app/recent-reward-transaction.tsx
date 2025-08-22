// recent-reward-transaction.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Filter, Calendar } from 'lucide-react-native';

const RecentRewardTransaction = () => {
  const router = useRouter();

  // Extended mock transaction data
  const transactions = [
    { id: 1, type: 'Cashback Reward', amount: '+₦500', date: 'Today, 10:45 AM', status: 'Completed' },
    { id: 2, type: 'Payment', amount: '-₦2,500', date: 'Yesterday, 3:20 PM', status: 'Completed' },
    { id: 3, type: 'Cashback Reward', amount: '+₦150', date: 'Mar 12, 9:15 AM', status: 'Completed' },
    { id: 4, type: 'Referral Bonus', amount: '+₦1,000', date: 'Mar 11, 2:30 PM', status: 'Completed' },
    { id: 5, type: 'Payment', amount: '-₦3,200', date: 'Mar 10, 11:45 AM', status: 'Completed' },
    { id: 6, type: 'Points Redemption', amount: '-₦5,000', date: 'Mar 9, 4:15 PM', status: 'Completed' },
    { id: 7, type: 'Cashback Reward', amount: '+₦750', date: 'Mar 8, 9:30 AM', status: 'Completed' },
    { id: 8, type: 'Welcome Bonus', amount: '+₦1,500', date: 'Mar 7, 1:20 PM', status: 'Completed' },
  ];

  const renderTransaction = ({ item }: { item: typeof transactions[0] }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <CreditCard size={20} color="#FF8C00" />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={styles.transactionStatus}>{item.status}</Text>
      </View>
      <Text 
        style={[
          styles.transactionAmount,
          item.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount
        ]}
      >
        {item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reward Transactions</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Transactions: {transactions.length}</Text>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  summary: {
    padding: 16,
    backgroundColor: '#FFF4E6',
    margin: 16,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
});

export default RecentRewardTransaction;