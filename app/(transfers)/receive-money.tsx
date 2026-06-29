// app/receive-money.tsx - Receive Money Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Share, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Copy, Share2, QrCode, CreditCard, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function ReceiveMoneyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const [amount, setAmount] = useState('');

  const accountDetails = {
    accountNumber: user?.amstapayAccountNumber || user?.accountNumber || 'N/A',
    accountName: user?.accountName || user?.fullName || user?.name || 'Guest User',
    bankName: user?.bankName || 'AmstaPay',
  };

  const handleCopy = async (text: string) => {
    if (!text || text === 'N/A') {
      Alert.alert('Unavailable', 'No account number available for this profile yet.');
      return;
    }

    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Account number copied to clipboard.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send money to my AmstaPay account:\n\nAccount Name: ${accountDetails.accountName}\nAccount Number: ${accountDetails.accountNumber}\nBank: ${accountDetails.bankName}${amount ? `\nAmount: ₦${amount}` : ''}`,
      });
    } catch {
      Alert.alert('Share Failed', 'Unable to share account details right now.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receive Money</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.accountCard, { backgroundColor: c.primaryLight, borderColor: c.border }]}>
          <Text style={[styles.cardLabel, { color: c.primary }]}>Your AmstaPay Account</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: c.textSub }]}>Account Name</Text>
            <Text style={[styles.detailValue, { color: c.text }]}>{accountDetails.accountName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: c.textSub }]}>Account Number</Text>
            <View style={styles.copyRow}>
              <Text style={[styles.accountNumber, { color: c.primary }]}>{accountDetails.accountNumber}</Text>
              <TouchableOpacity onPress={() => handleCopy(accountDetails.accountNumber)} style={[styles.copyBtn, { backgroundColor: c.bg }]}>
                <Copy size={16} color={c.violet} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: c.textSub }]}>Bank</Text>
            <Text style={[styles.detailValue, { color: c.text }]}>{accountDetails.bankName}</Text>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={[styles.label, { color: c.primary }]}>Request Amount (Optional)</Text>
          <View style={[styles.amountInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <Text style={[styles.currency, { color: c.primary }]}>₦</Text>
            <TextInput
              style={[styles.amountField, { color: c.text }]}
              placeholder="0.00"
              placeholderTextColor={c.textSub}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: c.primaryLight }]} onPress={() => router.push('/my-qr')}>
            <QrCode size={24} color={c.violet} />
            <Text style={[styles.actionText, { color: c.text }]}>Show QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: c.primaryLight }]} onPress={handleShare}>
            <Share2 size={24} color={c.blue} />
            <Text style={[styles.actionText, { color: c.text }]}>Share Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Other Ways to Receive</Text>
          <TouchableOpacity style={[styles.methodRow, { borderBottomColor: c.border }]}>
            <View style={[styles.methodIcon, { backgroundColor: c.primaryLight }]}>
              <CreditCard size={20} color={c.violet} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodTitle, { color: c.text }]}>Bank Transfer</Text>
              <Text style={[styles.methodSub, { color: c.textSub }]}>Receive from any bank account</Text>
            </View>
            <ChevronRight size={18} color={c.textSub} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.methodRow, { borderBottomColor: c.border }]}>
            <View style={[styles.methodIcon, { backgroundColor: c.primaryLight }]}>
              <QrCode size={20} color={c.mint} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodTitle, { color: c.text }]}>QR Payment</Text>
              <Text style={[styles.methodSub, { color: c.textSub }]}>Let sender scan your QR code</Text>
            </View>
            <ChevronRight size={18} color={c.textSub} />
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
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  accountCard: { borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1 },
  cardLabel: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  detailRow: { marginBottom: 16 },
  detailLabel: { fontSize: 12, marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: '600' },
  copyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accountNumber: { fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  copyBtn: { padding: 8, borderRadius: 8 },
  amountSection: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, borderWidth: 1 },
  currency: { fontSize: 24, fontWeight: '800', marginRight: 8 },
  amountField: { flex: 1, fontSize: 24, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8 },
  actionText: { fontSize: 13, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  methodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  methodIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '600' },
  methodSub: { fontSize: 12, marginTop: 2 },
});
