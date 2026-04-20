// app/settings/change-password/index.tsx - Change Password Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Eye, EyeOff, Lock, Shield, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = () => {
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
    Alert.alert('Success', 'Password changed successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const requirements = [
    { text: 'At least 8 characters', met: newPassword.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { text: 'Contains a number', met: /[0-9]/.test(newPassword) },
    { text: 'Contains special character', met: /[!@#$%^&*]/.test(newPassword) },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <Lock size={32} color={C.violet} />
          </View>
          <Text style={styles.desc}>Enter your current password and create a new strong password</Text>
        </View>

        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter current password"
              placeholderTextColor={C.textSub}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
              {showCurrent ? <EyeOff size={20} color={C.textSub} /> : <Eye size={20} color={C.textSub} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new password"
              placeholderTextColor={C.textSub}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              {showNew ? <EyeOff size={20} color={C.textSub} /> : <Eye size={20} color={C.textSub} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Requirements */}
        {newPassword.length > 0 && (
          <View style={styles.requirements}>
            {requirements.map((req, i) => (
              <View key={i} style={styles.reqRow}>
                <View style={[styles.reqDot, req.met && styles.reqDotMet]} />
                <Text style={[styles.reqText, req.met && styles.reqTextMet]}>{req.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm new password"
              placeholderTextColor={C.textSub}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={20} color={C.textSub} /> : <Eye size={20} color={C.textSub} />}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleChange} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.submitGradient}>
            <Text style={styles.submitText}>Update Password</Text>
            <ArrowRight size={20} color="#fff" />
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  iconSection: { alignItems: 'center', marginBottom: 28 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  desc: { fontSize: 14, color: C.textSub, textAlign: 'center', lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  passwordInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingRight: 8 },
  textInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 16, fontSize: 15, color: C.text },
  eyeBtn: { padding: 8 },
  requirements: { backgroundColor: C.primaryLight, borderRadius: 14, padding: 16, marginBottom: 20, gap: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  reqDotMet: { backgroundColor: C.mint },
  reqText: { fontSize: 13, color: C.textSub },
  reqTextMet: { color: C.mint },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  submitBtn: { borderRadius: 16, overflow: 'hidden' },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
