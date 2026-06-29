import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Download, Share2, ArrowLeft, Home } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Share, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { useAuth } from '@/context/AuthContext';
import { transactionService } from '@/services/transactions';
import { parseData } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import type { Transaction } from '@/lib/models';

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ transactionId?: string; amount?: string; recipient?: string }>();
  const { theme, isDarkMode } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const { getTransaction } = useAuth();
  const [txn, setTxn] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(!!params.transactionId);

  useEffect(() => {
    if (!params.transactionId) return;
    (async () => {
      try {
        const res = await getTransaction?.(params.transactionId) ?? transactionService.getById(params.transactionId);
        setTxn(parseData<Transaction>(res));
      } finally {
        setLoading(false);
      }
    })();
  }, [params.transactionId]);

  const amount = txn?.amount ?? Number(params.amount) ?? 0;
  const recipient = txn?.receiverName || params.recipient || 'Recipient';
  const transactionId = txn?._id || params.transactionId || 'N/A';
  const date = txn?.createdAt
    ? new Date(txn.createdAt).toLocaleString('en-NG')
    : new Date().toLocaleString('en-NG');

  const receiptText = `AmstaPay Receipt\nAmount: ${formatMoney(Math.abs(amount), currency)}\nTo: ${recipient}\nID: ${transactionId}\nDate: ${date}\nStatus: Successful`;

  const handleShareReceipt = async () => {
    await Share.share({ message: receiptText, title: 'AmstaPay Receipt' });
  };

  const handleDownloadReceipt = () => {
    if (params.transactionId) {
      router.push(`/receipt/${params.transactionId}`);
    } else {
      handleShareReceipt();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={c.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Transaction Status</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.successSection}>
          <View style={[styles.successIconContainer, { borderColor: c.mint }]}>
            <CheckCircle size={80} color={c.mint} />
          </View>
          <Text style={[styles.successTitle, { color: c.text }]}>Payment Successful!</Text>
          <Text style={[styles.successSubtitle, { color: c.textSub }]}>Your transaction has been completed</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginVertical: 24 }} />
        ) : (
          <View style={[styles.detailsCard, { borderColor: c.violet, backgroundColor: c.bg }]}>
            <View style={styles.amountSection}>
              <Text style={[styles.amountLabel, { color: c.textSub }]}>Amount</Text>
              <Text style={[styles.amountValue, { color: c.text }]}>{formatMoney(Math.abs(amount), currency)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <DetailRow label="Recipient" value={recipient} c={c} />
            <DetailRow label="Transaction ID" value={transactionId} c={c} />
            <DetailRow label="Date & Time" value={date} c={c} />
            <DetailRow label="Status" value="Successful" valueColor={c.mint} c={c} />
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: c.violet }]} onPress={handleDownloadReceipt}>
            <Download size={20} color={c.text} />
            <Text style={[styles.secondaryButtonText, { color: c.text }]}>View Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: c.violet }]} onPress={handleShareReceipt}>
            <Share2 size={20} color={c.text} />
            <Text style={[styles.secondaryButtonText, { color: c.text }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.bottomSection, { borderTopColor: c.border, backgroundColor: c.bg }]}>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: c.violet }]} onPress={() => router.replace('/dashboard')}>
          <Home size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function DetailRow({ label, value, valueColor, c }: { label: string; value: string; valueColor?: string; c: { text: string; textSub: string } }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: c.textSub }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor || c.text }]}>{value}</Text>
    </View>
  );
}

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  successSection: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 16 },
  successIconContainer: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 4 },
  successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  successSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  detailsCard: { marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2 },
  amountSection: { alignItems: 'center', marginBottom: 20 },
  amountLabel: { fontSize: 14, marginBottom: 4 },
  amountValue: { fontSize: 32, fontWeight: 'bold' },
  divider: { height: 1, marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailLabel: { fontSize: 14, flex: 1 },
  detailValue: { fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right' },
  actionsSection: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 24 },
  secondaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, gap: 8 },
  secondaryButtonText: { fontSize: 14, fontWeight: '600' },
  bottomSection: { padding: 16, borderTopWidth: 1 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 16, gap: 8 },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
