// app/wallet.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, Clock, TrendingUp } from 'lucide-react-native';

const Wallet = () => {
  const router = useRouter();
  const transactions = [
    { id: 1, type: 'Deposit', amount: '+₦5,000', date: 'Today, 10:45 AM', status: 'Completed' },
    { id: 2, type: 'Withdrawal', amount: '-₦2,500', date: 'Yesterday, 3:20 PM', status: 'Completed' },
    { id: 3, type: 'Transfer', amount: '-₦1,500', date: 'Mar 12, 9:15 AM', status: 'Completed' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet Balance</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦245.50</Text>
          <View style={styles.balanceTrend}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.trendText}>+2.5% from last week</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.transactions}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((txn) => (
            <View key={txn.id} style={styles.transaction}>
              <View style={styles.transactionLeft}>
                <Clock size={20} color="#666666" />
                <View>
                  <Text style={styles.transactionType}>{txn.type}</Text>
                  <Text style={styles.transactionDate}>{txn.date}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                txn.amount.startsWith('+') ? styles.positive : styles.negative
              ]}>
                {txn.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  downloadButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: '#FF8C00',
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  balanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  transactions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
});

export default Wallet;