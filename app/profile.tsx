// app/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Save } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext'; // adjust path

const Profile = () => {
  const router = useRouter();
  const { user, updateProfile, refreshUser, loading, apiRequest } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '',
      });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar, // update avatar if changed
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

 const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert('Permission denied', 'Please allow access to your photos');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    // Immediately update UI for preview
    setAvatar(uri);
    await uploadImage(uri);
  }
};


const uploadImage = async (uri: string) => {
  try {
    setUploading(true);

    // Create FormData
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri,
      name: filename || `avatar_${Date.now()}.jpg`,
      type,
    } as any);

    // Make API call
    const data = await apiRequest('/users/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (data.user && data.user.passportPhoto) {
      setAvatar(data.user.passportPhoto); // update local state
      Alert.alert('Success', 'Profile image updated!');
      await refreshUser();
    } else {
      Alert.alert('Error', 'No avatar returned from server');
    }
  } catch (err: any) {
    console.error(err);
    Alert.alert('Error', err.message || 'Failed to upload image');
  } finally {
    setUploading(false);
  }
};

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Information</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
          <Save size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={styles.profilePhoto}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {uploading && <Text style={{ marginTop: 8 }}>Uploading...</Text>}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FormInput
            label="Full Name"
            value={formData.fullName}
            onChange={text => setFormData({ ...formData, fullName: text })}
          />
          <FormInput
            label="Email Address"
            value={formData.email}
            onChange={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />
          <FormInput
            label="Phone Number"
            value={formData.phone}
            onChange={text => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveLargeButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveLargeButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const FormInput = ({ label, value, onChange, keyboardType = 'default' }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
  </View>
);

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000000' },
  saveButton: { padding: 8 },
  scrollView: { flex: 1 },
  photoSection: { alignItems: 'center', padding: 24 },
  photoContainer: { position: 'relative' },
  profilePhoto: { width: 120, height: 120, borderRadius: 60 },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF8C00',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { paddingHorizontal: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#000000', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  saveLargeButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
  },
  saveLargeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
