// app/settings/change-pin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Shield, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function ChangePin() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleChangePin = () => {
    if (newPin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }
    Alert.alert('Success', 'PIN changed successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const renderPinInput = (value: string, onChange: (v: string) => void, placeholder: string) => (
    <View style={styles.pinContainer}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[styles.pinBox, value.length > i && styles.pinBoxFilled]}>
          {value.length > i && (
            <View style={styles.pinDot} />
          )}
        </View>
      ))}
      <TextInput
        style={styles.hiddenInput}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        maxLength={4}
        autoFocus
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change PIN</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield size={48} color={C.violet} />
        </View>

        <Text style={styles.title}>
          {step === 1 ? 'Enter Current PIN' : 'Create New PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1 
            ? 'Please enter your current 4-digit transaction PIN' 
            : 'Create a new 4-digit PIN for transactions'}
        </Text>

        {step === 1 && renderPinInput(oldPin, setOldPin, 'Current PIN')}
        {step === 2 && renderPinInput(newPin, setNewPin, 'New PIN')}
        {step === 3 && renderPinInput(confirmPin, setConfirmPin, 'Confirm PIN')}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (step === 1 && oldPin.length === 4) setStep(2);
            else if (step === 2 && newPin.length === 4) setStep(3);
            else if (step === 3) handleChangePin();
          }}
        >
          <LinearGradient colors={[C.mint, C.blue, C.violet]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>
              {step === 3 ? 'Confirm' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: C.primary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.textSub, textAlign: 'center', marginBottom: 40 },
  pinContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40, position: 'relative' },
  pinBox: { width: 60, height: 60, borderRadius: 12, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  pinBoxFilled: { borderColor: C.violet, backgroundColor: C.primaryLight },
  pinDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.violet },
  hiddenInput: { position: 'absolute', opacity: 0, width: '100%', height: '100%' },
  button: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});