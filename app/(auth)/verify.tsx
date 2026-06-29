import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { authService } from '@/services/auth';
import { useTheme } from '@/context/ThemeContext';

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { theme } = useTheme();
  const c = theme.colors;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length < 4) {
      Alert.alert('Invalid Code', 'Please enter the verification code sent to your email.');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Email is missing. Please sign up again.');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyEmail(String(email), code);
      Alert.alert('Success', 'Your email has been verified!');
      router.replace('/account-success');
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>Verify Your Account</Text>
      <Text style={[styles.subtitle, { color: c.textSub }]}>
        Enter the code sent to <Text style={{ fontWeight: 'bold' }}>{email}</Text>
      </Text>

      <TextInput
        style={[styles.input, { borderColor: c.border, color: c.text }]}
        value={code}
        onChangeText={setCode}
        placeholder="Enter verification code"
        placeholderTextColor={c.textSub}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: c.violet }, loading && { opacity: 0.7 }]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, width: '80%', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  button: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
