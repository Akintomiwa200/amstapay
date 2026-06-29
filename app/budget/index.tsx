import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, AlertCircle } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { budgetService, type Budget, type BudgetCategory } from '@/services/budget';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

type Row = { id: string; category: string; spent: number; budget: number; color: string };

const COLORS = ['violet', 'error', 'mint', 'blue', 'pink', 'warning'] as const;

function toRows(budgets: Budget[], categories: BudgetCategory[], c: ReturnType<typeof useTheme>['theme']['colors']): Row[] {
  const colorMap: Record<string, string> = {
    violet: c.violet,
    error: c.error,
    mint: c.mint,
    blue: c.blue,
    pink: c.pink,
    warning: c.warning,
  };

  if (categories.length) {
    return categories.map((cat, i) => ({
      id: cat._id,
      category: cat.name,
      spent: cat.spent ?? 0,
      budget: cat.limit ?? 0,
      color: cat.color || colorMap[COLORS[i % COLORS.length]],
    }));
  }

  const fromBudgets: Row[] = [];
  budgets.forEach((b, bi) => {
    if (b.categories?.length) {
      b.categories.forEach((cat, ci) => {
        fromBudgets.push({
          id: cat._id || `${b._id}-${ci}`,
          category: cat.name,
          spent: cat.spent ?? 0,
          budget: cat.limit ?? 0,
          color: cat.color || colorMap[COLORS[(bi + ci) % COLORS.length]],
        });
      });
    } else {
      fromBudgets.push({
        id: b._id,
        category: b.name,
        spent: b.spent ?? 0,
        budget: b.amount ?? 0,
        color: colorMap[COLORS[bi % COLORS.length]],
      });
    }
  });
  return fromBudgets;
}

export default function BudgetScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [budgetRes, catRes] = await Promise.allSettled([
        budgetService.getAll(),
        budgetService.getCategories(),
      ]);
      const budgets = budgetRes.status === 'fulfilled' ? parseList<Budget>(budgetRes.value) : [];
      const categories = catRes.status === 'fulfilled' ? parseList<BudgetCategory>(catRes.value) : [];
      setRows(toRows(budgets, categories, c));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [c]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const totalBudget = rows.reduce((s, b) => s + b.budget, 0);
  const totalSpent = rows.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const pct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget</Text>
          <TouchableOpacity onPress={() => router.push('/budget/create')}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Budget</Text>
            <Text style={styles.summaryValue}>{formatMoney(totalBudget, currency)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={[styles.summaryValue, { color: c.pink }]}>{formatMoney(totalSpent, currency)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, { color: c.mint }]}>{formatMoney(remaining, currency)}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: c.mint }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(pct)}% used</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={c.violet} />}
      >
        <TouchableOpacity onPress={() => router.push('/budget/insights')} style={[styles.insightsLink, { backgroundColor: c.primaryLight }]}>
          <Text style={[styles.insightsText, { color: c.violet }]}>View budget insights →</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : rows.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No budgets yet. Tap + to create one.</Text>
        ) : (
          rows.map((budget) => {
            const percentage = budget.budget > 0 ? (budget.spent / budget.budget) * 100 : 0;
            const isOverBudget = budget.spent > budget.budget;
            return (
              <TouchableOpacity
                key={budget.id}
                style={[styles.budgetCard, { backgroundColor: c.bg, borderColor: c.border }]}
                onPress={() => router.push(`/budget/${budget.id}`)}
              >
                <View style={styles.budgetHeader}>
                  <Text style={[styles.categoryName, { color: c.text }]}>{budget.category}</Text>
                  {isOverBudget && <AlertCircle size={16} color={c.error} />}
                </View>
                <View style={[styles.budgetProgress, { backgroundColor: c.primaryLight }]}>
                  <View style={[styles.budgetBar, { backgroundColor: budget.color, width: `${Math.min(percentage, 100)}%` }]} />
                </View>
                <View style={styles.budgetStats}>
                  <Text style={[styles.spentText, { color: c.text }]}>{formatMoney(budget.spent, currency)}</Text>
                  <Text style={[styles.budgetText, { color: c.textSub }]}>of {formatMoney(budget.budget, currency)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  summaryContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: '800', color: '#fff' },
  progressContainer: { marginTop: 4 },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 6, textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  insightsLink: { borderRadius: 12, padding: 14, marginBottom: 16, alignItems: 'center' },
  insightsText: { fontSize: 14, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 14 },
  budgetCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryName: { fontSize: 15, fontWeight: '600' },
  budgetProgress: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  budgetBar: { height: '100%', borderRadius: 4 },
  budgetStats: { flexDirection: 'row', justifyContent: 'space-between' },
  spentText: { fontSize: 14, fontWeight: '700' },
  budgetText: { fontSize: 12 },
});
