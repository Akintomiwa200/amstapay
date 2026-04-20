// app/accounts/[id].tsx - Account Details
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Copy, Eye, EyeOff, ArrowUpRight, ArrowDownRight, QrCode, MoreVertical } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showBalance, setShowBalance] = useState(true);

  const account = {
    id: id,
    name: 'Main Account',
    balance: '245,800',
    type: 'bank',
    number: '0123456789',
    bankName: 'Amsta Bank',
    color: C.violet
  };

  const recentTransactions = [
    { id: 1, type: 'Salary Deposit', amount: '+50,000', date: 'Today', category: 'income' },
    { id: 2, type: 'Electricity Bill', amount: '-15,000', date: 'Yesterday', category: 'expense' },
    { id: 3, type: 'Transfer to John', amount: '-25,000', date: 'Mar 12', category: 'expense' },
  ];

  const copyToClipboard = (text: string) => {
    // Implement copy functionality
    alert('Copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{account.name}</Text>
          <TouchableOpacity>
            <MoreVertical size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <TouchableOpacity style={styles.balanceRow} onPress={() => setShowBalance(!showBalance)}>
            <Text style={styles.balanceAmount}>
              {showBalance ? `₦${parseInt(account.balance).toLocaleString()}` : '•••••••'}
            </Text>
            {showBalance ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

        <View style={styles.accountInfo}>
          <View style={styles.accountNumberRow}>
            <Text style={styles.accountNumber}>{account.number}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(account.number)}>
              <Copy size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.bankName}>{account.bankName}</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/send-money')}>
            <ArrowUpRight size={20} color="#fff" />
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/receive-money')}>
            <ArrowDownRight size={20} color="#fff" />
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/my-qr')}>
            <QrCode size={20} color="#fff" />
            <Text style={styles.actionText}>My QR</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((txn) => (
            <TouchableOpacity key={txn.id} style={styles.transactionCard}>
              <View style={[styles.transactionIcon, txn.category === 'income' ? styles.incomeBg : styles.expenseBg]}>
                {txn.category === 'income' ? <ArrowDownRight size={16} color="#fff" /> : <ArrowUpRight size={16} color="#fff" />}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{txn.type}</Text>
                <Text style={styles.transactionDate}>{txn.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, txn.category === 'income' ? styles.positiveAmount : styles.negativeAmount]}>
                {txn.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.statementBtn} onPress={() => router.push('/accounts/statements')}>
          <Text style={styles.statementText}>View Account Statement</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  balanceContainer: { marginBottom: 24 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  balanceAmount: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  accountInfo: { marginBottom: 24 },
  accountNumberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  accountNumber: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  bankName: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  quickActions: { flexDirection: 'row', gap: 16 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12, borderRadius: 12 },
  actionText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { backgroundColor: C.bg, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  seeAll: { fontSize: 13, color: C.violet, fontWeight: '600' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  incomeBg: { backgroundColor: C.success },
  expenseBg: { backgroundColor: C.error },
  transactionInfo: { flex: 1 },
  transactionType: { fontSize: 15, fontWeight: '500', color: C.text, marginBottom: 2 },
  transactionDate: { fontSize: 12, color: C.textSub },
  transactionAmount: { fontSize: 15, fontWeight: '600' },
  positiveAmount: { color: C.success },
  negativeAmount: { color: C.error },
  statementBtn: { backgroundColor: C.primaryLight, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 40 },
  statementText: { fontSize: 15, fontWeight: '600', color: C.violet },
});