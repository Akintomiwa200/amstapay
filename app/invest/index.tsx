// app/invest/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, ChevronRight, PiggyBank } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { investmentService } from '@/services/investments';
import type { Investment, InvestmentPlan } from '@/lib/models';

const InvestScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      investmentService.getPlans().catch(() => []),
      investmentService.getAll().catch(() => []),
    ]).then(([plansData, investmentsData]) => {
      setPlans(Array.isArray(plansData) ? plansData : (plansData as { data?: InvestmentPlan[] })?.data || []);
      setUserInvestments(Array.isArray(investmentsData) ? investmentsData : (investmentsData as { data?: Investment[] })?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = userInvestments.reduce((sum, inv) => sum + (inv.expectedReturns || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invest</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Invested</Text>
            <Text style={styles.statValue}>₦{totalInvested.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Returns</Text>
            <Text style={styles.statValue}>₦{totalReturns.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 24 }} />
        ) : (
          <>
        {userInvestments.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Your Investments</Text>
            {userInvestments.map((inv) => (
              <TouchableOpacity key={inv._id} style={[styles.investmentCard, { backgroundColor: c.primaryLight }]} onPress={() => router.push(`/invest/${inv._id}`)}>
                <View style={styles.investmentHeader}>
                  <TrendingUp size={20} color={c.violet} />
                  <Text style={[styles.investmentName, { color: c.text }]}>{inv.plan?.name || 'Investment'}</Text>
                  <View style={[styles.activeBadge, { backgroundColor: c.success }]}>
                    <Text style={[styles.activeText, { color: c.primary }]}>{inv.status}</Text>
                  </View>
                </View>
                <View style={styles.investmentDetails}>
                  <View>
                    <Text style={[styles.detailLabel, { color: c.textSub }]}>Amount</Text>
                    <Text style={[styles.detailValue, { color: c.text }]}>₦{inv.amount.toLocaleString()}</Text>
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, { color: c.textSub }]}>Returns</Text>
                    <Text style={[styles.detailValue, { color: c.success }]}>+₦{(inv.expectedReturns || 0).toLocaleString()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Available Plans</Text>
          {plans.map((inv, index) => {
            const colors = [c.mint, c.blue, c.violet];
            const color = colors[index % colors.length];
            return (
            <TouchableOpacity key={inv._id} style={styles.planCard} onPress={() => router.push({ pathname: '/invest-confirm', params: { planId: inv._id, planName: inv.name, minAmount: String(inv.minInvestment), returns: String(inv.roi), duration: String(inv.durations?.[0] || 12) } })}>
              <LinearGradient
                colors={[`${color}10`, `${color}05`]}
                style={styles.planGradient}
              >
                <View style={styles.planHeader}>
                  <PiggyBank size={24} color={color} />
                  <Text style={[styles.planName, { color }]}>{inv.name}</Text>
                  <ChevronRight size={18} color={c.textSub} />
                </View>
                <View style={styles.planStats}>
                  <View>
                    <Text style={[styles.planLabel, { color: c.textSub }]}>Expected Return</Text>
                    <Text style={[styles.planValue, { color: c.text }]}>{inv.roi}% p.a</Text>
                  </View>
                  <View>
                    <Text style={[styles.planLabel, { color: c.textSub }]}>Min. Amount</Text>
                    <Text style={[styles.planValue, { color: c.text }]}>₦{inv.minInvestment.toLocaleString()}</Text>
                  </View>
                  <View>
                    <Text style={[styles.planLabel, { color: c.textSub }]}>Risk</Text>
                    <Text style={[styles.planValue, { color: c.text }]}>{inv.riskLevel}</Text>
                  </View>
                </View>
                <View style={[styles.investBtn, { backgroundColor: `${color}20` }]}>
                  <Text style={[styles.investBtnText, { color }]}>Invest Now</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            );
          })}
        </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statsContainer: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  investmentCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
  investmentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  investmentName: { flex: 1, fontSize: 16, fontWeight: '600' },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  activeText: { fontSize: 10, fontWeight: '600' },
  investmentDetails: { flexDirection: 'row', gap: 24 },
  detailLabel: { fontSize: 11, marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '700' },
  planCard: { borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  planGradient: { padding: 16 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  planName: { flex: 1, fontSize: 16, fontWeight: '700' },
  planStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  planLabel: { fontSize: 11, marginBottom: 4 },
  planValue: { fontSize: 14, fontWeight: '600' },
  investBtn: { paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  investBtnText: { fontSize: 14, fontWeight: '600' },
});

export default InvestScreen;
