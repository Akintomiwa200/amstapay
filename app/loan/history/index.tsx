import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { loanService } from '@/services/loans';
import type { Loan } from '@/lib/models';

export default function LoanHistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loanService.getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { data?: Loan[] })?.data || [];
        setLoans(list);
      })
      .catch(() => setLoans([]))
      .finally(() => setLoading(false));
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'REPAID':
      case 'completed':
        return { icon: CheckCircle, color: c.success, text: 'Completed' };
      case 'ACTIVE':
      case 'APPROVED':
      case 'active':
        return { icon: Clock, color: c.violet, text: 'Active' };
      default:
        return { icon: AlertCircle, color: c.warning, text: status || 'Pending' };
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
        {loading ? (
          <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 40 }} />
        ) : loans.length === 0 ? (
          <Text style={{ textAlign: 'center', color: c.textSub, marginTop: 40 }}>No loans yet</Text>
        ) : (
          loans.map((loan) => {
            const status = getStatusConfig(loan.status);
            const StatusIcon = status.icon;
            return (
              <TouchableOpacity
                key={loan._id}
                style={[styles.loanCard, { backgroundColor: c.bg, borderColor: c.border }]}
                onPress={() => router.push(`/loan/${loan._id}`)}
              >
                <View style={styles.loanHeader}>
                  <Text style={[styles.loanAmount, { color: c.primary }]}>₦{loan.amount.toLocaleString()}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <StatusIcon size={14} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                  </View>
                </View>
                <Text style={[styles.loanDate, { color: c.textSub }]}>
                  {new Date(loan.createdAt).toLocaleDateString()} · {loan.duration} months
                </Text>
                <View style={styles.loanFooter}>
                  <Text style={[styles.remainingText, { color: c.text }]}>
                    Remaining: ₦{(loan.remainingBalance || 0).toLocaleString()}
                  </Text>
                  <ChevronRight size={18} color={c.textSub} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  loanCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  loanAmount: { fontSize: 20, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  loanDate: { fontSize: 13, marginBottom: 12 },
  loanFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remainingText: { fontSize: 14, fontWeight: '500' },
});
