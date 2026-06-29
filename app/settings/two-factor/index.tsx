import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Shield, Mail, Lock, CheckCircle } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth';
import { storage } from '@/lib/storage';

export default function TwoFactorScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'status' | 'verify' | 'disable'>('status');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.get2FAStatus();
      const data = (res as { data?: { enabled: boolean } })?.data ?? res;
      const isEnabled = (data as { enabled?: boolean })?.enabled ?? false;
      setEnabled(isEnabled);
      await storage.set('twoFactorEnabled', isEnabled);
    } catch {
      const cached = await storage.get<boolean>('twoFactorEnabled');
      setEnabled(!!cached);
    } finally {
      setLoading(false);
      setStep('status');
      setCode('');
      setPin('');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStatus();
    }, [loadStatus]),
  );

  const handleEnable = async () => {
    try {
      setSubmitting(true);
      await authService.enable2FA();
      setStep('verify');
      Alert.alert(
        'Verification code sent',
        `Enter the 6-digit code sent to ${user?.email || 'your registered email'}.`,
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to start 2FA setup');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (code.length < 4) {
      Alert.alert('Invalid code', 'Enter the verification code from your email or SMS.');
      return;
    }
    try {
      setSubmitting(true);
      await authService.verify2FA(code);
      setEnabled(true);
      await storage.set('twoFactorEnabled', true);
      setStep('status');
      Alert.alert('Success', 'Two-factor authentication is now enabled.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid verification code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable = async () => {
    if (pin.length !== 4) {
      Alert.alert('PIN required', 'Enter your 4-digit transaction PIN to disable 2FA.');
      return;
    }
    try {
      setSubmitting(true);
      await authService.disable2FA(pin);
      setEnabled(false);
      await storage.set('twoFactorEnabled', false);
      setStep('status');
      Alert.alert('Disabled', 'Two-factor authentication has been turned off.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to disable 2FA');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Two-Factor Auth</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.heroCard, { backgroundColor: enabled ? `${c.mint}18` : c.primaryLight }]}>
          <Shield size={40} color={enabled ? c.mint : c.violet} />
          <Text style={[styles.heroTitle, { color: c.text }]}>
            {enabled ? '2FA is active' : 'Protect your account'}
          </Text>
          <Text style={[styles.heroSub, { color: c.textSub }]}>
            {enabled
              ? 'A verification code is required when signing in on new devices.'
              : 'Add an extra layer of security with email verification on login.'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : step === 'status' ? (
          <>
            <View style={[styles.methodCard, { borderColor: c.border }]}>
              <Mail size={20} color={c.violet} />
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, { color: c.text }]}>Email verification</Text>
                <Text style={[styles.methodSub, { color: c.textSub }]}>{user?.email || 'Your registered email'}</Text>
              </View>
              {enabled && <CheckCircle size={20} color={c.mint} />}
            </View>

            {!enabled ? (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: c.violet }]}
                onPress={handleEnable}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Enable 2FA</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: c.error }]}
                onPress={() => setStep('disable')}
              >
                <Text style={[styles.secondaryBtnText, { color: c.error }]}>Disable 2FA</Text>
              </TouchableOpacity>
            )}
          </>
        ) : step === 'verify' ? (
          <>
            <Text style={[styles.label, { color: c.text }]}>Verification code</Text>
            <TextInput
              style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.bg }]}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="Enter 6-digit code"
              placeholderTextColor={c.textSub}
            />
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: c.violet }]}
              onPress={handleVerify}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify & Enable</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('status')} style={styles.cancelLink}>
              <Text style={{ color: c.textSub }}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={[styles.warningBox, { backgroundColor: `${c.warning}18` }]}>
              <Lock size={18} color={c.warning} />
              <Text style={[styles.warningText, { color: c.text }]}>
                Enter your transaction PIN to confirm disabling 2FA.
              </Text>
            </View>
            <Text style={[styles.label, { color: c.text }]}>Transaction PIN</Text>
            <TextInput
              style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.bg }]}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              placeholder="••••"
              placeholderTextColor={c.textSub}
            />
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: c.error }]}
              onPress={handleDisable}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Disable 2FA</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('status')} style={styles.cancelLink}>
              <Text style={{ color: c.textSub }}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 20, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  heroSub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 24 },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '600' },
  methodSub: { fontSize: 12, marginTop: 2 },
  primaryBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5 },
  secondaryBtnText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, letterSpacing: 4, marginBottom: 20 },
  cancelLink: { alignItems: 'center', paddingVertical: 12 },
  warningBox: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  warningText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
