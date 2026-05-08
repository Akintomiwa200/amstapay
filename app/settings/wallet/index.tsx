// app/settings/wallet/index.tsx - Wallet Settings Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Wallet, Plus, ArrowUpRight, ArrowDownRight, ChevronRight, Shield, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function WalletSettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦485,300</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={[styles.balanceBtn]} onPress={() => router.push('/add-money')}>
              <Plus size={18} color={c.violet} />
              <Text style={[styles.balanceBtnText, { color: c.violet }]}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.balanceBtn]}>
              <ArrowUpRight size={18} color={c.violet} />
              <Text style={[styles.balanceBtnText, { color: c.violet }]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Wallet Management</Text>
          {[
            { icon: Clock, title: 'Transaction History', desc: 'View all wallet transactions', route: '/transactions' },
            { icon: Shield, title: 'Wallet Security', desc: 'PIN, biometrics, and limits', route: '/settings/change-pin' },
            { icon: Wallet, title: 'Linked Accounts', desc: 'Manage linked bank accounts', route: '/accounts' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={i} style={[styles.optionRow, { borderBottomColor: c.border }]} onPress={() => router.push(item.route as any)}>
                <View style={[styles.optionIcon, { backgroundColor: c.primaryLight }]}>
                  <Icon size={20} color={c.violet} />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, { color: c.text }]}>{item.title}</Text>
                  <Text style={[styles.optionDesc, { color: c.textSub }]}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color={c.textSub} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Recent Activity</Text>
          {[
            { type: 'credit', title: 'Wallet Funded', amount: '+₦50,000', date: 'Today, 10:30 AM' },
            { type: 'debit', title: 'Bill Payment', amount: '-₦15,000', date: 'Yesterday' },
            { type: 'credit', title: 'Cashback Reward', amount: '+₦750', date: 'Mar 18' },
          ].map((txn, i) => (
            <View key={i} style={[styles.txnRow, { borderBottomColor: c.border }]}>
              <View style={[styles.txnIcon, { backgroundColor: txn.type === 'credit' ? c.success : c.error }]}>
                {txn.type === 'credit' ?
                  <ArrowDownRight size={16} color="#fff" /> :
                  <ArrowUpRight size={16} color="#fff" />
                }
              </View>
              <View style={styles.txnInfo}>
                <Text style={[styles.txnTitle, { color: c.text }]}>{txn.title}</Text>
                <Text style={[styles.txnDate, { color: c.textSub }]}>{txn.date}</Text>
              </View>
              <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? c.success : c.error }]}>
                {txn.amount}
              </Text>
            </View>
          ))}
        </View>
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
  balanceCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20 },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  balanceAmount: { fontSize: 32, fontWeight: '800', color: '#fff', marginVertical: 8 },
  balanceActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  balanceBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  balanceBtnText: { fontSize: 13, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  optionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  optionInfo: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '600' },
  optionDesc: { fontSize: 12, marginTop: 2 },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  txnIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  creditBg: {},
  debitBg: {},
  txnInfo: { flex: 1 },
  txnTitle: { fontSize: 14, fontWeight: '600' },
  txnDate: { fontSize: 12, marginTop: 2 },
  txnAmount: { fontSize: 14, fontWeight: '700' },
  credit: {},
  debit: {},
});
