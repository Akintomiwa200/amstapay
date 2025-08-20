import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';

const AirtimeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const router = useRouter();

  const providers = [
    { id: 'mtn', name: 'MTN' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'glo', name: 'Glo' },
    { id: '9mobile', name: '9mobile' },
  ];

  const quickAmounts = [100, 200, 500, 1000];

  const handleBuyAirtime = () => {
    // Handle airtime purchase logic
    console.log('Buying airtime:', { phoneNumber, amount, selectedProvider });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buy Airtime</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Network</Text>
          <View style={styles.providerGrid}>
            {providers.map(provider => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerButton,
                  selectedProvider === provider.id && styles.providerButtonSelected
                ]}
                onPress={() => setSelectedProvider(provider.id)}
              >
                <Text style={[
                  styles.providerText,
                  selectedProvider === provider.id && styles.providerTextSelected
                ]}>
                  {provider.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
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
          
          <View style={styles.quickAmounts}>
            {quickAmounts.map(quickAmount => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>₦{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          style={[styles.button, (!phoneNumber || !amount || !selectedProvider) && styles.buttonDisabled]}
          onPress={handleBuyAirtime}
          disabled={!phoneNumber || !amount || !selectedProvider}
        >
          <Text style={styles.buttonText}>Buy Airtime</Text>
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