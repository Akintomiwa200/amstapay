import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Target } from 'lucide-react-native';

const BettingScreen = () => {
  const [selectedBookmaker, setSelectedBookmaker] = useState('');
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const bookmakers = [
    { id: 'bet9ja', name: 'Bet9ja' },
    { id: 'nairabet', name: 'Nairabet' },
    { id: 'sportybet', name: 'SportyBet' },
    { id: 'betking', name: 'BetKing' },
    { id: '1960bet', name: '1960Bet' },
  ];

  const handleFundAccount = () => {
    console.log('Funding betting account:', { selectedBookmaker, accountId, amount });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Betting Account Funding</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Bookmaker Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Bookmaker</Text>
          <View style={styles.grid}>
            {bookmakers.map(bookmaker => (
              <TouchableOpacity
                key={bookmaker.id}
                style={[
                  styles.gridButton,
                  selectedBookmaker === bookmaker.id && styles.gridButtonSelected
                ]}
                onPress={() => setSelectedBookmaker(bookmaker.id)}
              >
                <Text style={[
                  styles.gridButtonText,
                  selectedBookmaker === bookmaker.id && styles.gridButtonTextSelected
                ]}>
                  {bookmaker.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account ID/Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your betting account ID"
            value={accountId}
            onChangeText={setAccountId}
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

        {/* Fund Button */}
        <TouchableOpacity
          style={[styles.button, (!accountId || !amount || !selectedBookmaker) && styles.buttonDisabled]}
          onPress={handleFundAccount}
          disabled={!accountId || !amount || !selectedBookmaker}
        >
          <Text style={styles.buttonText}>Fund Account</Text>
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