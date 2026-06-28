import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess } from '@/lib/billPayment';

const GamingScreen = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const platforms = [
    { id: 'psn', name: 'PlayStation Network' },
    { id: 'xbox', name: 'Xbox Live' },
    { id: 'steam', name: 'Steam Wallet' },
    { id: 'nintendo', name: 'Nintendo eShop' },
    { id: 'googleplay', name: 'Google Play' },
    { id: 'appstore', name: 'App Store' },
  ];

  const amounts = [
    { value: '500', currency: '₦' },
    { value: '1000', currency: '₦' },
    { value: '2000', currency: '₦' },
    { value: '5000', currency: '₦' },
    { value: '10000', currency: '₦' },
    { value: 'custom', currency: 'Custom' },
  ];

  const amountValue = useMemo(() => {
    if (selectedAmount === 'custom') return Number(customAmount);
    return Number(selectedAmount);
  }, [selectedAmount, customAmount]);

  const isFormValid = !!selectedPlatform && !!gamerTag && Number.isFinite(amountValue) && amountValue >= 100;

  const handleTopUp = async () => {
    if (!isFormValid) {
      Alert.alert('Invalid input', 'Select platform, gamer tag, and amount from ₦100.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.topUpGaming({
        platform: selectedPlatform,
        gamerTag,
        amount: amountValue,
      });
      handleBillSuccess(router, result, 'Gaming wallet topped up successfully.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gaming Credits</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Platform Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Gaming Platform</Text>
          <View style={styles.grid}>
            {platforms.map(platform => (
              <TouchableOpacity
                key={platform.id}
                style={[
                  styles.gridButton,
                  selectedPlatform === platform.id && styles.gridButtonSelected
                ]}
                onPress={() => setSelectedPlatform(platform.id)}
              >
                <Text style={[
                  styles.gridButtonText,
                  selectedPlatform === platform.id && styles.gridButtonTextSelected
                ]}>
                  {platform.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gamer Tag/ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gamer Tag/ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your gamer tag or ID"
            value={gamerTag}
            onChangeText={setGamerTag}
          />
        </View>

        {/* Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Amount</Text>
          <View style={styles.amountGrid}>
            {amounts.map(amount => (
              <TouchableOpacity
                key={amount.value}
                style={[
                  styles.amountButton,
                  selectedAmount === amount.value && styles.amountButtonSelected
                ]}
                onPress={() => setSelectedAmount(amount.value)}
              >
                <Text style={[
                  styles.amountText,
                  selectedAmount === amount.value && styles.amountTextSelected
                ]}>
                  {amount.value === 'custom' ? 'Custom' : `${amount.currency}${amount.value}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount Input */}
        {selectedAmount === 'custom' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Custom Amount (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Top Up Button */}
        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handleTopUp}
          disabled={!isFormValid || submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Top Up Now</Text>}
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
  gridButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', minWidth: 140, alignItems: 'center' },
  gridButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  gridButtonText: { color: '#6B7280', fontWeight: '500', textAlign: 'center' },
  gridButtonTextSelected: { color: '#FFFFFF' },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amountButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', width: '30%', alignItems: 'center' },
  amountButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  amountText: { color: '#6B7280', fontWeight: '500' },
  amountTextSelected: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, fontSize: 16 },
  button: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default GamingScreen;