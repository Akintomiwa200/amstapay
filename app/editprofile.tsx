import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Save, User, Mail, Phone, MapPin, Calendar } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext'; // adjust path

const EditProfile = () => {
  const router = useRouter();
  const { user, updateProfile, refreshUser, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob,
      });
      Alert.alert('Success', 'Profile updated successfully');
      await refreshUser();
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
          <Save size={20} color="#F97316" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <FormInput label="Full Name" icon={<User size={20} color="#666" />} value={formData.fullName} onChange={text => setFormData({ ...formData, fullName: text })} />
          <FormInput label="Email Address" icon={<Mail size={20} color="#666" />} value={formData.email} onChange={text => setFormData({ ...formData, email: text })} keyboardType="email-address" />
          <FormInput label="Phone Number" icon={<Phone size={20} color="#666" />} value={formData.phone} onChange={text => setFormData({ ...formData, phone: text })} keyboardType="phone-pad" />
          <FormInput label="Address" icon={<MapPin size={20} color="#666" />} value={formData.address} onChange={text => setFormData({ ...formData, address: text })} />
          <FormInput label="Date of Birth" icon={<Calendar size={20} color="#666" />} value={formData.dob} onChange={text => setFormData({ ...formData, dob: text })} placeholder="YYYY-MM-DD" />
        </View>

        <TouchableOpacity style={styles.saveLargeButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveLargeButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const FormInput = ({ label, icon, value, onChange, keyboardType = 'default', placeholder = '' }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      {icon}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

export default EditProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  saveButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 20 },
  profileSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#F97316', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  form: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, paddingHorizontal: 16 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#000' },
  saveLargeButton: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  saveLargeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
