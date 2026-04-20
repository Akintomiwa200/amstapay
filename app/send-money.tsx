// app/send-money.tsx - Send Money Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, User, ArrowRight, Clock, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function SendMoneyScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
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
          <Text style={styles.label}>Amount</Text>
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

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((qa) => (
            <TouchableOpacity
              key={qa}
              style={[styles.quickBtn, amount === String(qa) && styles.quickBtnActive]}
              onPress={() => setAmount(String(qa))}
            >
              <Text style={[styles.quickBtnText, amount === String(qa) && styles.quickBtnTextActive]}>
                ₦{qa.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recipient */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient</Text>
          <View style={styles.searchInput}>
            <Search size={18} color={C.textSub} />
            <TextInput
              style={styles.searchField}
              placeholder="Account number or username"
              placeholderTextColor={C.textSub}
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's this for?"
            placeholderTextColor={C.textSub}
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Recent Recipients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={C.violet} />
            <Text style={styles.sectionTitle}>Recent Recipients</Text>
          </View>
          {recentRecipients.map((r) => (
            <TouchableOpacity key={r.id} style={styles.recipientCard} onPress={() => setRecipient(r.name)}>
              <View style={styles.recipientAvatar}>
                <User size={20} color={C.violet} />
              </View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{r.name}</Text>
                <Text style={styles.recipientAccount}>{r.bank} • {r.account}</Text>
              </View>
              <ArrowRight size={16} color={C.textSub} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Send Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.sendGradient}>
            <Text style={styles.sendText}>Send Money</Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  amountSection: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primaryLight, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1, borderColor: C.border },
  currency: { fontSize: 28, fontWeight: '800', color: C.primary, marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700', color: C.text },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  quickBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.primaryLight, borderWidth: 1, borderColor: C.border },
  quickBtnActive: { backgroundColor: C.violet, borderColor: C.violet },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: C.text },
  quickBtnTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 20 },
  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border },
  searchField: { flex: 1, paddingVertical: 14, marginLeft: 8, fontSize: 15, color: C.text },
  noteInput: { backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: C.text, borderWidth: 1, borderColor: C.border },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.primary },
  recipientCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  recipientAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  recipientInfo: { flex: 1 },
  recipientName: { fontSize: 15, fontWeight: '600', color: C.text },
  recipientAccount: { fontSize: 12, color: C.textSub, marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border },
  sendBtn: { borderRadius: 16, overflow: 'hidden' },
  sendGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  sendText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
