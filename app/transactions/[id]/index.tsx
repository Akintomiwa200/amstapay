// app/transactions/[id].tsx - Transaction Details
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ArrowUpRight, ArrowDownRight, Calendar, Clock, MapPin, Receipt, Copy, Share2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const transaction = {
    id: id,
    type: 'Salary Deposit',
    amount: '+50,000',
    date: '2024-03-15',
    time: '10:45 AM',
    category: 'income',
    status: 'completed',
    from: 'Employer Inc.',
    to: 'Main Account',
    reference: 'TRX-2024-0315-001',
    description: 'Monthly salary payment for March 2024',
    fee: '₦0',
    balanceAfter: '₦245,800'
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.amountCard}>
          <View style={[styles.iconCircle, transaction.category === 'income' ? styles.incomeBg : styles.expenseBg]}>
            {transaction.category === 'income' ? 
              <ArrowDownRight size={32} color="#fff" /> : 
              <ArrowUpRight size={32} color="#fff" />
            }
          </View>
          <Text style={styles.amountLabel}>{transaction.type}</Text>
          <Text style={[styles.amount, transaction.category === 'income' ? styles.positiveAmount : styles.negativeAmount]}>
            {transaction.amount}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Calendar size={18} color={C.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{transaction.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Clock size={18} color={C.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{transaction.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MapPin size={18} color={C.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>From</Text>
              <Text style={styles.detailValue}>{transaction.from}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Receipt size={18} color={C.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Reference</Text>
              <View style={styles.referenceRow}>
                <Text style={styles.referenceValue}>{transaction.reference}</Text>
                <TouchableOpacity>
                  <Copy size={16} color={C.violet} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>{transaction.amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fee</Text>
            <Text style={styles.summaryValue}>{transaction.fee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.summaryLabel}>Balance After</Text>
            <Text style={styles.totalValue}>{transaction.balanceAfter}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareBtn}>
            <Share2 size={18} color={C.violet} />
            <Text style={styles.shareText}>Share Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportBtn}>
            <Text style={styles.reportText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  amountCard: { alignItems: 'center', backgroundColor: C.bg, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  incomeBg: { backgroundColor: C.success },
  expenseBg: { backgroundColor: C.error },
  amountLabel: { fontSize: 14, color: C.textSub, marginBottom: 8 },
  amount: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
  positiveAmount: { color: C.success },
  negativeAmount: { color: C.error },
  statusBadge: { backgroundColor: C.success + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600', color: C.success },
  detailsCard: { backgroundColor: C.bg, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  detailRow: { flexDirection: 'row', marginBottom: 20 },
  detailIcon: { width: 40, alignItems: 'center' },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, color: C.textSub, marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: '500', color: C.text },
  referenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  referenceValue: { fontSize: 14, color: C.text, flex: 1 },
  summaryCard: { backgroundColor: C.primaryLight, borderRadius: 20, padding: 20, marginBottom: 20 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: C.textSub },
  summaryValue: { fontSize: 14, fontWeight: '500', color: C.text },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  totalValue: { fontSize: 16, fontWeight: '700', color: C.primary },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, backgroundColor: C.primaryLight, borderRadius: 14 },
  shareText: { fontSize: 14, fontWeight: '600', color: C.violet },
  reportBtn: { flex: 1, paddingVertical: 14, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  reportText: { fontSize: 14, fontWeight: '500', color: C.error },
});