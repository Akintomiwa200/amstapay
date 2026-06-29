import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { budgetService } from '@/services/budget';
import { transactionService } from '@/services/transactions';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import type { Transaction } from '@/lib/models';

export default function InsightsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [categories, setCategories] = useState<{ name: string; amount: number; percentage: number; color: string }[]>([]);

  const load = useCallback(async () => {
    try {
      const [insightsRes, txRes] = await Promise.allSettled([
        budgetService.getInsights(),
        transactionService.getAll(1, 100),
      ]);

      const txs = txRes.status === 'fulfilled' ? parseList<Transaction>(txRes.value) : [];
      const spent = txs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
      const income = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
      setTotalSpent(spent);
      setTotalIncome(income);

      if (insightsRes.status === 'fulfilled') {
        const data = (insightsRes.value as { data?: Record<string, unknown> })?.data ?? insightsRes.value;
        const cats = (data as { categories?: { name: string; spent: number; budget: number }[] }).categories || [];
        const total = cats.reduce((s, cat) => s + cat.spent, 0) || spent || 1;
        setCategories(
          cats.map((cat, i) => ({
            name: cat.name,
            amount: cat.spent,
            percentage: Math.round((cat.spent / total) * 100),
            color: [c.violet, c.error, c.mint, c.blue, c.pink][i % 5],
          })),
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [c]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalSpent) / totalIncome) * 100) : 0;

  const insights = [
    { id: 1, title: 'Monthly Spending', value: formatMoney(totalSpent, currency), trend: 'up', description: 'Total debits this period', color: c.error },
    { id: 2, title: 'Savings Rate', value: `${Math.max(savingsRate, 0)}%`, trend: 'up', description: 'Income minus spending', color: c.mint },
    { id: 3, title: 'Total Income', value: formatMoney(totalIncome, currency), trend: 'up', description: 'Credits received', color: c.violet },
    { id: 4, title: 'Top Category', value: categories[0]?.name || '—', trend: 'neutral', description: categories[0] ? formatMoney(categories[0].amount, currency) : 'No data yet', color: c.blue },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Insights</Text>
          <TouchableOpacity onPress={() => router.push('/insights/reports')}>
            <Calendar size={22} color={c.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={c.violet} />}
      >
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.insightsGrid}>
              {insights.map((insight) => (
                <View key={insight.id} style={[styles.insightCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                  <View style={styles.insightHeader}>
                    <Text style={[styles.insightTitle, { color: c.textSub }]}>{insight.title}</Text>
                    {insight.trend === 'up' ? <TrendingUp size={20} color={insight.color} /> : <BarChart3 size={20} color={insight.color} />}
                  </View>
                  <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
                  <Text style={[styles.insightDesc, { color: c.textSub }]}>{insight.description}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: c.primary }]}>Spending by Category</Text>
            {categories.length === 0 ? (
              <Text style={[styles.empty, { color: c.textSub }]}>No category breakdown yet.</Text>
            ) : (
              categories.map((cat) => (
                <View key={cat.name} style={[styles.catRow, { borderColor: c.border }]}>
                  <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.catName, { color: c.text }]}>{cat.name}</Text>
                  <Text style={[styles.catAmount, { color: c.text }]}>{formatMoney(cat.amount, currency)}</Text>
                  <Text style={[styles.catPct, { color: c.textSub }]}>{cat.percentage}%</Text>
                </View>
              ))
            )}

            <TouchableOpacity style={[styles.reportsBtn, { backgroundColor: c.primaryLight }]} onPress={() => router.push('/budget')}>
              <PieChart size={18} color={c.violet} />
              <Text style={[styles.reportsText, { color: c.violet }]}>Manage budgets</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  insightCard: { width: '47%', borderRadius: 16, padding: 14, borderWidth: 1 },
  insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  insightTitle: { fontSize: 12, fontWeight: '600' },
  insightValue: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  insightDesc: { fontSize: 11 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  empty: { fontSize: 13, marginBottom: 20 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catName: { flex: 1, fontSize: 14, fontWeight: '500' },
  catAmount: { fontSize: 13, fontWeight: '600' },
  catPct: { fontSize: 12, width: 36, textAlign: 'right' },
  reportsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 14, marginTop: 20, marginBottom: 32 },
  reportsText: { fontSize: 14, fontWeight: '600' },
});
