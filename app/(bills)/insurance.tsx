import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';

const InsuranceScreen = () => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const providers = [
    { id: 'leadway', name: 'Leadway Assurance' },
    { id: 'aiico', name: 'AIICO Insurance' },
    { id: 'axamansard', name: 'AXA Mansard' },
    { id: 'cornerstone', name: 'Cornerstone' },
    { id: 'custodian', name: 'Custodian Life' },
    { id: 'mutual', name: 'Mutual Benefits' },
  ];

  const handlePayPremium = () => {
    console.log('Paying insurance premium:', { selectedProvider, policyNumber, amount });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insurance Premium Payment</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Insurance Provider</Text>
          <View style={styles.grid}>
            {providers.map(provider => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.gridButton,
                  selectedProvider === provider.id && styles.gridButtonSelected
                ]}
                onPress={() => setSelectedProvider(provider.id)}
              >
                <Text style={[
                  styles.gridButtonText,
                  selectedProvider === provider.id && styles.gridButtonTextSelected
                ]}>
                  {provider.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Policy Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Policy Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your policy number"
            value={policyNumber}
            onChangeText={setPolicyNumber}
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

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.button, (!policyNumber || !amount || !selectedProvider) && styles.buttonDisabled]}
          onPress={handlePayPremium}
          disabled={!policyNumber || !amount || !selectedProvider}
        >
          <Text style={styles.buttonText}>Pay Premium</Text>
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
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, fontSize: 16 },
  button: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default InsuranceScreen;