// app/invest/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, PiggyBank, BarChart3, Shield, ChevronRight, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const InvestScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  const investments = [
    { id: 1, name: 'AmstaWealth Plus', return: '12.5%', minAmount: '10,000', duration: '6 months', risk: 'Low', color: c.mint },
    { id: 2, name: 'Fixed Savings', return: '9.8%', minAmount: '50,000', duration: '12 months', risk: 'Very Low', color: c.blue },
    { id: 3, name: 'Growth Fund', return: '18.2%', minAmount: '100,000', duration: '24 months', risk: 'Medium', color: c.violet },
  ];

  const userInvestments = [
    { id: 1, name: 'AmstaWealth Plus', amount: '50,000', returns: '3,125', status: 'active' },
  ];

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
            <Text style={styles.statValue}>₦50,000</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Returns</Text>
            <Text style={styles.statValue}>₦3,125</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {userInvestments.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Your Investments</Text>
            {userInvestments.map((inv) => (
              <View key={inv.id} style={[styles.investmentCard, { backgroundColor: c.primaryLight }]}>
                <View style={styles.investmentHeader}>
                  <TrendingUp size={20} color={c.violet} />
                  <Text style={[styles.investmentName, { color: c.text }]}>{inv.name}</Text>
                  <View style={[styles.activeBadge, { backgroundColor: c.success }]}>
                    <Text style={[styles.activeText, { color: c.primary }]}>Active</Text>
                  </View>
                </View>
                <View style={styles.investmentDetails}>
                  <View>
                    <Text style={[styles.detailLabel, { color: c.textSub }]}>Amount</Text>
                    <Text style={[styles.detailValue, { color: c.text }]}>₦{parseInt(inv.amount).toLocaleString()}</Text>
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, { color: c.textSub }]}>Returns</Text>
                    <Text style={[styles.detailValue, { color: c.success }]}>+₦{parseInt(inv.returns).toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Available Plans</Text>
          {investments.map((inv) => (
            <TouchableOpacity key={inv.id} style={styles.planCard}>
              <LinearGradient
                colors={[`${inv.color}10`, `${inv.color}05`]}
                style={styles.planGradient}
              >
                <View style={styles.planHeader}>
                  <PiggyBank size={24} color={inv.color} />
                  <Text style={[styles.planName, { color: inv.color }]}>{inv.name}</Text>
                  <ChevronRight size={18} color={c.textSub} />
                </View>
                <View style={styles.planStats}>
                  <View>
                    <Text style={[styles.planLabel, { color: c.textSub }]}>Expected Return</Text>
                    <Text style={[styles.planValue, { color: c.text }]}>{inv.return} p.a</Text>
                  </View>
                  <View>
                    <Text style={[styles.planLabel, { color: c.textSub }]}>Min. Amount</Text>
                    <Text style={[styles.planValue, { color: c.text }]}>₦{parseInt(inv.minAmount).toLocaleString()}</Text>
                  </View>
                  <View>
                    <Text style={[styles.planLabel, { color: c.textSub }]}>Duration</Text>
                    <Text style={[styles.planValue, { color: c.text }]}>{inv.duration}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.investBtn, { backgroundColor: `${inv.color}20` }]}>
                  <Text style={[styles.investBtnText, { color: inv.color }]}>Invest Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
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
