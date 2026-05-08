// app/budget/insights.tsx - Budget Insights Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, PieChart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function BudgetInsightsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  const insights = [
    { type: 'warning', title: 'Transportation Over Budget', desc: 'You exceeded your transport budget by ₦2,000 this month. Consider using public transit.', icon: AlertTriangle, color: c.error },
    { type: 'success', title: 'Food & Dining on Track', desc: 'You\'re at 57% of your food budget with 12 days remaining. Great job!', icon: CheckCircle, color: c.mint },
    { type: 'tip', title: 'Savings Opportunity', desc: 'Reducing entertainment spending by ₦2,000 would help reach your savings goal faster.', icon: TrendingUp, color: c.violet },
  ];

  const categories = [
    { name: 'Food & Dining', spent: 8500, budget: 15000, color: c.violet },
    { name: 'Transportation', spent: 12000, budget: 10000, color: c.error },
    { name: 'Shopping', spent: 5000, budget: 8000, color: c.mint },
    { name: 'Entertainment', spent: 3000, budget: 5000, color: c.blue },
  ];

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget Insights</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Overview */}
        <View style={styles.overviewCard}>
          <PieChart size={40} color="#fff" />
          <View style={styles.overviewInfo}>
            <Text style={styles.overviewLabel}>Overall Usage</Text>
            <Text style={styles.overviewValue}>{Math.round((totalSpent / totalBudget) * 100)}%</Text>
            <Text style={styles.overviewSub}>
              ₦{totalSpent.toLocaleString()} of ₦{totalBudget.toLocaleString()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Insights */}
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Key Insights</Text>
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <View key={i} style={[styles.insightCard, { backgroundColor: c.bg, borderColor: c.border, borderLeftColor: insight.color }]}>
              <Icon size={22} color={insight.color} />
              <View style={styles.insightInfo}>
                <Text style={[styles.insightTitle, { color: c.text }]}>{insight.title}</Text>
                <Text style={[styles.insightDesc, { color: c.textSub }]}>{insight.desc}</Text>
              </View>
            </View>
          );
        })}

        {/* Category Breakdown */}
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Category Breakdown</Text>
        {categories.map((cat, i) => {
          const percent = (cat.spent / cat.budget) * 100;
          const overBudget = cat.spent > cat.budget;
          return (
            <View key={i} style={[styles.catCard, { backgroundColor: c.bg, borderColor: c.border }]}>
              <View style={styles.catHeader}>
                <Text style={[styles.catName, { color: c.text }]}>{cat.name}</Text>
                <Text style={[styles.catPercent, { color: c.mint }, overBudget && { color: c.error }]}>
                  {Math.round(percent)}%
                </Text>
              </View>
              <View style={[styles.catBar, { backgroundColor: c.primaryLight }]}>
                <View style={[styles.catBarFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: overBudget ? c.error : cat.color }]} />
              </View>
              <View style={styles.catFooter}>
                <Text style={[styles.catSpent, { color: c.text }]}>₦{cat.spent.toLocaleString()}</Text>
                <Text style={[styles.catBudget, { color: c.textSub }]}>of ₦{cat.budget.toLocaleString()}</Text>
              </View>
            </View>
          );
        })}

        {/* Tips */}
        <LinearGradient colors={[c.primaryLight, c.bg]} style={[styles.tipCard, { borderColor: c.border }]}>
          <TrendingDown size={24} color={c.mint} />
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: c.primary }]}>Monthly Tip</Text>
            <Text style={[styles.tipText, { color: c.textSub }]}>Setting a weekly spending limit can help you stay within your monthly budget more consistently.</Text>
          </View>
        </LinearGradient>
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
  overviewCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, gap: 16 },
  overviewInfo: { flex: 1 },
  overviewLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  overviewValue: { fontSize: 28, fontWeight: '800', color: '#fff' },
  overviewSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 16, borderWidth: 1, borderLeftWidth: 4, gap: 12, marginBottom: 12 },
  insightInfo: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  insightDesc: { fontSize: 13, lineHeight: 20 },
  catCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 12 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catName: { fontSize: 14, fontWeight: '600' },
  catPercent: { fontSize: 14, fontWeight: '700' },
  catBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  catBarFill: { height: '100%', borderRadius: 4 },
  catFooter: { flexDirection: 'row', gap: 4 },
  catSpent: { fontSize: 12, fontWeight: '600' },
  catBudget: { fontSize: 12 },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 20, borderRadius: 18, borderWidth: 1, gap: 14, marginTop: 8, marginBottom: 40 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  tipText: { fontSize: 13, lineHeight: 20 },
});
