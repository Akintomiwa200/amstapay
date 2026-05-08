// app/loan/[id]/index.tsx - Loan Detail Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Calendar, Clock, CreditCard, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function LoanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const c = theme.colors;

  const loan = {
    id,
    type: 'Personal Loan',
    amount: 200000,
    amountPaid: 80000,
    interestRate: '12%',
    tenor: '6 months',
    monthlyPayment: 36000,
    nextPaymentDate: 'Apr 15, 2024',
    startDate: 'Jan 15, 2024',
    endDate: 'Jul 15, 2024',
    status: 'Active',
    payments: [
      { id: 1, date: 'Mar 15, 2024', amount: '₦36,000', status: 'Paid' },
      { id: 2, date: 'Feb 15, 2024', amount: '₦36,000', status: 'Paid' },
      { id: 3, date: 'Jan 15, 2024', amount: '₦8,000', status: 'Paid' },
    ],
  };

  const progress = (loan.amountPaid / loan.amount) * 100;
  const remaining = loan.amount - loan.amountPaid;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{loan.type}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Loan Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Paid</Text>
              <Text style={styles.progressValue}>₦{loan.amountPaid.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.progressLabel}>Total</Text>
              <Text style={styles.progressValue}>₦{loan.amount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: c.mint }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% repaid</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Next Payment */}
        <View style={[styles.nextPayment, { backgroundColor: c.primaryLight }]}>
          <View style={styles.nextPaymentLeft}>
            <Clock size={20} color={c.violet} />
            <View>
              <Text style={[styles.nextLabel, { color: c.textSub }]}>Next Payment</Text>
              <Text style={[styles.nextDate, { color: c.text }]}>{loan.nextPaymentDate}</Text>
            </View>
          </View>
          <Text style={[styles.nextAmount, { color: c.violet }]}>₦{loan.monthlyPayment.toLocaleString()}</Text>
        </View>

        {/* Loan Details */}
        <View style={[styles.detailsCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Loan Details</Text>
          {[
            { label: 'Loan Amount', value: `₦${loan.amount.toLocaleString()}` },
            { label: 'Interest Rate', value: loan.interestRate },
            { label: 'Tenor', value: loan.tenor },
            { label: 'Monthly Payment', value: `₦${loan.monthlyPayment.toLocaleString()}` },
            { label: 'Remaining Balance', value: `₦${remaining.toLocaleString()}` },
            { label: 'Start Date', value: loan.startDate },
            { label: 'End Date', value: loan.endDate },
            { label: 'Status', value: loan.status },
          ].map((item, i) => (
            <View key={i} style={[styles.detailRow, { borderBottomColor: c.border }]}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>{item.label}</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Payment History</Text>
          {loan.payments.map((pay) => (
            <View key={pay.id} style={[styles.paymentRow, { borderBottomColor: c.border }]}>
              <View style={styles.paymentIcon}>
                <CheckCircle size={18} color={c.mint} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={[styles.paymentDate, { color: c.text }]}>{pay.date}</Text>
                <Text style={[styles.paymentStatus, { color: c.mint }]}>{pay.status}</Text>
              </View>
              <Text style={[styles.paymentAmount, { color: c.text }]}>{pay.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.85}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.payGradient}>
            <Text style={styles.payText}>Make Payment</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  progressCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  progressValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  nextPayment: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: 16, marginBottom: 20 },
  nextPaymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextLabel: { fontSize: 12 },
  nextDate: { fontSize: 14, fontWeight: '600' },
  nextAmount: { fontSize: 18, fontWeight: '800' },
  detailsCard: { borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  paymentIcon: { marginRight: 12 },
  paymentInfo: { flex: 1 },
  paymentDate: { fontSize: 14, fontWeight: '600' },
  paymentStatus: { fontSize: 12, marginTop: 2 },
  paymentAmount: { fontSize: 15, fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  payText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
