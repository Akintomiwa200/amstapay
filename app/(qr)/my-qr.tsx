import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Download, Share2 } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getAccountNumber } from '@/lib/user';

export default function MyQRScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const qrCardRef = useRef<View>(null);

  const qrPayload = JSON.stringify({
    type: 'amstapay_receive',
    userId: user?._id,
    name: user?.fullName || user?.accountName,
    accountNumber: getAccountNumber(user),
    bank: 'AmstaPay',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pay me via AmstaPay!\nAccount: ${getAccountNumber(user) || 'N/A'}\nName: ${user?.fullName || 'User'}`,
      });
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    try {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow photo access to save your QR code.');
        return;
      }
      if (!qrCardRef.current) return;
      const uri = await captureRef(qrCardRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved', 'QR code saved to your gallery.');
    } catch {
      Alert.alert('Save failed', 'Could not save QR code. Try sharing instead.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My QR Code</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View
          ref={qrCardRef}
          collapsable={false}
          style={[styles.qrCard, { backgroundColor: c.bg, borderColor: c.border, shadowColor: c.primary }]}
        >
          <Text style={[styles.userName, { color: c.primary }]}>{user?.fullName || user?.accountName || 'Guest User'}</Text>
          <Text style={[styles.userTag, { color: c.textSub }]}>
            @{(user?.fullName || user?.accountName || 'guest').toLowerCase().replace(/\s/g, '')}
          </Text>

          <View style={styles.qrContainer}>
            <QRCode value={qrPayload} size={160} />
          </View>

          <Text style={[styles.instruction, { color: c.textSub }]}>Let others scan this code to pay you</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
            <View style={[styles.actionIcon, { backgroundColor: c.primaryLight }]}>
              <Download size={22} color={c.violet} />
            </View>
            <Text style={[styles.actionText, { color: c.text }]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <View style={[styles.actionIcon, { backgroundColor: c.primaryLight }]}>
              <Share2 size={22} color={c.blue} />
            </View>
            <Text style={[styles.actionText, { color: c.text }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  qrCard: { borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6, width: '100%', marginBottom: 32 },
  userName: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  userTag: { fontSize: 14, marginBottom: 24 },
  qrContainer: { padding: 20, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, marginBottom: 20 },
  instruction: { fontSize: 14, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 24 },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 13, fontWeight: '600' },
});
