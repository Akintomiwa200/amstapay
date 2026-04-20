// app/loan/[id]/index.tsx - Loan Detail Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Calendar, Clock, CreditCard, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function LoanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

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
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
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
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% repaid</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Next Payment */}
        <View style={styles.nextPayment}>
          <View style={styles.nextPaymentLeft}>
            <Clock size={20} color={C.violet} />
            <View>
              <Text style={styles.nextLabel}>Next Payment</Text>
              <Text style={styles.nextDate}>{loan.nextPaymentDate}</Text>
            </View>
          </View>
          <Text style={styles.nextAmount}>₦{loan.monthlyPayment.toLocaleString()}</Text>
        </View>

        {/* Loan Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
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
            <View key={i} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {loan.payments.map((pay) => (
            <View key={pay.id} style={styles.paymentRow}>
              <View style={styles.paymentIcon}>
                <CheckCircle size={18} color={C.mint} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentDate}>{pay.date}</Text>
                <Text style={styles.paymentStatus}>{pay.status}</Text>
              </View>
              <Text style={styles.paymentAmount}>{pay.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.payGradient}>
            <Text style={styles.payText}>Make Payment</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  progressCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  progressValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: C.mint, borderRadius: 4 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  nextPayment: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, marginBottom: 20 },
  nextPaymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextLabel: { fontSize: 12, color: C.textSub },
  nextDate: { fontSize: 14, fontWeight: '600', color: C.text },
  nextAmount: { fontSize: 18, fontWeight: '800', color: C.violet },
  detailsCard: { backgroundColor: C.bg, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  detailLabel: { fontSize: 13, color: C.textSub },
  detailValue: { fontSize: 14, fontWeight: '600', color: C.text },
  section: { marginBottom: 24 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  paymentIcon: { marginRight: 12 },
  paymentInfo: { flex: 1 },
  paymentDate: { fontSize: 14, fontWeight: '600', color: C.text },
  paymentStatus: { fontSize: 12, color: C.mint, marginTop: 2 },
  paymentAmount: { fontSize: 15, fontWeight: '700', color: C.text },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  payText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
