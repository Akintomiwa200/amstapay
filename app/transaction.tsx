import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SectionList } from 'react-native';
import { ArrowUpRight, ArrowDownRight, CreditCard, Filter, Calendar, Receipt } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const Transactions = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const transactionsData = [
    {
      title: 'Today',
      data: [
        { id: 1, type: 'Deposit', amount: '+₦50,000', date: '10:45 AM', category: 'income', receipt: true },
        { id: 2, type: 'Electricity', amount: '-₦15,000', date: '3:20 PM', category: 'bill', receipt: true },
      ]
    },
    {
      title: 'Yesterday',
      data: [
        { id: 3, type: 'Transfer', amount: '-₦25,000', date: '9:15 AM', category: 'transfer', receipt: true },
      ]
    },
    {
      title: 'March 2024',
      data: [
        { id: 4, type: 'Salary', amount: '+₦120,000', date: 'Mar 1', category: 'income', receipt: true },
        { id: 5, type: 'Shopping', amount: '-₦45,000', date: 'Mar 5', category: 'expense', receipt: true },
        { id: 6, type: 'Airtime', amount: '-₦5,000', date: 'Mar 10', category: 'bill', receipt: true },
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
    { id: 'transfer', label: 'Transfer' },
  ];

  const handleReceiptPress = (transactionId) => {
    // Navigate to receipt view or show receipt modal
    router.push(`/receipt/${transactionId}`);
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={[
        styles.transactionIcon,
        item.category === 'income' ? styles.incomeBg : 
        item.category === 'bill' || item.category === 'expense' ? styles.billBg : 
        styles.transferBg
      ]}>
        {item.category === 'income' ? <ArrowDownRight size={16} color="#fff" /> : 
         item.category === 'bill' || item.category === 'expense' ? <CreditCard size={16} color="#fff" /> : 
         <ArrowUpRight size={16} color="#fff" />}
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text 
        style={[
          styles.transactionAmount,
          item.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount
        ]}
      >
        {item.amount}
      </Text>
      {item.receipt && (
        <TouchableOpacity 
          style={styles.receiptButton}
          onPress={() => handleReceiptPress(item.id)}
        >
          <Receipt size={18} color="#F97316" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#F97316" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterPill,
              selectedFilter === filter.id && styles.filterPillActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionList
        sections={transactionsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        style={styles.transactionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F97316',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#F97316',
  },
  filterText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  transactionList: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  incomeBg: {
    backgroundColor: '#10B981',
  },
  billBg: {
    backgroundColor: '#EF4444',
  },
  transferBg: {
    backgroundColor: '#8B5CF6',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
  receiptButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
  },
});

export default Transactions;