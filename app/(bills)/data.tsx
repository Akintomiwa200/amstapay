import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess, mapNetwork } from '@/lib/billPayment';

type DataPlan = { id: string; name: string; price: number; validity: string; data: string };

const DataScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const providers = [
    { id: 'mtn', name: 'MTN' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'glo', name: 'Glo' },
    { id: '9mobile', name: '9mobile' },
  ];

  const dataPlans = [
    { id: '1', name: 'Daily', price: 100, validity: '1 day', data: '100MB' },
    { id: '2', name: 'Weekly', price: 500, validity: '7 days', data: '1GB' },
    { id: '3', name: 'Monthly', price: 2000, validity: '30 days', data: '5GB' },
    { id: '4', name: '2Monthly', price: 3500, validity: '60 days', data: '10GB' },
  ];

  const sanitizedPhone = useMemo(() => phoneNumber.replace(/\D/g, ''), [phoneNumber]);
  const isFormValid = !!selectedProvider && sanitizedPhone.length >= 10 && !!selectedPlan;

  const handleBuyData = async () => {
    if (!isFormValid || !selectedPlan) {
      Alert.alert('Invalid input', 'Select a network, phone number, and data plan.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.buyData({
        network: mapNetwork(selectedProvider) as 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE',
        phoneNumber: sanitizedPhone,
        dataPlanId: selectedPlan.id,
        amount: selectedPlan.price,
      });
      handleBillSuccess(router, result, 'Your data purchase was completed.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buy Data</Text>
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
                disabled={submitting}
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
            editable={!submitting}
          />
        </View>

        {/* Data Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Data Plan</Text>
          <View style={styles.plansContainer}>
            {dataPlans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planButton,
                  selectedPlan?.id === plan.id && styles.planButtonSelected
                ]}
                onPress={() => setSelectedPlan(plan)}
                disabled={submitting}
              >
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planData}>{plan.data}</Text>
                <Text style={styles.planValidity}>{plan.validity}</Text>
                <Text style={styles.planPrice}>₦{plan.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handleBuyData}
          disabled={!isFormValid || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Buy Data</Text>
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
  plansContainer: {
    gap: 12,
  },
  planButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
  },
  planButtonSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFEDD5',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  planData: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  planValidity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
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

export default DataScreen;