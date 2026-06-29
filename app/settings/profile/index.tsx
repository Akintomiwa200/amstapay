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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { userService } from '@/services/user';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileSettings() {
  const router = useRouter();
  const { user, updateProfile, refreshUser } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.passportPhoto || null);
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

  const handlePickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to change your avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setAvatarUri(asset.uri);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        name: 'avatar.jpg',
        type: asset.mimeType || 'image/jpeg',
      } as unknown as Blob);
      await userService.uploadAvatar(formData);
      await refreshUser();
      Alert.alert('Success', 'Profile photo updated');
    } catch (error: unknown) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

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
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Profile Information</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={c.violet} />
            ) : (
              <Save size={22} color={c.violet} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarContainer, { backgroundColor: getAvatarColor(form.fullName || 'Guest') }]}>
              <Text style={styles.avatarText}>{getInitials(form.fullName || 'Guest')}</Text>
            </View>
          )}
          <TouchableOpacity style={[styles.avatarBtn, { backgroundColor: c.violet, borderColor: c.bg }]} onPress={handlePickAvatar}>
            <Camera size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickAvatar}>
            <Text style={[styles.avatarLabel, { color: c.violet }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: c.primary }]}>Full Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: c.inputBg, borderColor: c.border }]}>
              <User size={18} color={c.violet} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                value={form.fullName}
                onChangeText={(v) => setForm({ ...form, fullName: v })}
                placeholder="Enter your full name"
                placeholderTextColor={c.textSub}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: c.primary }]}>Email Address</Text>
            <View style={[styles.inputWrapper, { backgroundColor: c.inputBg, borderColor: c.border }]}>
              <Mail size={18} color={c.violet} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                placeholder="Enter your email"
                placeholderTextColor={c.textSub}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: c.primary }]}>Phone Number</Text>
            <View style={[styles.inputWrapper, { backgroundColor: c.inputBg, borderColor: c.border }]}>
              <Phone size={18} color={c.violet} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                value={form.phone}
                onChangeText={(v) => setForm({ ...form, phone: v })}
                placeholder="Enter your phone number"
                placeholderTextColor={c.textSub}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: c.primary }]}>Address</Text>
            <View style={[styles.inputWrapper, styles.inputWrapperMultiline, { backgroundColor: c.inputBg, borderColor: c.border }]}>
              <MapPin size={18} color={c.violet} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputMultiline, { color: c.text }]}
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                placeholder="Enter your address"
                placeholderTextColor={c.textSub}
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
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  saveBtn: { padding: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 32, position: 'relative' },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  avatarBtn: { position: 'absolute', top: 70, right: '35%', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  avatarLabel: { fontSize: 14, fontWeight: '500' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1 },
  inputWrapperMultiline: { alignItems: 'flex-start', paddingVertical: 14 },
  inputIcon: { marginTop: 2 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
});
