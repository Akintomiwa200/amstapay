// app/insights/index.tsx - Financial Insights
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, TrendingDown, BarChart3, PieChart, ArrowUpRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function InsightsScreen() {
  const router = useRouter();

  const insights = [
    { id: 1, title: 'Spending Analysis', value: '+12%', trend: 'up', description: 'Your spending increased this month', color: C.error },
    { id: 2, title: 'Savings Rate', value: '23%', trend: 'up', description: 'You saved 23% of your income', color: C.success },
    { id: 3, title: 'Investment Growth', value: '+8.5%', trend: 'up', description: 'Your portfolio is performing well', color: C.violet },
    { id: 4, title: 'Top Category', value: 'Food', trend: 'neutral', description: 'You spend most on food & dining', color: C.warning },
  ];

  const categories = [
    { name: 'Food & Dining', amount: 8500, percentage: 35, color: C.violet },
    { name: 'Transportation', amount: 12000, percentage: 28, color: C.error },
    { name: 'Shopping', amount: 5000, percentage: 20, color: C.mint },
    { name: 'Entertainment', amount: 3000, percentage: 12, color: C.blue },
    { name: 'Bills', amount: 1500, percentage: 5, color: C.pink },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Insights</Text>
          <TouchableOpacity>
            <Calendar size={22} color={C.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.insightsGrid}>
          {insights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                {insight.trend === 'up' ? 
                  <TrendingUp size={20} color={insight.color} /> : 
                  insight.trend === 'down' ?
                  <TrendingDown size={20} color={insight.color} /> :
                  <BarChart3 size={20} color={insight.color} />
                }
              </View>
              <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <Text style={styles.categoryAmount}>₦{category.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.reportBtn} onPress={() => router.push('/insights/reports')}>
          <BarChart3 size={20} color={C.violet} />
          <Text style={styles.reportText}>Generate Full Report</Text>
          <ArrowUpRight size={18} color={C.violet} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  insightCard: { flex: 1, minWidth: '45%', backgroundColor: C.bg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  insightTitle: { fontSize: 13, color: C.textSub },
  insightValue: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  insightDescription: { fontSize: 11, color: C.textSub, lineHeight: 14 },
  section: { backgroundColor: C.bg, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 16 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryName: { fontSize: 14, color: C.text },
  categoryAmount: { fontSize: 14, fontWeight: '600', color: C.text },
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.primaryLight, paddingVertical: 16, borderRadius: 14, marginBottom: 40 },
  reportText: { fontSize: 15, fontWeight: '600', color: C.violet },
});