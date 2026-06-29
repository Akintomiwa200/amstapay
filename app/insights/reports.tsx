import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Share, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Download } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { budgetService } from '@/services/budget';
import { transactionService } from '@/services/transactions';
import { reportsService } from '@/services/reports';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import type { Transaction } from '@/lib/models';

export default function ReportsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ name: string; amount: number; percent: number; color: string }[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const load = useCallback(async () => {
    try {
      const [insightsRes, txRes] = await Promise.allSettled([
        budgetService.getInsights(),
        transactionService.getAll(1, 200),
      ]);

      const txs = txRes.status === 'fulfilled' ? parseList<Transaction>(txRes.value) : [];
      const inc = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
      const exp = txs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
      setIncome(inc);
      setExpense(exp);

      if (insightsRes.status === 'fulfilled') {
        const data = (insightsRes.value as { data?: Record<string, unknown> })?.data ?? insightsRes.value;
        const cats = (data as { categories?: { name: string; spent: number }[] }).categories || [];
        const total = cats.reduce((s, cat) => s + cat.spent, 0) || exp || 1;
        setCategories(
          cats.map((cat, i) => ({
            name: cat.name,
            amount: cat.spent,
            percent: Math.round((cat.spent / total) * 100),
            color: [c.violet, c.blue, c.mint, c.pink, c.warning][i % 5],
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [c]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleExport = async () => {
    try {
      const lines = [
        `AmstaPay Financial Report (${period})`,
        `Income: ${formatMoney(income, currency)}`,
        `Expenses: ${formatMoney(expense, currency)}`,
        '',
        'Category Breakdown:',
        ...categories.map((cat) => `${cat.name}: ${formatMoney(cat.amount, currency)} (${cat.percent}%)`),
      ];
      try {
        await reportsService.exportReport(period);
      } catch {
        // fallback to local share if export endpoint unavailable
      }
      await Share.share({ message: lines.join('\n'), title: 'Financial Report' });
    } catch {
      Alert.alert('Export failed', 'Could not export report.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Financial Reports</Text>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleExport}>
            <Download size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.periodTabs}>
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <TouchableOpacity key={p} style={[styles.periodTab, period === p && styles.periodTabActive]} onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && [styles.periodTextActive, { color: c.primary }]]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValue}>{formatMoney(income, currency)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={styles.summaryValue}>{formatMoney(expense, currency)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : categories.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No report data yet. Complete transactions to see breakdown.</Text>
        ) : (
          categories.map((cat) => (
            <View key={cat.name} style={[styles.catRow, { borderColor: c.border }]}>
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              <Text style={[styles.catName, { color: c.text }]}>{cat.name}</Text>
              <Text style={[styles.catAmount, { color: c.text }]}>{formatMoney(cat.amount, currency)}</Text>
              <Text style={[styles.catPct, { color: c.textSub }]}>{cat.percent}%</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  periodTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  periodTab: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  periodTabActive: { backgroundColor: '#fff' },
  periodText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  periodTextActive: { fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  summaryValue: { fontSize: 16, fontWeight: '800', color: '#fff', marginTop: 4 },
  content: { padding: 20 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 14 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 10 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catName: { flex: 1, fontSize: 14, fontWeight: '500' },
  catAmount: { fontSize: 13, fontWeight: '600' },
  catPct: { fontSize: 12, width: 36, textAlign: 'right' },
});
