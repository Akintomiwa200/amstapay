// app/invest-confirm.tsx - Investment Confirmation Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, Shield, Clock, ArrowRight, Info } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { investmentService } from '@/services/investments';

export default function InvestConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const c = theme.colors;
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const plan = {
    id: params.planId as string,
    name: (params.planName as string) || 'Investment Plan',
    minAmount: Number(params.minAmount) || 10000,
    returns: (params.returns as string) || '12',
    duration: (params.duration as string) || '12 months',
    risk: 'Medium',
  };

  const handleConfirm = async () => {
    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount < plan.minAmount) {
      Alert.alert('Error', `Minimum investment amount is ₦${plan.minAmount.toLocaleString()}`);
      return;
    }
    if (!plan.id) {
      Alert.alert('Error', 'Invalid investment plan');
      return;
    }
    try {
      setSubmitting(true);
      await investmentService.create({
        planId: plan.id,
        amount: numAmount,
        duration: parseInt(plan.duration, 10) || 12,
      });
      Alert.alert('Investment Confirmed', `You've invested ₦${numAmount.toLocaleString()} in ${plan.name}`, [
        { text: 'OK', onPress: () => router.push('/invest') },
      ]);
    } catch (error) {
      Alert.alert('Investment Failed', error instanceof Error ? error.message : 'Unable to complete investment');
    } finally {
      setSubmitting(false);
    }
  };

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
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Plan Card */}
        <View style={[styles.planCard, { backgroundColor: c.primaryLight, borderColor: c.border }]}>
          <View style={styles.planHeader}>
            <TrendingUp size={22} color={c.violet} />
            <Text style={[styles.planName, { color: c.primary }]}>{plan.name}</Text>
          </View>

          <View style={styles.planDetails}>
            <View style={styles.planRow}>
              <Text style={[styles.planLabel, { color: c.textSub }]}>Expected Returns</Text>
              <Text style={[styles.planValue, { color: c.text }]}>{plan.returns}</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={[styles.planLabel, { color: c.textSub }]}>Duration</Text>
              <Text style={[styles.planValue, { color: c.text }]}>{plan.duration}</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={[styles.planLabel, { color: c.textSub }]}>Risk Level</Text>
              <Text style={[styles.planValue, { color: c.warning }]}>{plan.risk}</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={[styles.planLabel, { color: c.textSub }]}>Minimum Investment</Text>
              <Text style={[styles.planValue, { color: c.text }]}>₦{plan.minAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={[styles.label, { color: c.primary }]}>Investment Amount</Text>
          <View style={[styles.amountInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <Text style={[styles.currency, { color: c.primary }]}>₦</Text>
            <TextInput
              style={[styles.amountField, { color: c.text }]}
              placeholder="0.00"
              placeholderTextColor={c.textSub}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickRow}>
          {[10000, 50000, 100000, 500000].map((qa) => (
            <TouchableOpacity key={qa} style={[styles.quickBtn, { backgroundColor: c.primaryLight }]} onPress={() => setAmount(String(qa))}>
              <Text style={[styles.quickText, { color: c.violet }]}>₦{(qa / 1000).toFixed(0)}k</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: c.blue + '10' }]}>
          <Info size={18} color={c.blue} />
          <Text style={[styles.infoText, { color: c.textSub }]}>
            Your investment will mature after {plan.duration}. Early withdrawal may attract penalties.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[
            { icon: Shield, text: 'Capital Protected' },
            { icon: Clock, text: 'Auto-renew Option' },
            { icon: TrendingUp, text: 'Compound Interest' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <View key={i} style={styles.featureRow}>
                <Icon size={18} color={c.mint} />
                <Text style={[styles.featureText, { color: c.text }]}>{f.text}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85} disabled={submitting}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.confirmGradient}>
            {submitting ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={styles.confirmText}>Confirm Investment</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  planCard: { borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  planName: { fontSize: 18, fontWeight: '700' },
  planDetails: { gap: 12 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between' },
  planLabel: { fontSize: 13 },
  planValue: { fontSize: 14, fontWeight: '600' },
  amountSection: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1 },
  currency: { fontSize: 28, fontWeight: '800', marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700' },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  quickBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  quickText: { fontSize: 13, fontWeight: '600' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, padding: 16, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  features: { gap: 12, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  confirmBtn: { borderRadius: 16, overflow: 'hidden' },
  confirmGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  confirmText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
