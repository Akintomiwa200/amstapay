// app/my-qr.tsx - My QR Code Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Download, Share2, QrCode } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function MyQRScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pay me via AmstaPay!\nUsername: ${user?.fullName || user?.name || 'Guest'}`,
      });
    } catch (e) {
      // Handle error
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
        {/* QR Card */}
        <View style={[styles.qrCard, { backgroundColor: c.bg, borderColor: c.border, shadowColor: c.primary }]}>
          <Text style={[styles.userName, { color: c.primary }]}>{user?.fullName || user?.name || 'Guest User'}</Text>
          <Text style={[styles.userTag, { color: c.textSub }]}>@{(user?.fullName || user?.name || 'guest').toLowerCase().replace(/\s/g, '')}</Text>

          {/* QR Placeholder */}
          <View style={styles.qrContainer}>
            <View style={[styles.qrPlaceholder, { borderColor: c.border }]}>
              <QrCode size={120} color={c.primary} />
            </View>
          </View>

          <Text style={[styles.instruction, { color: c.textSub }]}>Let others scan this code to pay you</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
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
  qrPlaceholder: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  instruction: { fontSize: 14, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 24 },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 13, fontWeight: '600' },
});
