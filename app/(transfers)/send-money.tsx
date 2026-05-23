// app/send-money.tsx - Send Money Screen
import { useTheme } from '@/context/ThemeContext';
import { apiClient } from '@/lib/api';
import { beneficiaryService } from '@/services/beneficiary';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronLeft, Clock, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '058', name: 'GTBank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '011', name: 'First Bank' },
  { code: '033', name: 'UBA' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '032', name: 'Union Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '221', name: 'Stanbic IBTC' },
  { code: '050', name: 'Ecobank' },
  { code: '214', name: 'FCMB' },
  { code: '030', name: 'Heritage Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '068', name: 'Standard Chartered' },
  { code: '035', name: 'Wema Bank' },
  { code: '215', name: 'Unity Bank' },
  { code: '090', name: 'Kuda Bank' },
];

export default function SendMoneyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [note, setNote] = useState('');
  const [recentRecipients, setRecentRecipients] = useState<any[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [showBankPicker, setShowBankPicker] = useState(false);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      setLoadingRecipients(true);
      const data = await beneficiaryService.getAll();
      setRecentRecipients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load beneficiaries:', error);
      setRecentRecipients([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleVerifyAccount = async () => {
    if (!bankCode || !accountNumber || accountNumber.length !== 10) {
      return;
    }

    try {
      setVerifying(true);
      const response = await apiClient.post('/bank/verify', {
        bankCode,
        accountNumber,
      });
      setVerifiedName((response as any).accountName || '');
    } catch (error) {
      console.error('Verification failed:', error);
      setVerifiedName('');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      const timeoutId = setTimeout(() => {
        handleVerifyAccount();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setVerifiedName('');
    }
  }, [accountNumber, bankCode]);

  const handleSend = () => {
    if (!amount || !accountNumber || !bankCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    router.push({
      pathname: '/confirm-transaction',
      params: { 
        amount, 
        recipient: accountNumber,
        bankCode,
        bankName,
        accountName: verifiedName,
        note, 
        type: 'send' 
      },
    } as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={[styles.label, { color: c.primary }]}>Amount</Text>
          <View style={[styles.amountInput, { backgroundColor: c.primaryLight, borderColor: c.border }]}>
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

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((qa) => (
            <TouchableOpacity
              key={qa}
              style={[styles.quickBtn, { backgroundColor: c.primaryLight, borderColor: c.border }, amount === String(qa) && { backgroundColor: c.violet, borderColor: c.violet }]}
              onPress={() => setAmount(String(qa))}
            >
              <Text style={[styles.quickBtnText, { color: amount === String(qa) ? '#fff' : c.text }]}>
                ₦{qa.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bank Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Select Bank</Text>
          <TouchableOpacity
            style={[styles.bankSelector, { backgroundColor: c.inputBg, borderColor: c.border }]}
            onPress={() => setShowBankPicker(true)}
          >
            <Building2 size={18} color={c.textSub} />
            <Text style={[styles.bankText, { color: bankName ? c.text : c.textSub }]}>
              {bankName || 'Select a bank'}
            </Text>
            <ArrowRight size={16} color={c.textSub} />
          </TouchableOpacity>
        </View>

        {/* Account Number */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Account Number</Text>
          <View style={[styles.searchInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <TextInput
              style={[styles.searchField, { color: c.text }]}
              placeholder="10-digit account number"
              placeholderTextColor={c.textSub}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              maxLength={10}
            />
            {verifying && <ActivityIndicator size="small" color={c.primary} />}
          </View>
        </View>

        {/* Account Name Verification */}
        {verifiedName && (
          <View style={[styles.verifiedContainer, { backgroundColor: c.primaryLight, borderColor: c.success }]}>
            <Text style={[styles.checkmark, { color: c.success }]}>✓</Text>
            <View style={styles.verifiedInfo}>
              <Text style={[styles.verifiedLabel, { color: c.primary }]}>Account Name</Text>
              <Text style={[styles.verifiedName, { color: c.text }]}>{verifiedName}</Text>
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Note (Optional)</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: c.inputBg, color: c.text, borderColor: c.border }]}
            placeholder="What's this for?"
            placeholderTextColor={c.textSub}
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Recent Recipients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={c.violet} />
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Recent Recipients</Text>
          </View>
          {loadingRecipients ? (
            <ActivityIndicator color={c.primary} style={{ paddingVertical: 20 }} />
          ) : recentRecipients.length === 0 ? (
            <Text style={[styles.noRecipients, { color: c.textSub }]}>No recent recipients</Text>
          ) : (
            recentRecipients.map((r) => (
              <TouchableOpacity 
                key={r._id || r.id} 
                style={[styles.recipientCard, { borderBottomColor: c.border }]} 
                onPress={() => {
                  setAccountNumber(r.accountNumber || r.account || '');
                  setBankCode(r.bankCode || '');
                  setBankName(r.bankName || r.bank || '');
                }}
              >
                <View style={[styles.recipientAvatar, { backgroundColor: c.primaryLight }]}>
                  <User size={20} color={c.violet} />
                </View>
                <View style={styles.recipientInfo}>
                  <Text style={[styles.recipientName, { color: c.text }]}>{r.name || r.nickname}</Text>
                  <Text style={[styles.recipientAccount, { color: c.textSub }]}>
                    {r.bankName || r.bank} • {r.accountNumber ? r.accountNumber.slice(-4) : '****'}
                  </Text>
                </View>
                <ArrowRight size={16} color={c.textSub} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bank Picker Modal */}
      {showBankPicker && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: c.bg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.text }]}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowBankPicker(false)}>
                <ChevronLeft size={24} color={c.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.bankList}>
              {NIGERIAN_BANKS.map((bank) => (
                <TouchableOpacity
                  key={bank.code}
                  style={[styles.bankItem, { borderBottomColor: c.border }]}
                  onPress={() => {
                    setBankCode(bank.code);
                    setBankName(bank.name);
                    setShowBankPicker(false);
                  }}
                >
                  <Text style={[styles.bankItemName, { color: c.text }]}>{bank.name}</Text>
                  {bankCode === bank.code && <Text style={[styles.checkmark, { color: c.success }]}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Send Button */}
      <View style={[styles.footer, { backgroundColor: c.bg, borderTopColor: c.border }]}>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.sendGradient}>
            <Text style={styles.sendText}>Send Money</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  amountSection: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1 },
  currency: { fontSize: 28, fontWeight: '800', marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700' },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  quickBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  quickBtnActive: {},
  quickBtnText: { fontSize: 13, fontWeight: '600' },
  quickBtnTextActive: {},
  inputGroup: { marginBottom: 20 },
  searchInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, borderWidth: 1 },
  searchField: { flex: 1, paddingVertical: 14, marginLeft: 8, fontSize: 15 },
  noteInput: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  recipientCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  recipientAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  recipientInfo: { flex: 1 },
  recipientName: { fontSize: 15, fontWeight: '600' },
  recipientAccount: { fontSize: 12, marginTop: 2 },
  noRecipients: { fontSize: 14, paddingVertical: 20, textAlign: 'center' },
  bankSelector: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1 },
  bankText: { flex: 1, marginLeft: 8, fontSize: 15 },
  verifiedContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, marginBottom: 20 },
  verifiedInfo: { flex: 1, marginLeft: 12 },
  verifiedLabel: { fontSize: 12, fontWeight: '600' },
  verifiedName: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  checkmark: { fontSize: 20, fontWeight: 'bold' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  bankList: { flex: 1 },
  bankItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  bankItemName: { fontSize: 16, fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  sendBtn: { borderRadius: 16, overflow: 'hidden' },
  sendGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  sendText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
