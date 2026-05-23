import { useAuth } from '@/context/AuthContext';
import { walletService } from '@/services/wallet';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ConfirmTransactionScreen() {
  const { recipient, amount, reference, type } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [pinOrPassword, setPinOrPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState(recipient as string || '');
  const [paymentAmount, setPaymentAmount] = useState(amount as string || '');
  const [loading, setLoading] = useState(false);

  const handleProceedToPay = async () => {
    if (!accountNumber) {
      Alert.alert('Error', 'Please enter account or phone number');
      return;
    }
    if (!paymentAmount) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }
    if (!pinOrPassword) {
      Alert.alert('Error', 'Please enter your PIN or password');
      return;
    }

    try {
      setLoading(true);
      const numericAmount = Number(paymentAmount);

      // Call the real transfer API
      const response = await walletService.transfer({
        recipientAccountNumber: accountNumber,
        amount: numericAmount,
        description: reference as string || '',
      });

      Alert.alert(
        'Success',
        'Transfer completed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transfer failed. Please try again.';
      Alert.alert('Transfer Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
       
        {/* PIN/Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter pin/password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your PIN or password"
            placeholderTextColor="#999"
            secureTextEntry
            value={pinOrPassword}
            onChangeText={setPinOrPassword}
          />
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.inputIcon} />
        </View>

        {/* Account Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter account or phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="Account number or phone number"
            placeholderTextColor="#999"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Proceed Button */}
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPay} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
          )}
        </TouchableOpacity>

        {/* Forgot PIN Link */}
        <TouchableOpacity style={styles.forgotPinButton}>
          <Text style={styles.forgotPinText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 25,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
 input: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingRight: 45,
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 40,
  },
  proceedButton: {
    backgroundColor: '#00C851',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#00C851',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPinButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPinText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  placeholderText: {
    color: '#999',
  },
});