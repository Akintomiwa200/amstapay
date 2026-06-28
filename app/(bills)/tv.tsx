import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess } from '@/lib/billPayment';

type TvPackage = { id: string; name: string; price: number };

const TvServicesScreen = () => {
  const [subscriberId, setSubscriberId] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<TvPackage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const providers = [
    { id: 'dstv', name: 'DStv' },
    { id: 'gotv', name: 'GOtv' },
    { id: 'startimes', name: 'StarTimes' },
  ];

  const packages: Record<string, TvPackage[]> = {
    dstv: [
      { id: 'p1', name: 'DStv Yanga', price: 1800 },
      { id: 'p2', name: 'DStv Confam', price: 5400 },
      { id: 'p3', name: 'DStv Compact', price: 10500 },
    ],
    gotv: [
      { id: 'g1', name: 'GOtv Lite', price: 900 },
      { id: 'g2', name: 'GOtv Jinja', price: 2100 },
      { id: 'g3', name: 'GOtv Max', price: 4650 },
    ],
    startimes: [
      { id: 's1', name: 'Nova', price: 900 },
      { id: 's2', name: 'Basic', price: 1600 },
      { id: 's3', name: 'Smart', price: 2600 },
    ],
  };

  const isFormValid = !!subscriberId && !!selectedProvider && !!selectedPackage;

  const handleSubscribe = async () => {
    if (!isFormValid || !selectedPackage) {
      Alert.alert('Invalid input', 'Select provider, enter smart card number, and choose a package.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.payTv({
        provider: selectedProvider,
        subscriberId,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
      });
      handleBillSuccess(router, result, 'TV subscription payment completed.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TV Subscription</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select TV Provider</Text>
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

        {/* Subscriber ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Smart Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your smart card number"
            value={subscriberId}
            onChangeText={setSubscriberId}
            keyboardType="numeric"
          />
        </View>

        {/* Packages */}
        {selectedProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Package</Text>
            <View style={styles.packagesContainer}>
              {packages[selectedProvider]?.map(pkg => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageButton,
                    selectedPackage?.id === pkg.id && styles.packageButtonSelected
                  ]}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packagePrice}>₦{pkg.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={!isFormValid || submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Subscribe Now</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Reuse the same styles from previous screens with minor adjustments
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
  packagesContainer: {
    gap: 12,
  },
  packageButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageButtonSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFEDD5',
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  packagePrice: {
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

export default TvServicesScreen;