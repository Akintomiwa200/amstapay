import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard } from 'lucide-react-native';

const BankTransferScreen = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const router = useRouter();

  const banks = [
    { id: 'access', name: 'Access Bank' },
    { id: 'uba', name: 'UBA' },
    { id: 'firstbank', name: 'First Bank' },
    { id: 'zenith', name: 'Zenith Bank' },
    { id: 'gtb', name: 'GTBank' },
    { id: 'ecobank', name: 'EcoBank' },
  ];

  const handleTransfer = () => {
    console.log('Transferring money:', { selectedBank, accountNumber, accountName, amount, narration });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bank Transfer</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Bank Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Bank</Text>
          <View style={styles.grid}>
            {banks.map(bank => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.gridButton,
                  selectedBank === bank.id && styles.gridButtonSelected
                ]}
                onPress={() => setSelectedBank(bank.id)}
              >
                <Text style={[
                  styles.gridButtonText,
                  selectedBank === bank.id && styles.gridButtonTextSelected
                ]}>
                  {bank.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Account Name (will be fetched automatically in real app) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Account name will appear here"
            value={accountName}
            onChangeText={setAccountName}
            editable={false}
          />
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Narration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Narration (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={narration}
            onChangeText={setNarration}
          />
        </View>

        {/* Transfer Button */}
        <TouchableOpacity
          style={[styles.button, (!accountNumber || !amount || !selectedBank) && styles.buttonDisabled]}
          onPress={handleTransfer}
          disabled={!accountNumber || !amount || !selectedBank}
        >
          <Text style={styles.buttonText}>Transfer Money</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  formContainer: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', minWidth: 100, alignItems: 'center' },
  gridButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  gridButtonText: { color: '#6B7280', fontWeight: '500' },
  gridButtonTextSelected: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, fontSize: 16 },
  button: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default BankTransferScreen;
