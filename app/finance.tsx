import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, CreditCard, PieChart, Wallet, Clock, ChevronRight } from 'lucide-react-native';

const Finance = () => {
  // Mock financial data
  const accounts = [
    { id: 1, name: 'Main Account', balance: '₦245,800', type: 'bank' },
    { id: 2, name: 'Savings', balance: '₦150,000', type: 'savings' },
    { id: 3, name: 'Investment', balance: '₦89,500', type: 'investment' },
  ];

  const transactions = [
    { id: 1, type: 'Deposit', amount: '+₦50,000', date: 'Today, 10:45 AM', category: 'income' },
    { id: 2, type: 'Electricity', amount: '-₦15,000', date: 'Yesterday, 3:20 PM', category: 'bill' },
    { id: 3, type: 'Transfer', amount: '-₦25,000', date: 'Mar 12, 9:15 AM', category: 'transfer' },
    { id: 4, type: 'Salary', amount: '+₦120,000', date: 'Mar 1, 8:00 AM', category: 'income' },
  ];

  const quickActions = [
    { id: 1, title: 'Transfer', icon: <ArrowUpRight size={24} color="#3B82F6" /> },
    { id: 2, title: 'Pay Bill', icon: <CreditCard size={24} color="#3B82F6" /> },
    { id: 3, title: 'Invest', icon: <PieChart size={24} color="#3B82F6" /> },
    { id: 4, title: 'Loans', icon: <Wallet size={24} color="#3B82F6" /> },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Dashboard</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₦485,300</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              {action.icon}
            </View>
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Accounts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Accounts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {accounts.map((account) => (
          <TouchableOpacity key={account.id} style={styles.accountCard}>
            <View style={styles.accountIcon}>
              {account.type === 'bank' ? <CreditCard size={20} color="#3B82F6" /> : 
               account.type === 'savings' ? <PieChart size={20} color="#10B981" /> : 
               <Wallet size={20} color="#F59E0B" />}
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountType}>{account.type}</Text>
            </View>
            <Text style={styles.accountBalance}>{account.balance}</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.map((txn) => (
          <View key={txn.id} style={styles.transactionCard}>
            <View style={[
              styles.transactionIcon,
              txn.category === 'income' ? styles.incomeBg : 
              txn.category === 'bill' ? styles.billBg : 
              styles.transferBg
            ]}>
              {txn.category === 'income' ? <ArrowDownRight size={16} color="#fff" /> : 
               txn.category === 'bill' ? <CreditCard size={16} color="#fff" /> : 
               <ArrowUpRight size={16} color="#fff" />}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{txn.type}</Text>
              <Text style={styles.transactionDate}>{txn.date}</Text>
            </View>
            <Text 
              style={[
                styles.transactionAmount,
                txn.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount
              ]}
            >
              {txn.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Financial Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <PieChart size={24} color="#3B82F6" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Spending Analysis</Text>
            <Text style={styles.insightText}>Your expenses increased by 12% this month</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  balanceLabel: {
    color: '#EFF6FF',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -24,
  },
  quickAction: {
    backgroundColor: '#FFFFFF',
    width: 80,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAll: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  accountIcon: {
    backgroundColor: '#EFF6FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
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
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  insightIcon: {
    backgroundColor: '#E0F2FE',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#0C4A6E',
  },
});

export default Finance;