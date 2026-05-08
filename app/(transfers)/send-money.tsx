// app/send-money.tsx - Send Money Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, User, ArrowRight, Clock, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function SendMoneyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const recentRecipients = [
    { id: 1, name: 'John Doe', account: '****1234', bank: 'GTBank' },
    { id: 2, name: 'Jane Smith', account: '****5678', bank: 'Access Bank' },
    { id: 3, name: 'David Oke', account: '****9012', bank: 'First Bank' },
  ];

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleSend = () => {
    if (!amount || !recipient) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    router.push({
      pathname: '/confirm-transaction',
      params: { amount, recipient, note, type: 'send' },
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

        {/* Recipient */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Recipient</Text>
          <View style={[styles.searchInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <Search size={18} color={c.textSub} />
            <TextInput
              style={[styles.searchField, { color: c.text }]}
              placeholder="Account number or username"
              placeholderTextColor={c.textSub}
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
        </View>

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
          {recentRecipients.map((r) => (
            <TouchableOpacity key={r.id} style={[styles.recipientCard, { borderBottomColor: c.border }]} onPress={() => setRecipient(r.name)}>
              <View style={[styles.recipientAvatar, { backgroundColor: c.primaryLight }]}>
                <User size={20} color={c.violet} />
              </View>
              <View style={styles.recipientInfo}>
                <Text style={[styles.recipientName, { color: c.text }]}>{r.name}</Text>
                <Text style={[styles.recipientAccount, { color: c.textSub }]}>{r.bank} • {r.account}</Text>
              </View>
              <ArrowRight size={16} color={c.textSub} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  sendBtn: { borderRadius: 16, overflow: 'hidden' },
  sendGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  sendText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
