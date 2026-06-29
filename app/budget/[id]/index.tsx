import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Trash2, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { budgetService, type Budget } from '@/services/budget';
import { parseData, parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

type Expense = { _id?: string; name?: string; description?: string; amount: number; createdAt?: string };

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [bRes, eRes] = await Promise.allSettled([
        budgetService.getById(id),
        budgetService.getExpenses(),
      ]);
      if (bRes.status === 'fulfilled') setBudget(parseData<Budget>(bRes.value));
      if (eRes.status === 'fulfilled') setExpenses(parseList<Expense>(eRes.value).slice(0, 10));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const spent = budget?.spent ?? 0;
  const limit = budget?.amount ?? 0;
  const percent = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;

  const handleDelete = () => {
    if (!id) return;
    Alert.alert('Delete budget', 'Remove this budget category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await budgetService.delete(id);
            router.back();
          } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <ActivityIndicator color={c.violet} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{budget?.name || 'Budget'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.progressLabel}>Spent</Text>
              <Text style={styles.progressAmount}>{formatMoney(spent, currency)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.progressLabel}>Budget</Text>
              <Text style={styles.progressAmount}>{formatMoney(limit, currency)}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: c.mint }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(percent)}% used</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <TrendingDown size={18} color={c.mint} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Remaining</Text>
            <Text style={[styles.statValue, { color: c.text }]}>{formatMoney(remaining, currency)}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <TrendingUp size={18} color={c.violet} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Period</Text>
            <Text style={[styles.statValue, { color: c.text }]}>{budget?.period || 'monthly'}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: c.primary }]}>Recent expenses</Text>
        {expenses.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No expenses recorded yet.</Text>
        ) : (
          expenses.map((txn, i) => (
            <View key={txn._id || i} style={[styles.txnRow, { borderBottomColor: c.border }]}>
              <View style={[styles.txnIcon, { backgroundColor: c.error + '15' }]}>
                <ArrowUpRight size={16} color={c.error} />
              </View>
              <View style={styles.txnInfo}>
                <Text style={[styles.txnName, { color: c.text }]}>{txn.name || txn.description || 'Expense'}</Text>
                <Text style={[styles.txnDate, { color: c.textSub }]}>
                  {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : ''}
                </Text>
              </View>
              <Text style={[styles.txnAmount, { color: c.error }]}>-{formatMoney(Math.abs(txn.amount), currency)}</Text>
            </View>
          ))
        )}

        <TouchableOpacity style={[styles.deleteBtn, { borderColor: c.error + '30' }]} onPress={handleDelete}>
          <Trash2 size={18} color={c.error} />
          <Text style={[styles.deleteText, { color: c.error }]}>Delete Budget</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
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
  statValue: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  empty: { fontSize: 13, marginBottom: 24 },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  txnIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txnInfo: { flex: 1 },
  txnName: { fontSize: 14, fontWeight: '600' },
  txnDate: { fontSize: 12, marginTop: 2 },
  txnAmount: { fontSize: 14, fontWeight: '700' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1, marginVertical: 32 },
  deleteText: { fontSize: 15, fontWeight: '600' },
});
