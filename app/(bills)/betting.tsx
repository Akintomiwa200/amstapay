import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess } from '@/lib/billPayment';

const BettingScreen = () => {
  const [selectedBookmaker, setSelectedBookmaker] = useState('');
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const bookmakers = [
    { id: 'bet9ja', name: 'Bet9ja' },
    { id: 'nairabet', name: 'Nairabet' },
    { id: 'sportybet', name: 'SportyBet' },
    { id: 'betking', name: 'BetKing' },
    { id: '1960bet', name: '1960Bet' },
  ];

  const amountValue = useMemo(() => Number(amount), [amount]);
  const isFormValid = !!selectedBookmaker && !!accountId && Number.isFinite(amountValue) && amountValue >= 100;

  const handleFundAccount = async () => {
    if (!isFormValid) {
      Alert.alert('Invalid input', 'Select a bookmaker, enter account ID, and amount from ₦100.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.fundBetting({
        provider: selectedBookmaker,
        accountId,
        amount: amountValue,
      });
      handleBillSuccess(router, result, 'Betting account funded successfully.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Betting Account Funding</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Bookmaker</Text>
          <View style={styles.grid}>
            {bookmakers.map(bookmaker => (
              <TouchableOpacity
                key={bookmaker.id}
                style={[styles.gridButton, selectedBookmaker === bookmaker.id && styles.gridButtonSelected]}
                onPress={() => setSelectedBookmaker(bookmaker.id)}
                disabled={submitting}
              >
                <Text style={[styles.gridButtonText, selectedBookmaker === bookmaker.id && styles.gridButtonTextSelected]}>
                  {bookmaker.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account ID/Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your betting account ID"
            value={accountId}
            onChangeText={setAccountId}
            editable={!submitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            editable={!submitting}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handleFundAccount}
          disabled={!isFormValid || submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Fund Account</Text>}
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

export default BettingScreen;
