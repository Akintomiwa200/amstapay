import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Eye, EyeOff, ArrowUpRight, ArrowDownRight, QrCode } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { useAuth } from '@/context/AuthContext';
import { walletService } from '@/services/wallet';
import { savingsService } from '@/services/savings';
import { investmentService } from '@/services/investments';
import { transactionService } from '@/services/transactions';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import { getAccountNumber } from '@/lib/user';
import type { Transaction } from '@/lib/models';

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showBalance, setShowBalance] = useState(true);
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const { user, getWalletBalance } = useAuth();
  const [name, setName] = useState('Account');
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const accountId = id || 'wallet';
    try {
      if (accountId === 'wallet' || accountId === 'main') {
        setName('Main Wallet');
        const bal = await (getWalletBalance?.() ?? walletService.getBalance());
        const b = (bal as { balance?: number; data?: { balance: number } })?.balance
          ?? (bal as { data?: { balance: number } })?.data?.balance ?? 0;
        setBalance(b);
        setAccountNumber(getAccountNumber(user) || '');
      } else if (accountId === 'savings') {
        setName('Savings');
        const goals = parseList(await savingsService.getAll());
        setBalance(goals.reduce((s, g) => s + (g.currentAmount || 0), 0));
      } else if (accountId === 'investments') {
        setName('Investments');
        const inv = parseList(await investmentService.getAll());
        setBalance(inv.reduce((s, i) => s + (i.amount || 0), 0));
      }
      const txs = parseList<Transaction>(await transactionService.getAll(1, 20));
      setTransactions(txs);
    } finally {
      setLoading(false);
    }
  }, [id, user, getWalletBalance]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>
          {loading ? '...' : showBalance ? formatMoney(balance, currency) : '•••••••'}
        </Text>
        {accountNumber ? <Text style={styles.accountNum}>Acct: {accountNumber}</Text> : null}
      </LinearGradient>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: c.primaryLight }]} onPress={() => router.push('/send-money')}>
          <ArrowUpRight size={20} color={c.violet} />
          <Text style={[styles.actionText, { color: c.text }]}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: c.primaryLight }]} onPress={() => router.push('/my-qr')}>
          <ArrowDownRight size={20} color={c.mint} />
          <Text style={[styles.actionText, { color: c.text }]}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: c.primaryLight }]} onPress={() => router.push('/my-qr')}>
          <QrCode size={20} color={c.blue} />
          <Text style={[styles.actionText, { color: c.text }]}>QR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Recent Transactions</Text>
        {loading ? (
          <ActivityIndicator color={c.violet} />
        ) : transactions.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No transactions yet.</Text>
        ) : (
          transactions.map((txn) => (
            <TouchableOpacity
              key={txn._id}
              style={[styles.txnRow, { borderBottomColor: c.border }]}
              onPress={() => router.push(`/transactions/${txn._id}`)}
            >
              <Text style={[styles.txnName, { color: c.text }]}>{txn.description || txn.type}</Text>
              <Text style={[styles.txnAmount, { color: txn.amount < 0 ? c.error : c.mint }]}>
                {formatMoney(txn.amount, currency)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  balanceValue: { fontSize: 32, fontWeight: '800', color: '#fff', marginTop: 4 },
  accountNum: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: -20, marginBottom: 16 },
  actionBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 6 },
  actionText: { fontSize: 12, fontWeight: '600' },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  empty: { fontSize: 13 },
  txnRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  txnName: { fontSize: 14, fontWeight: '500', flex: 1 },
  txnAmount: { fontSize: 14, fontWeight: '700' },
});
