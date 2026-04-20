// app/request-money.tsx - Request Money Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Search, User, ArrowRight, Clock, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function RequestMoneyScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const recentContacts = [
    { id: 1, name: 'John Doe', phone: '+234 801 234 5678' },
    { id: 2, name: 'Jane Smith', phone: '+234 802 345 6789' },
    { id: 3, name: 'David Oke', phone: '+234 803 456 7890' },
  ];

  const handleRequest = () => {
    if (!amount || !recipient) {
      Alert.alert('Error', 'Please enter an amount and select a recipient');
      return;
    }
    Alert.alert('Request Sent', `Your request for ₦${amount} has been sent to ${recipient}`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
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
          <Text style={styles.label}>How much?</Text>
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

        {/* From */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Request From</Text>
          <View style={styles.searchInput}>
            <Search size={18} color={C.textSub} />
            <TextInput
              style={styles.searchField}
              placeholder="Name, email, or phone number"
              placeholderTextColor={C.textSub}
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message (Optional)</Text>
          <View style={styles.noteInput}>
            <MessageSquare size={18} color={C.textSub} />
            <TextInput
              style={styles.noteField}
              placeholder="What's this for?"
              placeholderTextColor={C.textSub}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>

        {/* Recent Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={C.violet} />
            <Text style={styles.sectionTitle}>Recent Contacts</Text>
          </View>
          {recentContacts.map((c) => (
            <TouchableOpacity key={c.id} style={styles.contactCard} onPress={() => setRecipient(c.name)}>
              <View style={styles.contactAvatar}>
                <User size={20} color={C.violet} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>
              <ArrowRight size={16} color={C.textSub} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Request Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.requestBtn} onPress={handleRequest} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.requestGradient}>
            <Text style={styles.requestText}>Send Request</Text>
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
  amountSection: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primaryLight, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1, borderColor: C.border },
  currency: { fontSize: 28, fontWeight: '800', color: C.primary, marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700', color: C.text },
  inputGroup: { marginBottom: 20 },
  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border },
  searchField: { flex: 1, paddingVertical: 14, marginLeft: 8, fontSize: 15, color: C.text },
  noteInput: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: C.border },
  noteField: { flex: 1, marginLeft: 8, fontSize: 15, color: C.text, minHeight: 60 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.primary },
  contactCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  contactAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600', color: C.text },
  contactPhone: { fontSize: 12, color: C.textSub, marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border },
  requestBtn: { borderRadius: 16, overflow: 'hidden' },
  requestGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  requestText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
