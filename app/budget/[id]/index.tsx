// app/budget/[id]/index.tsx - Budget Detail Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Edit3, Trash2, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const c = theme.colors;

  const budget = {
    id: id,
    category: 'Food & Dining',
    spent: 8500,
    budget: 15000,
    period: 'Monthly',
    startDate: 'Mar 1, 2024',
    endDate: 'Mar 31, 2024',
    transactions: [
      { id: 1, name: 'Chicken Republic', amount: '-₦2,500', date: 'Today' },
      { id: 2, name: 'ShopRite Grocery', amount: '-₦3,000', date: 'Yesterday' },
      { id: 3, name: 'Dominos Pizza', amount: '-₦1,500', date: 'Mar 18' },

      { id: 4, name: 'Local Restaurant', amount: '-₦1,500', date: 'Mar 15' },
    ],
  };

  const percent = (budget.spent / budget.budget) * 100;
  const remaining = budget.budget - budget.spent;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{budget.category}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Edit3 size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.progressLabel}>Spent</Text>
              <Text style={styles.progressAmount}>₦{budget.spent.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.progressLabel}>Budget</Text>
              <Text style={styles.progressAmount}>₦{budget.budget.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: c.mint }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(percent)}% used</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <TrendingDown size={18} color={c.mint} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Remaining</Text>
            <Text style={[styles.statValue, { color: c.text }]}>₦{remaining.toLocaleString()}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <TrendingUp size={18} color={c.violet} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Daily Avg</Text>
            <Text style={[styles.statValue, { color: c.text }]}>₦{Math.round(budget.spent / 20).toLocaleString()}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <ArrowUpRight size={18} color={c.pink} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Highest</Text>
            <Text style={[styles.statValue, { color: c.text }]}>₦3,000</Text>
          </View>
        </View>

        {/* Period Info */}
        <View style={[styles.infoCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: c.textSub }]}>Period</Text>
            <Text style={[styles.infoValue, { color: c.text }]}>{budget.period}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: c.textSub }]}>Start Date</Text>
            <Text style={[styles.infoValue, { color: c.text }]}>{budget.startDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: c.textSub }]}>End Date</Text>
            <Text style={[styles.infoValue, { color: c.text }]}>{budget.endDate}</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Transactions</Text>
          {budget.transactions.map((txn) => (
            <View key={txn.id} style={[styles.txnRow, { borderBottomColor: c.border }]}>
              <View style={[styles.txnIcon, { backgroundColor: c.error + '15' }]}>
                <ArrowUpRight size={16} color={c.error} />
              </View>
              <View style={styles.txnInfo}>
                <Text style={[styles.txnName, { color: c.text }]}>{txn.name}</Text>
                <Text style={[styles.txnDate, { color: c.textSub }]}>{txn.date}</Text>
              </View>
              <Text style={[styles.txnAmount, { color: c.error }]}>{txn.amount}</Text>
            </View>
          ))}
        </View>

        {/* Delete */}
        <TouchableOpacity style={[styles.deleteBtn, { borderColor: c.error + '30' }]}>
          <Trash2 size={18} color={c.error} />
          <Text style={[styles.deleteText, { color: c.error }]}>Delete Budget</Text>
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
  headerActions: { flexDirection: 'row', gap: 8 },
  headerAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  progressSection: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  progressAmount: { fontSize: 20, fontWeight: '800', color: '#fff' },
  progressBar: { height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 5 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 14, fontWeight: '700' },
  infoCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12, marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  txnIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txnInfo: { flex: 1 },
  txnName: { fontSize: 14, fontWeight: '600' },
  txnDate: { fontSize: 12, marginTop: 2 },
  txnAmount: { fontSize: 14, fontWeight: '700' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 40 },
  deleteText: { fontSize: 15, fontWeight: '600' },
});
