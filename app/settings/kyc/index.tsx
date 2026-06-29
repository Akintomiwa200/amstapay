import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Camera, FileCheck, Upload } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/user';

type DocKey = 'idCard' | 'passport' | 'utilityBill';

const DOC_LABELS: Record<DocKey, string> = {
  idCard: 'Government ID',
  passport: 'Passport Photo',
  utilityBill: 'Proof of Address',
};

export default function KYCScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user, refreshUser } = useAuth();
  const [uploading, setUploading] = useState<DocKey | null>(null);
  const [previews, setPreviews] = useState<Partial<Record<DocKey, string>>>({});

  const kycLevel = user?.kycLevel ?? 0;

  const pickAndUpload = async (key: DocKey) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload documents.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setPreviews((prev) => ({ ...prev, [key]: asset.uri }));
    const formData = new FormData();
    formData.append(key, {
      uri: asset.uri,
      name: `${key}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    } as unknown as Blob);

    try {
      setUploading(key);
      await userService.uploadKYCDocuments(formData);
      await refreshUser();
      Alert.alert('Uploaded', `${DOC_LABELS[key]} submitted for review.`);
    } catch (error: unknown) {
      Alert.alert('Upload failed', error instanceof Error ? error.message : 'Could not upload document');
    } finally {
      setUploading(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC Verification</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={[styles.statusCard, { backgroundColor: c.primaryLight, borderColor: c.border }]}>
          <FileCheck size={28} color={c.violet} />
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: c.text }]}>
              {kycLevel >= 2 ? 'Verified Account' : kycLevel === 1 ? 'Basic KYC Complete' : 'Verification Pending'}
            </Text>
            <Text style={[styles.statusSub, { color: c.textSub }]}>
              {kycLevel >= 2
                ? 'Your identity has been verified.'
                : 'Upload documents to increase your limits and unlock full features.'}
            </Text>
          </View>
        </View>

        {(Object.keys(DOC_LABELS) as DocKey[]).map((key) => (
          <View key={key} style={[styles.docCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={styles.docHeader}>
              <Text style={[styles.docTitle, { color: c.text }]}>{DOC_LABELS[key]}</Text>
              {previews[key] ? (
                <Image source={{ uri: previews[key] }} style={styles.preview} />
              ) : (
                <View style={[styles.previewPlaceholder, { backgroundColor: c.primaryLight }]}>
                  <Camera size={24} color={c.violet} />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: c.violet }]}
              onPress={() => pickAndUpload(key)}
              disabled={uploading === key}
            >
              {uploading === key ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Upload size={18} color="#fff" />
                  <Text style={styles.uploadText}>Upload {DOC_LABELS[key]}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { flex: 1 },
  contentInner: { padding: 20, gap: 16, paddingBottom: 40 },
  statusCard: { flexDirection: 'row', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  statusSub: { fontSize: 13, lineHeight: 18 },
  docCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  docHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  preview: { width: 56, height: 56, borderRadius: 8 },
  previewPlaceholder: { width: 56, height: 56, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12 },
  uploadText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
