// app/add-account.tsx - Add New Account Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, Building, Plus, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AddAccountScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
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
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
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
        <Text style={[styles.label, { color: c.primary }]}>Account Type</Text>
        <View style={styles.typeRow}>
          {accountTypes.map((type) => {
            const Icon = type.icon;
            const active = accountType === type.key;
            return (
              <TouchableOpacity
                key={type.key}
                style={[styles.typeCard, active && { backgroundColor: c.violet, borderColor: c.violet }, !active && { borderColor: c.border }]}
                onPress={() => setAccountType(type.key)}
              >
                <Icon size={24} color={active ? '#fff' : c.violet} />
                <Text style={[styles.typeText, active && styles.typeTextActive, !active && { color: c.text }]}>{type.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bank Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Bank Name</Text>
          <TouchableOpacity style={[styles.selectInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <Text style={bankName ? [styles.selectValue, { color: c.text }] : [styles.selectPlaceholder, { color: c.textSub }]}>
              {bankName || 'Select your bank'}
            </Text>
            <ChevronDown size={18} color={c.textSub} />
          </TouchableOpacity>
        </View>

        {/* Account Number */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Account Number</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: c.inputBg, borderColor: c.border, color: c.text }]}
            placeholder="Enter 10-digit account number"
            placeholderTextColor={c.textSub}
            keyboardType="numeric"
            maxLength={10}
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>

        {/* Account Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Account Name</Text>
          <TextInput
            style={[styles.textInput, styles.readOnly, { backgroundColor: c.primaryLight, borderColor: c.border, color: c.text }]}
            placeholder="Auto-detected from account number"
            placeholderTextColor={c.textSub}
            value={accountName}
            editable={false}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.addGradient}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addText}>Add Account</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 20, alignItems: 'center', gap: 8 },
  typeCardActive: {},
  typeText: { fontSize: 13, fontWeight: '600' },
  typeTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 20 },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16 },
  selectValue: { fontSize: 15 },
  selectPlaceholder: { fontSize: 15 },
  textInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, fontSize: 15 },
  readOnly: {},
  addBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 12, marginBottom: 40 },
  addGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  addText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
