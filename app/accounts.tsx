import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard, PieChart, Wallet, Plus, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const Accounts = () => {
  const router = useRouter();

  const accounts = [
    { id: 1, name: 'Main Account', balance: '₦245,800', type: 'bank', number: '**** 4321' },
    { id: 2, name: 'Savings Account', balance: '₦150,000', type: 'savings', number: '**** 8765' },
    { id: 3, name: 'Investment Portfolio', balance: '₦89,500', type: 'investment', number: '**** 1234' },
    { id: 4, name: 'Dollar Account', balance: '$2,500', type: 'bank', number: '**** 5678' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Accounts</Text>
      </View>

      <View style={styles.totalBalance}>
        <Text style={styles.totalLabel}>Total Balance</Text>
        <Text style={styles.totalAmount}>₦485,300</Text>
      </View>

      <View style={styles.accountsList}>
        {accounts.map((account) => (
          <TouchableOpacity key={account.id} style={styles.accountCard}>
            <View style={styles.accountIcon}>
              {account.type === 'bank' ? <CreditCard size={24} color="#F97316" /> : 
               account.type === 'savings' ? <PieChart size={24} color="#F97316" /> : 
               <Wallet size={24} color="#F97316" />}
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountNumber}>{account.number}</Text>
            </View>
            <View style={styles.accountBalanceContainer}>
              <Text style={styles.accountBalance}>{account.balance}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addAccountButton}>
        <View style={styles.addAccountIcon}>
          <Plus size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.addAccountText}>Add New Account</Text>
      </TouchableOpacity>
    </ScrollView>
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
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalBalance: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  accountsList: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  accountCard: {
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
  accountIcon: {
    backgroundColor: '#EFF6FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 12,
    color: '#6B7280',
  },
  accountBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  addAccountButton: {
    backgroundColor: '#F97316',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAccountIcon: {
    marginRight: 8,
  },
  addAccountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Accounts;