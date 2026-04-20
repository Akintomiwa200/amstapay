// app/invest-confirm.tsx - Investment Confirmation Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, Shield, Clock, ArrowRight, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function InvestConfirmScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');

  const plan = {
    name: 'AmstaWealth Growth Plan',
    minAmount: 10000,
    returns: '12-15% annually',
    duration: '12 months',
    risk: 'Medium',
  };

  const handleConfirm = () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < plan.minAmount) {
      Alert.alert('Error', `Minimum investment amount is ₦${plan.minAmount.toLocaleString()}`);
      return;
    }
    Alert.alert('Investment Confirmed', `You've invested ₦${numAmount.toLocaleString()} in ${plan.name}`, [
      { text: 'OK', onPress: () => router.push('/dashboard') },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
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
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <TrendingUp size={22} color={C.violet} />
            <Text style={styles.planName}>{plan.name}</Text>
          </View>

          <View style={styles.planDetails}>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>Expected Returns</Text>
              <Text style={styles.planValue}>{plan.returns}</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>Duration</Text>
              <Text style={styles.planValue}>{plan.duration}</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>Risk Level</Text>
              <Text style={[styles.planValue, { color: C.warning }]}>{plan.risk}</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>Minimum Investment</Text>
              <Text style={styles.planValue}>₦{plan.minAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.label}>Investment Amount</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.amountField}
              placeholder="0.00"
              placeholderTextColor={C.textSub}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickRow}>
          {[10000, 50000, 100000, 500000].map((qa) => (
            <TouchableOpacity key={qa} style={styles.quickBtn} onPress={() => setAmount(String(qa))}>
              <Text style={styles.quickText}>₦{(qa / 1000).toFixed(0)}k</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Info size={18} color={C.blue} />
          <Text style={styles.infoText}>
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
                <Icon size={18} color={C.mint} />
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.confirmGradient}>
            <Text style={styles.confirmText}>Confirm Investment</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  planCard: { backgroundColor: C.primaryLight, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: C.border },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  planName: { fontSize: 18, fontWeight: '700', color: C.primary },
  planDetails: { gap: 12 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between' },
  planLabel: { fontSize: 13, color: C.textSub },
  planValue: { fontSize: 14, fontWeight: '600', color: C.text },
  amountSection: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1, borderColor: C.border },
  currency: { fontSize: 28, fontWeight: '800', color: C.primary, marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700', color: C.text },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  quickBtn: { flex: 1, paddingVertical: 10, backgroundColor: C.primaryLight, borderRadius: 12, alignItems: 'center' },
  quickText: { fontSize: 13, fontWeight: '600', color: C.violet },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.blue + '10', borderRadius: 14, padding: 16, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 13, color: C.textSub, lineHeight: 20 },
  features: { gap: 12, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, color: C.text, fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  confirmBtn: { borderRadius: 16, overflow: 'hidden' },
  confirmGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  confirmText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
