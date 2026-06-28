// app/request-money.tsx - Request Money Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, User, ArrowRight, Clock, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { paymentsService } from '@/services/payments';
import { beneficiaryService } from '@/services/beneficiary';
import { useEffect } from 'react';

export default function RequestMoneyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recentContacts, setRecentContacts] = useState<{ id: string; name: string; phone: string }[]>([]);

  useEffect(() => {
    beneficiaryService.getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { data?: { _id: string; name: string; accountNumber: string }[] })?.data || [];
        setRecentContacts(list.slice(0, 5).map(b => ({
          id: b._id,
          name: b.name,
          phone: b.accountNumber,
        })));
      })
      .catch(() => setRecentContacts([]));
  }, []);

  const handleRequest = async () => {
    if (!amount || !recipient) {
      Alert.alert('Error', 'Please enter an amount and select a recipient');
      return;
    }
    const amountValue = Number(amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    try {
      setSubmitting(true);
      await paymentsService.requestMoney({
        amount: amountValue,
        recipient,
        note: note || undefined,
      });
      Alert.alert('Request Sent', `Your request for ₦${amountValue.toLocaleString()} has been sent to ${recipient}`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Request Failed', error instanceof Error ? error.message : 'Unable to send money request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Money</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={[styles.label, { color: c.primary }]}>How much?</Text>
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

        {/* From */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Request From</Text>
          <View style={[styles.searchInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <Search size={18} color={c.textSub} />
            <TextInput
              style={[styles.searchField, { color: c.text }]}
              placeholder="Name, email, or phone number"
              placeholderTextColor={c.textSub}
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Message (Optional)</Text>
          <View style={[styles.noteInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <MessageSquare size={18} color={c.textSub} />
            <TextInput
              style={[styles.noteField, { color: c.text }]}
              placeholder="What's this for?"
              placeholderTextColor={c.textSub}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>

        {/* Recent Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={c.violet} />
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Recent Contacts</Text>
          </View>
          {recentContacts.map((c) => (
            <TouchableOpacity key={c.id} style={[styles.contactCard, { borderBottomColor: c.border }]} onPress={() => setRecipient(c.name)}>
              <View style={[styles.contactAvatar, { backgroundColor: c.primaryLight }]}>
                <User size={20} color={c.violet} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: c.text }]}>{c.name}</Text>
                <Text style={[styles.contactPhone, { color: c.textSub }]}>{c.phone}</Text>
              </View>
              <ArrowRight size={16} color={c.textSub} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Request Button */}
      <View style={[styles.footer, { backgroundColor: c.bg, borderTopColor: c.border }]}>
        <TouchableOpacity style={styles.requestBtn} onPress={handleRequest} activeOpacity={0.85} disabled={submitting}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.requestGradient}>
            {submitting ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={styles.requestText}>Send Request</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
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
  amountSection: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1 },
  currency: { fontSize: 28, fontWeight: '800', marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700' },
  inputGroup: { marginBottom: 20 },
  searchInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, borderWidth: 1 },
  searchField: { flex: 1, paddingVertical: 14, marginLeft: 8, fontSize: 15 },
  noteInput: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1 },
  noteField: { flex: 1, marginLeft: 8, fontSize: 15, minHeight: 60 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  contactCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  contactAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600' },
  contactPhone: { fontSize: 12, marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  requestBtn: { borderRadius: 16, overflow: 'hidden' },
  requestGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  requestText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
