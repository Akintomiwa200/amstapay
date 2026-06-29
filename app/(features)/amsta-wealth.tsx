import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, PiggyBank, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { investmentService } from '@/services/investments';
import { parseList } from '@/lib/parse';
import type { InvestmentPlan } from '@/lib/models';

export default function AmstaWealthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentService.getPlans()
      .then((res) => setPlans(parseList<InvestmentPlan>(res)))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const handleInvest = (plan: InvestmentPlan) => {
    router.push({
      pathname: '/invest-confirm',
      params: {
        planId: plan._id,
        planName: plan.name,
        minAmount: String(plan.minInvestment),
        returns: String(plan.roi),
        duration: `${plan.durations?.[0] || 30} days`,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AmstaWealth</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Grow your money with secure investments</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : plans.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No plans available right now. Check back soon.</Text>
        ) : (
          plans.map((plan) => (
            <View key={plan._id} style={[styles.planCard, { backgroundColor: c.bg, borderColor: c.border }]}>
              <View style={styles.planHeader}>
                <PiggyBank size={22} color={c.violet} />
                <Text style={[styles.planName, { color: c.text }]}>{plan.name}</Text>
                <View style={[styles.roiBadge, { backgroundColor: `${c.mint}22` }]}>
                  <TrendingUp size={14} color={c.mint} />
                  <Text style={[styles.roiText, { color: c.mint }]}>{plan.roi}%</Text>
                </View>
              </View>
              <Text style={[styles.planDesc, { color: c.textSub }]}>{plan.description}</Text>
              <View style={styles.planDetails}>
                <Text style={[styles.detail, { color: c.textSub }]}>Min: ₦{plan.minInvestment.toLocaleString()}</Text>
                <Text style={[styles.detail, { color: c.textSub }]}>Risk: {plan.riskLevel}</Text>
              </View>
              <TouchableOpacity style={[styles.investButton, { backgroundColor: c.violet }]} onPress={() => handleInvest(plan)}>
                <Text style={styles.investButtonText}>Invest Now</Text>
              </TouchableOpacity>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  content: { padding: 20 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 14 },
  planCard: { borderRadius: 16, padding: 18, borderWidth: 1, marginBottom: 14 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  planName: { flex: 1, fontSize: 16, fontWeight: '700' },
  roiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  roiText: { fontSize: 12, fontWeight: '700' },
  planDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  planDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  detail: { fontSize: 12 },
  investButton: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  investButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
