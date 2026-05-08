// app/budget/index.tsx - Budget Overview
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, PieChart, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function BudgetScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  const budgets = [
    { id: 1, category: 'Food & Dining', spent: 8500, budget: 15000, color: c.violet },
    { id: 2, category: 'Transportation', spent: 12000, budget: 10000, color: c.error },
    { id: 3, category: 'Shopping', spent: 5000, budget: 8000, color: c.mint },
    { id: 4, category: 'Entertainment', spent: 3000, budget: 5000, color: c.blue },
  ];

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;

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
            <Text style={styles.summaryValue}>₦{totalBudget.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={[styles.summaryValue, { color: c.pink }]}>₦{totalSpent.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, { color: c.mint }]}>₦{remaining.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(totalSpent / totalBudget) * 100}%`, backgroundColor: c.mint }]} />
          </View>
          <Text style={styles.progressText}>{Math.round((totalSpent / totalBudget) * 100)}% used</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Budget Categories</Text>
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.budget) * 100;
            const isOverBudget = budget.spent > budget.budget;
            return (
              <TouchableOpacity key={budget.id} style={[styles.budgetCard, { backgroundColor: c.bg, borderColor: c.border }]} onPress={() => router.push(`/budget/${budget.id}`)}>
                <View style={styles.budgetHeader}>
                  <Text style={[styles.categoryName, { color: c.text }]}>{budget.category}</Text>
                  {isOverBudget && <AlertCircle size={16} color={c.error} />}
                </View>
                <View style={[styles.budgetProgress, { backgroundColor: c.primaryLight }]}>
                  <View style={[styles.budgetBar, { backgroundColor: budget.color, width: `${Math.min(percentage, 100)}%` }]} />
                </View>
                <View style={styles.budgetStats}>
                  <Text style={[styles.spentText, { color: c.text }]}>₦{budget.spent.toLocaleString()}</Text>
                  <Text style={[styles.budgetText, { color: c.textSub }]}>of ₦{budget.budget.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={[styles.insightsBtn, { backgroundColor: c.primaryLight }]} onPress={() => router.push('/budget/insights')}>
          <PieChart size={20} color={c.violet} />
          <Text style={[styles.insightsText, { color: c.violet }]}>View Spending Insights</Text>
          <ChevronRight size={18} color={c.violet} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  summaryContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  progressContainer: { gap: 8 },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  budgetCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryName: { fontSize: 15, fontWeight: '600' },
  budgetProgress: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  budgetBar: { height: '100%', borderRadius: 4 },
  budgetStats: { flexDirection: 'row', gap: 8 },
  spentText: { fontSize: 13, fontWeight: '600' },
  budgetText: { fontSize: 13 },
  insightsBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, marginBottom: 40 },
  insightsText: { flex: 1, fontSize: 15, fontWeight: '600' },
});
