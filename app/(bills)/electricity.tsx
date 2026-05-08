import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';

const ElectricityScreen = () => {
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDisco, setSelectedDisco] = useState('');
  const [meterType, setMeterType] = useState('prepaid');
  const router = useRouter();

  const discos = [
    { id: 'ikeja', name: 'IKEDC (Ikeja)' },
    { id: 'eedc', name: 'EEDC (Enugu)' },
    { id: 'phed', name: 'PHED (Port Harcourt)' },
    { id: 'kedco', name: 'KEDCO (Kano)' },
    { id: 'ibedc', name: 'IBEDC (Ibadan)' },
    { id: 'eedc', name: 'EEDC (Benin)' },
  ];

  const handleBuyElectricity = () => {
    console.log('Buying electricity:', { meterNumber, amount, selectedDisco, meterType });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Electricity Bill Payment</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Disco Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Electricity Company</Text>
          <View style={styles.grid}>
            {discos.map(disco => (
              <TouchableOpacity
                key={disco.id}
                style={[
                  styles.gridButton,
                  selectedDisco === disco.id && styles.gridButtonSelected
                ]}
                onPress={() => setSelectedDisco(disco.id)}
              >
                <Text style={[
                  styles.gridButtonText,
                  selectedDisco === disco.id && styles.gridButtonTextSelected
                ]}>
                  {disco.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meter Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meter Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                meterType === 'prepaid' && styles.toggleButtonActive
              ]}
              onPress={() => setMeterType('prepaid')}
            >
              <Text style={[
                styles.toggleButtonText,
                meterType === 'prepaid' && styles.toggleButtonTextActive
              ]}>
                Prepaid
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                meterType === 'postpaid' && styles.toggleButtonActive
              ]}
              onPress={() => setMeterType('postpaid')}
            >
              <Text style={[
                styles.toggleButtonText,
                meterType === 'postpaid' && styles.toggleButtonTextActive
              ]}>
                Postpaid
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meter Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meter Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter meter number"
            value={meterNumber}
            onChangeText={setMeterNumber}
            keyboardType="numeric"
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

        {/* Buy Button */}
        <TouchableOpacity
          style={[styles.button, (!meterNumber || !amount || !selectedDisco) && styles.buttonDisabled]}
          onPress={handleBuyElectricity}
          disabled={!meterNumber || !amount || !selectedDisco}
        >
          <Text style={styles.buttonText}>Buy Electricity</Text>
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
  gridButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', minWidth: 120, alignItems: 'center' },
  gridButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  gridButtonText: { color: '#6B7280', fontWeight: '500' },
  gridButtonTextSelected: { color: '#FFFFFF' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#e5e7eb', borderRadius: 8, padding: 4 },
  toggleButton: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#FFFFFF' },
  toggleButtonText: { color: '#6B7280', fontWeight: '500' },
  toggleButtonTextActive: { color: '#F97316' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, fontSize: 16 },
  button: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default ElectricityScreen;