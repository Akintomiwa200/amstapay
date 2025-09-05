import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard'; // <-- better than deprecated react-native Clipboard
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext'; // adjust path if needed

const { height } = Dimensions.get('window');

const AddMoneyScreen = () => {
  const router = useRouter();
  const { user } = useAuth(); // 🔑 get user details from context

  // Replace dummy with real data
  const bankDetails = {
    bankName: 'Amstapay',
    accountNumber: user?.amstapayAccountNumber || '----------',
    accountName: user?.fullName || user?.accountName || '----------',
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', `${text} copied to clipboard`);
  };

  const handleConfirmTransfer = () => {
    Alert.alert(
      'Confirm Transfer',
      'Have you sent the money to this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => router.push('/dashboard') },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Send Money to Your Wallet</Text>
        <Text style={styles.subtitle}>
          Use the bank details below to fund your wallet:
        </Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Bank Name:</Text>
          <TouchableOpacity onPress={() => handleCopy(bankDetails.bankName)}>
            <Text style={styles.value}>{bankDetails.bankName}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Account Number:</Text>
          <TouchableOpacity onPress={() => handleCopy(bankDetails.accountNumber)}>
            <Text style={styles.value}>{bankDetails.accountNumber}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Account Name:</Text>
          <TouchableOpacity onPress={() => handleCopy(bankDetails.accountName)}>
            <Text style={styles.value}>{bankDetails.accountName}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirmTransfer}>
          <Check size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>I Have Sent The Money</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: height,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#F97316',
    padding: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddMoneyScreen;
