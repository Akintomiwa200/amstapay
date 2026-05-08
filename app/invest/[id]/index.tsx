// app/invest/[id].tsx - Investment Details
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, Calendar, Clock, Shield, ArrowUpRight, AlertCircle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function InvestmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const c = theme.colors;

  const investment = {
    id: id,
    name: 'AmstaWealth Plus',
    amount: '50,000',
    currentValue: '53,125',
    returns: '+3,125',
    returnPercentage: '+6.25%',
    startDate: '2024-01-15',
    maturityDate: '2024-07-15',
    duration: '6 months',
    risk: 'Low',
    status: 'active',
    performance: [
      { month: 'Jan', value: 50000 },
      { month: 'Feb', value: 50800 },
      { month: 'Mar', value: 51500 },
      { month: 'Apr', value: 52100 },
      { month: 'May', value: 52800 },
      { month: 'Jun', value: 53125 },
    ]
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{investment.name}</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.valueCard, { backgroundColor: c.primaryLight }]}>
          <Text style={[styles.valueLabel, { color: c.textSub }]}>Current Value</Text>
          <Text style={[styles.valueAmount, { color: c.primary }]}>₦{parseInt(investment.currentValue).toLocaleString()}</Text>
          <View style={styles.returnRow}>
            <TrendingUp size={16} color={c.success} />
            <Text style={[styles.returnText, { color: c.success }]}>{investment.returns} ({investment.returnPercentage})</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Calendar size={20} color={c.violet} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Start Date</Text>
            <Text style={[styles.statValue, { color: c.text }]}>{investment.startDate}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Clock size={20} color={c.violet} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Maturity Date</Text>
            <Text style={[styles.statValue, { color: c.text }]}>{investment.maturityDate}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Shield size={20} color={c.violet} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Risk Level</Text>
            <Text style={[styles.statValue, { color: c.text }]}>{investment.risk}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            <TrendingUp size={20} color={c.violet} />
            <Text style={[styles.statLabel, { color: c.textSub }]}>Duration</Text>
            <Text style={[styles.statValue, { color: c.text }]}>{investment.duration}</Text>
          </View>
        </View>

        <View style={[styles.performanceCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <Text style={[styles.performanceTitle, { color: c.primary }]}>Performance</Text>
          {/* Add chart component here */}
          <View style={styles.performancePreview}>
            {investment.performance.map((item, index) => (
              <View key={index} style={styles.monthBar}>
                <View style={[styles.bar, { height: (item.value / 53125) * 80, backgroundColor: c.violet }]} />
                <Text style={[styles.monthLabel, { color: c.textSub }]}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.withdrawBtn}>
            <LinearGradient colors={[c.mint, c.blue, c.violet]} style={styles.withdrawGradient}>
              <Text style={styles.withdrawText}>Withdraw Investment</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.reinvestBtn, { backgroundColor: c.primaryLight }]}>
            <Text style={[styles.reinvestText, { color: c.violet }]}>Reinvest Returns</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <AlertCircle size={16} color={c.warning} />
          <Text style={[styles.infoText, { color: c.warning }]}>Early withdrawal may incur a 5% penalty fee</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  valueCard: { borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20 },
  valueLabel: { fontSize: 14, marginBottom: 8 },
  valueAmount: { fontSize: 36, fontWeight: '800', marginBottom: 8 },
  returnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  returnText: { fontSize: 14, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, minWidth: '45%', borderRadius: 16, padding: 16, borderWidth: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, marginTop: 8, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '600' },
  performanceCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20 },
  performanceTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  performancePreview: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  monthBar: { alignItems: 'center', gap: 8 },
  bar: { width: 30, borderRadius: 4 },
  monthLabel: { fontSize: 11 },
  actionsCard: { gap: 12, marginBottom: 20 },
  withdrawBtn: { borderRadius: 14, overflow: 'hidden' },
  withdrawGradient: { paddingVertical: 14, alignItems: 'center' },
  withdrawText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  reinvestBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  reinvestText: { fontSize: 16, fontWeight: '600' },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, marginBottom: 40 },
  infoText: { flex: 1, fontSize: 13 },
});
