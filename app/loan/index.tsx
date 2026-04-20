// app/loan/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Shield, Calculator, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

const LoanScreen = () => {
  const router = useRouter();
  const [amount, setAmount] = React.useState('');
  const [duration, setDuration] = React.useState('3');

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(amount) || 0;
    const rate = 0.025; // 2.5% monthly
    const months = parseInt(duration);
    if (principal === 0) return 0;
    return principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * parseInt(duration);
  const interest = totalPayment - (parseFloat(amount) || 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loans</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Shield size={32} color={C.violet} />
          <Text style={styles.infoTitle}>Quick Loans up to ₦500,000</Text>
          <Text style={styles.infoText}>Get instant approval with competitive interest rates</Text>
        </View>

        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorTitle}>Loan Calculator</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Loan Amount (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Duration (Months)</Text>
            <View style={styles.durationSelector}>
              {['3', '6', '12'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.durationBtn, duration === m && styles.durationBtnActive]}
                  onPress={() => setDuration(m)}
                >
                  <Text style={[styles.durationText, duration === m && styles.durationTextActive]}>{m} mo</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {parseFloat(amount) > 0 && (
            <View style={styles.results}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Monthly Payment</Text>
                <Text style={styles.resultValue}>₦{monthlyPayment.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Interest</Text>
                <Text style={styles.resultValue}>₦{interest.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Payment</Text>
                <Text style={styles.resultValue}>₦{totalPayment.toFixed(2)}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.applyBtn}>
            <LinearGradient colors={[C.mint, C.blue, C.violet]} style={styles.applyGradient}>
              <Text style={styles.applyText}>Apply for Loan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Requirements</Text>
          <View style={styles.requirementItem}>
            <CheckCircle size={16} color={C.success} />
            <Text style={styles.requirementText}>Active account for 3+ months</Text>
          </View>
          <View style={styles.requirementItem}>
            <CheckCircle size={16} color={C.success} />
            <Text style={styles.requirementText}>Valid BVN verification</Text>
          </View>
          <View style={styles.requirementItem}>
            <CheckCircle size={16} color={C.success} />
            <Text style={styles.requirementText}>Regular transaction history</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  infoCard: { alignItems: 'center', backgroundColor: C.primaryLight, borderRadius: 20, padding: 24, marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginTop: 12, marginBottom: 8 },
  infoText: { fontSize: 13, color: C.textSub, textAlign: 'center' },
  calculatorCard: { backgroundColor: C.bg, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  calculatorTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 8 },
  input: { backgroundColor: C.inputBg, borderRadius: 14, padding: 14, fontSize: 16, borderWidth: 1, borderColor: C.border },
  durationSelector: { flexDirection: 'row', gap: 12 },
  durationBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: C.inputBg, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  durationBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  durationText: { fontSize: 14, fontWeight: '500', color: C.text },
  durationTextActive: { color: '#fff' },
  results: { marginTop: 16, marginBottom: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.border },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  resultLabel: { fontSize: 14, color: C.textSub },
  resultValue: { fontSize: 16, fontWeight: '700', color: C.text },
  applyBtn: { borderRadius: 14, overflow: 'hidden' },
  applyGradient: { paddingVertical: 14, alignItems: 'center' },
  applyText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  requirementsCard: { backgroundColor: C.primaryLight, borderRadius: 20, padding: 20, marginBottom: 32 },
  requirementsTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 12 },
  requirementItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  requirementText: { fontSize: 13, color: C.text, flex: 1 },
});

export default LoanScreen;