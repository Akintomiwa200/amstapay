import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ArrowUpRight, ArrowDownRight, Calendar, Clock, MapPin, Receipt, Copy } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { transactionService } from '@/services/transactions';
import * as Clipboard from 'expo-clipboard';
import type { Transaction } from '@/lib/models';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const c = theme.colors;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    transactionService.getById(id as string)
      .then((data) => {
        const tx = (data as { data?: Transaction })?.data ?? (data as Transaction);
        setTransaction(tx);
      })
      .catch(() => setTransaction(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: c.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: c.text }}>Transaction not found</Text>
      </View>
    );
  }

  const isIncome = transaction.amount > 0;
  const date = new Date(transaction.createdAt);

  const copyReference = async () => {
    if (transaction.reference) {
      await Clipboard.setStringAsync(transaction.reference);
      Alert.alert('Copied', 'Reference copied');
    }
  };

  const shareReceipt = async () => {
    await Share.share({
      message: `AmstaPay Receipt\nType: ${transaction.type}\nAmount: ₦${Math.abs(transaction.amount).toLocaleString()}\nReference: ${transaction.reference || 'N/A'}\nStatus: ${transaction.status}`,
    });
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
          <View style={[styles.iconCircle, { backgroundColor: isIncome ? c.success : c.error }]}>
            {isIncome ? <ArrowDownRight size={32} color="#fff" /> : <ArrowUpRight size={32} color="#fff" />}
          </View>
          <Text style={[styles.amountLabel, { color: c.textSub }]}>{transaction.type}</Text>
          <Text style={[styles.amount, { color: isIncome ? c.success : c.error }]}>
            {isIncome ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: c.success + '20' }]}>
            <Text style={[styles.statusText, { color: c.success }]}>{transaction.status}</Text>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Calendar size={18} color={c.violet} /></View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>Date</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{date.toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Clock size={18} color={c.violet} /></View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>Time</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{date.toLocaleTimeString()}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><MapPin size={18} color={c.violet} /></View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>From</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{transaction.sender || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Receipt size={18} color={c.violet} /></View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: c.textSub }]}>Reference</Text>
              <View style={styles.referenceRow}>
                <Text style={[styles.referenceValue, { color: c.text }]}>{transaction.reference || 'N/A'}</Text>
                <TouchableOpacity onPress={copyReference}><Copy size={16} color={c.violet} /></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: c.primaryLight }]} onPress={shareReceipt}>
          <Text style={[styles.shareText, { color: c.violet }]}>Share Receipt</Text>
        </TouchableOpacity>
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
  shareBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 40 },
  shareText: { fontSize: 14, fontWeight: '600' },
});
