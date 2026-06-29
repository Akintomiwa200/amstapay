import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, PieChart, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { budgetService } from '@/services/budget';
import { formatMoney } from '@/lib/format';

type Insight = { type: string; title: string; desc: string; icon: typeof AlertTriangle; color: string };
type CatRow = { name: string; spent: number; budget: number; color: string };

export default function BudgetInsightsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [categories, setCategories] = useState<CatRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await budgetService.getInsights();
      const data = (res as { data?: Record<string, unknown> })?.data ?? res;
      const payload = data as {
        insights?: { type?: string; title: string; description?: string; desc?: string }[];
        categories?: { name: string; spent: number; budget: number; color?: string }[];
      };

      const apiInsights = payload.insights || [];
      setInsights(
        apiInsights.length
          ? apiInsights.map((item) => ({
              type: item.type || 'tip',
              title: item.title,
              desc: item.description || item.desc || '',
              icon: item.type === 'warning' ? AlertTriangle : item.type === 'success' ? CheckCircle : TrendingUp,
              color: item.type === 'warning' ? c.error : item.type === 'success' ? c.mint : c.violet,
            }))
          : [],
      );

      const cats = payload.categories || [];
      setCategories(
        cats.map((cat, i) => ({
          name: cat.name,
          spent: cat.spent,
          budget: cat.budget,
          color: cat.color || [c.violet, c.error, c.mint, c.blue][i % 4],
        })),
      );
    } catch {
      setInsights([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [c]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const totalBudget = categories.reduce((s, x) => s + x.budget, 0);
  const totalSpent = categories.reduce((s, x) => s + x.spent, 0);

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

        <View style={styles.overviewCard}>
          <PieChart size={40} color="#fff" />
          <View style={styles.overviewInfo}>
            <Text style={styles.overviewLabel}>Overall Usage</Text>
            <Text style={styles.overviewValue}>{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</Text>
            <Text style={styles.overviewSub}>
              {formatMoney(totalSpent, currency)} of {formatMoney(totalBudget, currency)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Key Insights</Text>
            {insights.length === 0 ? (
              <Text style={[styles.empty, { color: c.textSub }]}>Create budgets to see personalized insights.</Text>
            ) : (
              insights.map((insight, i) => {
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
              })
            )}

            {categories.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: c.primary }]}>Category Breakdown</Text>
                {categories.map((cat, i) => {
                  const percent = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
                  const overBudget = cat.spent > cat.budget;
                  return (
                    <View key={i} style={[styles.catCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                      <View style={styles.catHeader}>
                        <Text style={[styles.catName, { color: c.text }]}>{cat.name}</Text>
                        <Text style={[styles.catPercent, { color: overBudget ? c.error : c.mint }]}>{Math.round(percent)}%</Text>
                      </View>
                      <View style={[styles.catBar, { backgroundColor: c.primaryLight }]}>
                        <View style={[styles.catFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: cat.color }]} />
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </>
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
  overviewCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16 },
  overviewInfo: { flex: 1 },
  overviewLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  overviewValue: { fontSize: 28, fontWeight: '800', color: '#fff' },
  overviewSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, marginTop: 8 },
  empty: { fontSize: 13, marginBottom: 20 },
  insightCard: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, borderLeftWidth: 4, marginBottom: 10 },
  insightInfo: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  insightDesc: { fontSize: 12, lineHeight: 17 },
  catCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catName: { fontSize: 14, fontWeight: '600' },
  catPercent: { fontSize: 13, fontWeight: '700' },
  catBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 4 },
});
