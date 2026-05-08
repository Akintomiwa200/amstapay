import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

type Provider = {
  id: string;
  name: string;
};

const providers: Provider[] = [
  { id: 'mtn', name: 'MTN' },
  { id: 'airtel', name: 'Airtel' },
  { id: 'glo', name: 'Glo' },
  { id: '9mobile', name: '9mobile' },
];

const quickAmounts = [100, 200, 500, 1000];

const AirtimeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { buyAirtime } = useAuth();

  const sanitizedPhone = useMemo(() => phoneNumber.replace(/\D/g, ''), [phoneNumber]);
  const amountValue = useMemo(() => Number(amount), [amount]);

  const isFormValid =
    !!selectedProvider &&
    sanitizedPhone.length >= 10 &&
    Number.isFinite(amountValue) &&
    amountValue >= 50;

  const handleBuyAirtime = async () => {
    if (!isFormValid) {
      Alert.alert('Invalid input', 'Select a network, enter a valid phone number, and enter amount from ₦50.');
      return;
    }

    try {
      setSubmitting(true);

      const result = await buyAirtime({
        network: selectedProvider,
        phoneNumber: sanitizedPhone,
        amount: amountValue,
      });

      const transactionId =
        result?.transaction?._id ||
        result?.data?.transaction?._id ||
        result?.transactionId ||
        result?.data?.transactionId;

      if (transactionId) {
        router.replace({
          pathname: '/receipt/[transactionId]',
          params: { transactionId },
        });
        return;
      }

      Alert.alert('Airtime Purchase Successful', 'Your airtime purchase was completed.');
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete airtime purchase right now.';
      Alert.alert('Purchase Failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buy Airtime</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Network</Text>
          <View style={styles.providerGrid}>
            {providers.map(provider => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerButton,
                  selectedProvider === provider.id && styles.providerButtonSelected,
                ]}
                onPress={() => setSelectedProvider(provider.id)}
                disabled={submitting}
              >
                <Text
                  style={[
                    styles.providerText,
                    selectedProvider === provider.id && styles.providerTextSelected,
                  ]}
                >
                  {provider.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            editable={!submitting}
            maxLength={15}
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

          <View style={styles.quickAmounts}>
            {quickAmounts.map(quickAmount => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
                disabled={submitting}
              >
                <Text style={styles.quickAmountText}>₦{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handleBuyAirtime}
          disabled={!isFormValid || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Buy Airtime</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
    alignItems: 'center',
  },
  providerButtonSelected: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  providerText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  providerTextSelected: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickAmountText: {
    color: '#6B7280',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AirtimeScreen;
