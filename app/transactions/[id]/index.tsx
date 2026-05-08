// app/transactions/[id].tsx - Transaction Details
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ArrowUpRight, ArrowDownRight, Calendar, Clock, MapPin, Receipt, Copy, Share2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const c = theme.colors;

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
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Transaction Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.amountCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={[styles.iconCircle, transaction.category === 'income' ? { backgroundColor: c.success } : { backgroundColor: c.error }]}>
            {transaction.category === 'income' ? 
              <ArrowDownRight size={32} color="#fff" /> : 
              <ArrowUpRight size={32} color="#fff" />
            }
          </View>
          <Text style={[styles.amountLabel, { color: c.textSub }]}>{transaction.type}</Text>
          <Text style={[styles.amount, transaction.category === 'income' ? { color: c.success } : { color: c.error }]}>
            {transaction.amount}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: c.success + '20' }]}>
            <Text style={[styles.statusText, { color: c.success }]}>{transaction.status}</Text>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Calendar size={18} color={c.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>Date</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{transaction.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Clock size={18} color={c.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>Time</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{transaction.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MapPin size={18} color={c.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>From</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{transaction.from}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Receipt size={18} color={c.violet} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>Reference</Text>
              <View style={styles.referenceRow}>
                <Text style={[styles.referenceValue, { color: c.text }]}>{transaction.reference}</Text>
                <TouchableOpacity>
                  <Copy size={16} color={c.violet} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: c.primaryLight }]}>
          <Text style={[styles.summaryTitle, { color: c.primary }]}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: c.textSub }]}>Amount</Text>
            <Text style={[styles.summaryValue, { color: c.text }]}>{transaction.amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: c.textSub }]}>Fee</Text>
            <Text style={[styles.summaryValue, { color: c.text }]}>{transaction.fee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: c.border }]}>
            <Text style={styles.summaryLabel}>Balance After</Text>
            <Text style={[styles.totalValue, { color: c.primary }]}>{transaction.balanceAfter}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: c.primaryLight }]}>
            <Share2 size={18} color={c.violet} />
            <Text style={[styles.shareText, { color: c.violet }]}>Share Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Text style={[styles.reportText, { color: c.error }]}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  amountCard: { alignItems: 'center', borderRadius: 24, padding: 24, borderWidth: 1, marginBottom: 20 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  amountLabel: { fontSize: 14, marginBottom: 8 },
  amount: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  detailsCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20 },
  detailRow: { flexDirection: 'row', marginBottom: 20 },
  detailIcon: { width: 40, alignItems: 'center' },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: '500' },
  referenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  referenceValue: { fontSize: 14, flex: 1 },
  summaryCard: { borderRadius: 20, padding: 20, marginBottom: 20 },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '500' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1 },
  totalValue: { fontSize: 16, fontWeight: '700' },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  shareText: { fontSize: 14, fontWeight: '600' },
  reportBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  reportText: { fontSize: 14, fontWeight: '500' },
});
