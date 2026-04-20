// app/receive-money.tsx - Receive Money Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Copy, Share2, QrCode, CreditCard, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';
import { useAuth } from '@/context/AuthContext';

export default function ReceiveMoneyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');

  const accountDetails = {
    accountNumber: '2098765432',
    accountName: user?.fullName || user?.name || 'Guest User',
    bankName: 'AmstaPay',
  };

  const handleCopy = (text: string) => {
    // Copy to clipboard
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send money to my AmstaPay account:\n\nAccount Name: ${accountDetails.accountName}\nAccount Number: ${accountDetails.accountNumber}\nBank: ${accountDetails.bankName}${amount ? `\nAmount: ₦${amount}` : ''}`,
      });
    } catch (e) {
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receive Money</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Card */}
        <View style={styles.accountCard}>
          <Text style={styles.cardLabel}>Your AmstaPay Account</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Name</Text>
            <Text style={styles.detailValue}>{accountDetails.accountName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <View style={styles.copyRow}>
              <Text style={styles.accountNumber}>{accountDetails.accountNumber}</Text>
              <TouchableOpacity onPress={() => handleCopy(accountDetails.accountNumber)} style={styles.copyBtn}>
                <Copy size={16} color={C.violet} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bank</Text>
            <Text style={styles.detailValue}>{accountDetails.bankName}</Text>
          </View>
        </View>

        {/* Amount Request */}
        <View style={styles.amountSection}>
          <Text style={styles.label}>Request Amount (Optional)</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.amountField}
              placeholder="0.00"
              placeholderTextColor={C.textSub}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/qr-code')}>
            <QrCode size={24} color={C.violet} />
            <Text style={styles.actionText}>Show QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={handleShare}>
            <Share2 size={24} color={C.blue} />
            <Text style={styles.actionText}>Share Details</Text>
          </TouchableOpacity>
        </View>

        {/* Other Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Ways to Receive</Text>
          <TouchableOpacity style={styles.methodRow}>
            <View style={styles.methodIcon}>
              <CreditCard size={20} color={C.violet} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Bank Transfer</Text>
              <Text style={styles.methodSub}>Receive from any bank account</Text>
            </View>
            <ChevronRight size={18} color={C.textSub} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.methodRow}>
            <View style={styles.methodIcon}>
              <QrCode size={20} color={C.mint} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>QR Payment</Text>
              <Text style={styles.methodSub}>Let sender scan your QR code</Text>
            </View>
            <ChevronRight size={18} color={C.textSub} />
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
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  accountCard: { backgroundColor: C.primaryLight, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: C.border },
  cardLabel: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 16 },
  detailRow: { marginBottom: 16 },
  detailLabel: { fontSize: 12, color: C.textSub, marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: '600', color: C.text },
  copyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accountNumber: { fontSize: 20, fontWeight: '800', color: C.primary, letterSpacing: 1 },
  copyBtn: { padding: 8, backgroundColor: C.bg, borderRadius: 8 },
  amountSection: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, borderWidth: 1, borderColor: C.border },
  currency: { fontSize: 24, fontWeight: '800', color: C.primary, marginRight: 8 },
  amountField: { flex: 1, fontSize: 24, fontWeight: '700', color: C.text },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionCard: { flex: 1, backgroundColor: C.primaryLight, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8 },
  actionText: { fontSize: 13, fontWeight: '600', color: C.text },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 16 },
  methodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  methodIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  methodSub: { fontSize: 12, color: C.textSub, marginTop: 2 },
});
