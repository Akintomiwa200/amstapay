// app/add-account.tsx - Add New Account Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, Building, Plus, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function AddAccountScreen() {
  const router = useRouter();
  const [accountType, setAccountType] = useState('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const accountTypes = [
    { key: 'bank', label: 'Bank Account', icon: Building },
    { key: 'card', label: 'Debit/Credit Card', icon: CreditCard },
  ];

  const handleAdd = () => {
    if (!bankName || !accountNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Account added successfully!', [
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
          <Text style={styles.headerTitle}>Add Account</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Type Selection */}
        <Text style={styles.label}>Account Type</Text>
        <View style={styles.typeRow}>
          {accountTypes.map((type) => {
            const Icon = type.icon;
            const active = accountType === type.key;
            return (
              <TouchableOpacity
                key={type.key}
                style={[styles.typeCard, active && styles.typeCardActive]}
                onPress={() => setAccountType(type.key)}
              >
                <Icon size={24} color={active ? '#fff' : C.violet} />
                <Text style={[styles.typeText, active && styles.typeTextActive]}>{type.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bank Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Name</Text>
          <TouchableOpacity style={styles.selectInput}>
            <Text style={bankName ? styles.selectValue : styles.selectPlaceholder}>
              {bankName || 'Select your bank'}
            </Text>
            <ChevronDown size={18} color={C.textSub} />
          </TouchableOpacity>
        </View>

        {/* Account Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter 10-digit account number"
            placeholderTextColor={C.textSub}
            keyboardType="numeric"
            maxLength={10}
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>

        {/* Account Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={[styles.textInput, styles.readOnly]}
            placeholder="Auto-detected from account number"
            placeholderTextColor={C.textSub}
            value={accountName}
            editable={false}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.addGradient}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addText}>Add Account</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeCard: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, alignItems: 'center', gap: 8 },
  typeCardActive: { backgroundColor: C.violet, borderColor: C.violet },
  typeText: { fontSize: 13, fontWeight: '600', color: C.text },
  typeTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 20 },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16 },
  selectValue: { fontSize: 15, color: C.text },
  selectPlaceholder: { fontSize: 15, color: C.textSub },
  textInput: { backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, fontSize: 15, color: C.text },
  readOnly: { backgroundColor: C.primaryLight },
  addBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 12, marginBottom: 40 },
  addGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  addText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
