import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, CreditCard, PieChart, Wallet, Eye, EyeOff, FileText } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { useAuth } from '@/context/AuthContext';
import { walletService } from '@/services/wallet';
import { savingsService } from '@/services/savings';
import { investmentService } from '@/services/investments';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import type { SavingsGoal, Investment } from '@/lib/models';

type AccountRow = {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'savings' | 'investment';
  color: string;
  number: string;
};

export default function AccountsScreen() {
  const router = useRouter();
  const [showBalances, setShowBalances] = useState(true);
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const { getWalletBalance } = useAuth();
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [balRes, goalsRes, invRes] = await Promise.allSettled([
        getWalletBalance?.() ?? walletService.getBalance(),
        savingsService.getAll(),
        investmentService.getAll(),
      ]);

      const rows: AccountRow[] = [];

      if (balRes.status === 'fulfilled') {
        const bal = (balRes.value as { balance?: number; data?: { balance: number } })?.balance
          ?? (balRes.value as { data?: { balance: number } })?.data?.balance ?? 0;
        rows.push({
          id: 'wallet',
          name: 'Main Wallet',
          balance: bal,
          type: 'bank',
          color: c.violet,
          number: '****wallet',
        });
      }

      if (goalsRes.status === 'fulfilled') {
        const goals = parseList<SavingsGoal>(goalsRes.value);
        const savingsTotal = goals.reduce((s, g) => s + (g.currentAmount || 0), 0);
        if (savingsTotal > 0 || goals.length) {
          rows.push({
            id: 'savings',
            name: `Savings (${goals.length} goals)`,
            balance: savingsTotal,
            type: 'savings',
            color: c.mint,
            number: '****save',
          });
        }
      }

      if (invRes.status === 'fulfilled') {
        const investments = parseList<Investment>(invRes.value);
        const invTotal = investments.reduce((s, i) => s + (i.amount || 0), 0);
        if (invTotal > 0 || investments.length) {
          rows.push({
            id: 'investments',
            name: `Investments (${investments.length})`,
            balance: invTotal,
            type: 'investment',
            color: c.blue,
            number: '****inv',
          });
        }
      }

      setAccounts(rows);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [c.violet, c.mint, c.blue, getWalletBalance]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Accounts</Text>
          <TouchableOpacity onPress={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalAmount}>
            {showBalances ? formatMoney(totalBalance, currency) : '•••••••'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={c.violet} />}
      >
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : accounts.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No accounts yet. Fund your wallet to get started.</Text>
        ) : (
          accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[styles.accountCard, { backgroundColor: c.bg, borderColor: c.border, shadowColor: c.primary }]}
              onPress={() => {
                if (account.type === 'bank') router.push('/add-money');
                else if (account.type === 'savings') router.push('/(tabs)/finance');
                else router.push('/invest');
              }}
            >
              <View style={[styles.accountIcon, { backgroundColor: `${account.color}15` }]}>
                {account.type === 'bank' ? <CreditCard size={24} color={account.color} /> :
                  account.type === 'savings' ? <PieChart size={24} color={account.color} /> :
                  <Wallet size={24} color={account.color} />}
              </View>
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: c.text }]}>{account.name}</Text>
                <Text style={[styles.accountNumber, { color: c.textSub }]}>{account.number}</Text>
                <View style={styles.accountActions}>
                  <TouchableOpacity onPress={() => router.push('/send-money')}>
                    <Text style={[styles.actionText, { color: c.violet }]}>Send</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/my-qr')}>
                    <Text style={[styles.actionText, { color: c.violet }]}>Receive</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.accountBalance, { color: c.text }]}>
                {showBalances ? formatMoney(account.balance, currency) : '•••••••'}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-account')}>
          <Plus size={20} color={c.violet} />
          <Text style={[styles.addButtonText, { color: c.violet }]}>Add New Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statementsBtn, { backgroundColor: c.primaryLight, borderColor: c.border }]}
          onPress={() => router.push('/accounts/statements')}
        >
          <FileText size={20} color={c.violet} />
          <Text style={[styles.statementsBtnText, { color: c.violet }]}>View Statements</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  totalContainer: { alignItems: 'center' },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  totalAmount: { fontSize: 32, fontWeight: '800', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 14 },
  accountCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  accountIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  accountDetails: { flex: 1 },
  accountName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  accountNumber: { fontSize: 12, marginBottom: 8 },
  accountActions: { flexDirection: 'row', gap: 16 },
  actionText: { fontSize: 13, fontWeight: '600' },
  accountBalance: { fontSize: 16, fontWeight: '700' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: 8 },
  addButtonText: { fontSize: 15, fontWeight: '600' },
  statementsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, marginBottom: 32, borderRadius: 14, borderWidth: 1 },
  statementsBtnText: { fontSize: 15, fontWeight: '600' },
});
