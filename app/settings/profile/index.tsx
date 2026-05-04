// app/settings/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { C } from '@/components/dashboardComponent/colors';

export default function ProfileSettings() {
  const router = useRouter();
  const { user, updateProfile, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: user.residentialAddress || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        residentialAddress: form.address,
      });
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Information</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={C.violet} />
            ) : (
              <Save size={22} color={C.violet} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={[styles.avatarContainer, { backgroundColor: getAvatarColor(form.fullName || 'Guest') }]}>
            <Text style={styles.avatarText}>{getInitials(form.fullName || 'Guest')}</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Camera size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.avatarLabel}>Change Photo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color={C.violet} />
              <TextInput
                style={styles.input}
                value={form.fullName}
                onChangeText={(v) => setForm({ ...form, fullName: v })}
                placeholder="Enter your full name"
                placeholderTextColor={C.textSub}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={C.violet} />
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                placeholder="Enter your email"
                placeholderTextColor={C.textSub}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color={C.violet} />
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => setForm({ ...form, phone: v })}
                placeholder="Enter your phone number"
                placeholderTextColor={C.textSub}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.inputWrapper, styles.inputWrapperMultiline]}>
              <MapPin size={18} color={C.violet} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                placeholder="Enter your address"
                placeholderTextColor={C.textSub}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  saveBtn: { padding: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 32, position: 'relative' },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  avatarBtn: { position: 'absolute', top: 70, right: '35%', backgroundColor: C.violet, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.bg },
  avatarLabel: { fontSize: 14, color: C.violet, fontWeight: '500' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: C.border },
  inputWrapperMultiline: { alignItems: 'flex-start', paddingVertical: 14 },
  inputIcon: { marginTop: 2 },
  input: { flex: 1, fontSize: 15, color: C.text, paddingVertical: 0 },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
});
