// app/settings/change-password/index.tsx - Change Password Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Eye, EyeOff, Lock, Shield, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { emailService } from '@/services/email';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword, user } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      if (user?.email) {
        emailService.send(user.email, 'password-changed', {
          name: user.fullName || 'User',
          time: new Date().toLocaleString(),
        });
      }
      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { text: 'At least 8 characters', met: newPassword.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { text: 'Contains a number', met: /[0-9]/.test(newPassword) },
    { text: 'Contains special character', met: /[!@#$%^&*]/.test(newPassword) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconSection}>
          <View style={[styles.iconCircle, { backgroundColor: c.primaryLight }]}>
            <Lock size={32} color={c.violet} />
          </View>
          <Text style={[styles.desc, { color: c.textSub }]}>Enter your current password and create a new strong password</Text>
        </View>

        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Current Password</Text>
          <View style={[styles.passwordInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <TextInput
              style={[styles.textInput, { color: c.text }]}
              placeholder="Enter current password"
              placeholderTextColor={c.textSub}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
              {showCurrent ? <EyeOff size={20} color={c.textSub} /> : <Eye size={20} color={c.textSub} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>New Password</Text>
          <View style={[styles.passwordInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <TextInput
              style={[styles.textInput, { color: c.text }]}
              placeholder="Enter new password"
              placeholderTextColor={c.textSub}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              {showNew ? <EyeOff size={20} color={c.textSub} /> : <Eye size={20} color={c.textSub} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Requirements */}
        {newPassword.length > 0 && (
          <View style={[styles.requirements, { backgroundColor: c.primaryLight }]}>
            {requirements.map((req, i) => (
              <View key={i} style={styles.reqRow}>
                <View style={[styles.reqDot, { backgroundColor: req.met ? c.mint : c.border }]} />
                <Text style={[styles.reqText, req.met && { color: c.mint }, !req.met && { color: c.textSub }]}>{req.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Confirm New Password</Text>
          <View style={[styles.passwordInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <TextInput
              style={[styles.textInput, { color: c.text }]}
              placeholder="Confirm new password"
              placeholderTextColor={c.textSub}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={20} color={c.textSub} /> : <Eye size={20} color={c.textSub} />}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleChange} activeOpacity={0.85} disabled={loading}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.submitGradient}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.submitText}>Update Password</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  iconSection: { alignItems: 'center', marginBottom: 28 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  desc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  passwordInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingRight: 8 },
  textInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 16, fontSize: 15 },
  eyeBtn: { padding: 8 },
  requirements: { borderRadius: 14, padding: 16, marginBottom: 20, gap: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqDot: { width: 8, height: 8, borderRadius: 4 },
  reqText: { fontSize: 13 },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  submitBtn: { borderRadius: 16, overflow: 'hidden' },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
