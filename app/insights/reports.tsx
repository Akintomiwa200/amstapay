// app/insights/reports.tsx - Financial Reports Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, BarChart3, PieChart, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ReportsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [period, setPeriod] = useState('monthly');

  const spendingCategories = [
    { name: 'Bills & Utilities', amount: '₦45,000', percent: 35, color: c.violet },
    { name: 'Shopping', amount: '₦25,000', percent: 20, color: c.blue },
    { name: 'Transport', amount: '₦18,000', percent: 14, color: c.mint },
    { name: 'Food & Dining', amount: '₦22,000', percent: 17, color: c.pink },
    { name: 'Others', amount: '₦18,000', percent: 14, color: c.warning },
  ];

  const monthlyTrend = [
    { month: 'Jan', income: 250000, expense: 120000 },
    { month: 'Feb', income: 260000, expense: 135000 },
    { month: 'Mar', income: 338200, expense: 128000 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Financial Reports</Text>
          <TouchableOpacity style={styles.downloadBtn}>
            <Download size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Period Tabs */}
        <View style={styles.periodTabs}>
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === p && styles.periodTabActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && [styles.periodTextActive, { color: c.primary }]]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ArrowDownRight size={18} color={c.mint} />
            <Text style={[styles.summaryLabel, { color: c.textSub }]}>Total Income</Text>
            <Text style={[styles.summaryValue, { color: c.text }]}>₦338,200</Text>
            <Text style={[styles.summaryChange, { color: c.mint }]}>+12% from last month</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ArrowUpRight size={18} color={c.pink} />
            <Text style={[styles.summaryLabel, { color: c.textSub }]}>Total Expense</Text>
            <Text style={[styles.summaryValue, { color: c.text }]}>₦128,000</Text>
            <Text style={[styles.summaryChange, { color: c.mint }]}>-5% from last month</Text>
          </View>
        </View>

        {/* Spending Breakdown */}
        <View style={[styles.section, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color={c.violet} />
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Spending Breakdown</Text>
          </View>
          {spendingCategories.map((cat, i) => (
            <View key={i} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: c.text }]}>{cat.name}</Text>
                <View style={[styles.progressBar, { backgroundColor: c.primaryLight }]}>
                  <View style={[styles.progressFill, { width: `${cat.percent}%`, backgroundColor: cat.color }]} />
                </View>
              </View>
              <View style={styles.categoryRight}>
                <Text style={[styles.categoryAmount, { color: c.text }]}>{cat.amount}</Text>
                <Text style={[styles.categoryPercent, { color: c.textSub }]}>{cat.percent}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Trend */}
        <View style={[styles.section, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color={c.violet} />
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Monthly Trend</Text>
          </View>
          {monthlyTrend.map((m, i) => (
            <View key={i} style={styles.trendRow}>
              <Text style={[styles.trendMonth, { color: c.text }]}>{m.month}</Text>
              <View style={styles.trendBars}>
                <View style={[styles.trendBarContainer, { backgroundColor: c.primaryLight }]}>
                  <View style={[styles.trendBar, { width: `${(m.income / 400000) * 100}%`, backgroundColor: c.mint }]} />
                </View>
                <View style={[styles.trendBarContainer, { backgroundColor: c.primaryLight }]}>
                  <View style={[styles.trendBar, { width: `${(m.expense / 400000) * 100}%`, backgroundColor: c.pink }]} />
                </View>
              </View>
              <View style={styles.trendValues}>
                <Text style={[styles.trendIncome, { color: c.mint }]}>+₦{(m.income / 1000).toFixed(0)}k</Text>
                <Text style={[styles.trendExpense, { color: c.pink }]}>-₦{(m.expense / 1000).toFixed(0)}k</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tips */}
        <LinearGradient colors={[c.primaryLight, c.bg]} style={[styles.tipCard, { borderColor: c.border }]}>
          <TrendingUp size={24} color={c.violet} />
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: c.primary }]}>Savings Tip</Text>
            <Text style={[styles.tipText, { color: c.textSub }]}>Your spending on Bills increased by 15%. Consider reviewing your subscriptions.</Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  periodTabs: { flexDirection: 'row', gap: 8 },
  periodTab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  periodTabActive: { backgroundColor: '#fff' },
  periodText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  periodTextActive: {},
  content: { paddingHorizontal: 20, paddingTop: 20 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, gap: 4 },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  summaryChange: { fontSize: 11 },
  section: { marginBottom: 24, borderRadius: 20, padding: 16, borderWidth: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  categoryRight: { alignItems: 'flex-end', marginLeft: 12 },
  categoryAmount: { fontSize: 13, fontWeight: '600' },
  categoryPercent: { fontSize: 11 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  trendMonth: { width: 32, fontSize: 13, fontWeight: '600' },
  trendBars: { flex: 1, gap: 4 },
  trendBarContainer: { height: 8, borderRadius: 4, overflow: 'hidden' },
  trendBar: { height: '100%', borderRadius: 4 },
  trendValues: { width: 60, alignItems: 'flex-end' },
  trendIncome: { fontSize: 10, fontWeight: '600' },
  trendExpense: { fontSize: 10, fontWeight: '600' },
  tipCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1, gap: 16, marginBottom: 40 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  tipText: { fontSize: 13, lineHeight: 20 },
});
