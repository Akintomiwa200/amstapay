// app/loan/history.tsx - Loan History
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function LoanHistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  const loans = [
    { id: 1, amount: '50,000', status: 'completed', date: '2024-01-15', paidAmount: '52,500', remaining: '0' },
    { id: 2, amount: '100,000', status: 'active', date: '2024-02-01', paidAmount: '25,000', remaining: '81,250' },
    { id: 3, amount: '25,000', status: 'pending', date: '2024-03-10', paidAmount: '0', remaining: '25,625' },
  ];

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'completed':
        return { icon: CheckCircle, color: c.success, text: 'Completed' };
      case 'active':
        return { icon: Clock, color: c.violet, text: 'Active' };
      default:
        return { icon: AlertCircle, color: c.warning, text: 'Pending' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Loan History</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loans.map((loan) => {
          const StatusIcon = getStatusConfig(loan.status).icon;
          return (
            <TouchableOpacity key={loan.id} style={[styles.loanCard, { backgroundColor: c.bg, borderColor: c.border }]} onPress={() => router.push(`/loan/${loan.id}`)}>
              <View style={styles.loanHeader}>
                <Text style={[styles.loanAmount, { color: c.primary }]}>₦{parseInt(loan.amount).toLocaleString()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusConfig(loan.status).color + '20' }]}>
                  <StatusIcon size={12} color={getStatusConfig(loan.status).color} />
                  <Text style={[styles.statusText, { color: getStatusConfig(loan.status).color }]}>
                    {getStatusConfig(loan.status).text}
                  </Text>
                </View>
              </View>
              <View style={styles.loanDetails}>
                <View>
                  <Text style={[styles.detailLabel, { color: c.textSub }]}>Date Taken</Text>
                  <Text style={[styles.detailValue, { color: c.text }]}>{loan.date}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, { color: c.textSub }]}>Paid Amount</Text>
                  <Text style={[styles.detailValue, { color: c.text }]}>₦{parseInt(loan.paidAmount).toLocaleString()}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, { color: c.textSub }]}>Remaining</Text>
                  <Text style={[styles.detailValue, { color: c.error }]}>₦{parseInt(loan.remaining).toLocaleString()}</Text>
                </View>
              </View>
              <ChevronRight size={18} color={c.textSub} style={styles.arrow} />
            </TouchableOpacity>
          );
        })}
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
  loanCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  loanAmount: { fontSize: 18, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  loanDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 11, marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '500' },
  arrow: { position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -9 }] },
});
