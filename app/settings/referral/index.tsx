// app/settings/referral.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Share2, Copy, Users, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ReferralScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const referralCode = 'AMSTA2024';
  const referralLink = `https://amstapay.com/ref/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join AmstaPay using my referral code: ${referralCode}\n${referralLink}`,
        title: 'Refer Friends to AmstaPay',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = () => {
    alert('Referral code copied!');
  };

  const referrals = [
    { id: 1, name: 'John Doe', date: 'Mar 15, 2024', status: 'completed', reward: '₦200' },
    { id: 2, name: 'Jane Smith', date: 'Mar 10, 2024', status: 'pending', reward: '₦200' },
    { id: 3, name: 'Mike Johnson', date: 'Mar 5, 2024', status: 'completed', reward: '₦200' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Refer Friends</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <LinearGradient
          colors={[c.primary, c.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Gift size={40} color="#fff" />
          <Text style={styles.heroTitle}>Earn ₦200 per referral</Text>
          <Text style={styles.heroSubtitle}>
            Invite your friends to join AmstaPay and earn rewards when they make their first transaction
          </Text>
        </LinearGradient>

        {/* Referral Code Section */}
        <View style={styles.codeSection}>
          <Text style={[styles.codeLabel, { color: c.textSub }]}>Your Referral Code</Text>
          <View style={[styles.codeContainer, { backgroundColor: c.primaryLight }]}>
            <Text style={[styles.codeValue, { color: c.primary }]}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Copy size={18} color={c.violet} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <LinearGradient colors={[c.mint, c.blue, c.violet]} style={styles.shareGradient}>
            <Share2 size={20} color="#fff" />
            <Text style={styles.shareText}>Invite Friends</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <Users size={24} color={c.violet} />
            <Text style={[styles.statNumber, { color: c.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: c.textSub }]}>Total Referrals</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.primaryLight }]}>
            <Award size={24} color={c.violet} />
            <Text style={[styles.statNumber, { color: c.primary }]}>₦2,400</Text>
            <Text style={[styles.statLabel, { color: c.textSub }]}>Total Earned</Text>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Referral History</Text>
          {referrals.map((ref) => (
            <View key={ref.id} style={[styles.referralItem, { borderBottomColor: c.border }]}>
              <View style={styles.referralInfo}>
                <Text style={[styles.referralName, { color: c.text }]}>{ref.name}</Text>
                <Text style={[styles.referralDate, { color: c.textSub }]}>{ref.date}</Text>
              </View>
              <View style={styles.referralStatus}>
                <View style={[styles.statusBadge, ref.status === 'completed' ? { backgroundColor: c.success + '20' } : { backgroundColor: c.warning + '20' }]}>
                  <Text style={[styles.statusText, { color: c.text }]}>{ref.status}</Text>
                </View>
                <Text style={[styles.referralReward, { color: c.violet }]}>{ref.reward}</Text>
              </View>
            </View>
          ))}
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
  content: { paddingHorizontal: 20, paddingTop: 20 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 16, marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 18 },
  codeSection: { marginBottom: 20 },
  codeLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  codeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  codeValue: { fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  copyButton: { padding: 8 },
  shareButton: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  shareGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14 },
  shareText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 },
  statNumber: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12 },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  referralItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  referralInfo: { flex: 1 },
  referralName: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  referralDate: { fontSize: 11 },
  referralStatus: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusCompleted: {},
  statusPending: {},
  statusText: { fontSize: 10, fontWeight: '600' },
  referralReward: { fontSize: 14, fontWeight: '600' },
});
