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
import { C } from '@/components/dashboardComponent/colors';

export default function ReferralScreen() {
  const router = useRouter();
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
    // Copy to clipboard
    alert('Referral code copied!');
  };

  const referrals = [
    { id: 1, name: 'John Doe', date: 'Mar 15, 2024', status: 'completed', reward: '₦200' },
    { id: 2, name: 'Jane Smith', date: 'Mar 10, 2024', status: 'pending', reward: '₦200' },
    { id: 3, name: 'Mike Johnson', date: 'Mar 5, 2024', status: 'completed', reward: '₦200' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer Friends</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <LinearGradient
          colors={[C.primary, C.violet]}
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
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeValue}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Copy size={18} color={C.violet} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <LinearGradient colors={[C.mint, C.blue, C.violet]} style={styles.shareGradient}>
            <Share2 size={20} color="#fff" />
            <Text style={styles.shareText}>Invite Friends</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color={C.violet} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={24} color={C.violet} />
            <Text style={styles.statNumber}>₦2,400</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral History</Text>
          {referrals.map((ref) => (
            <View key={ref.id} style={styles.referralItem}>
              <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{ref.name}</Text>
                <Text style={styles.referralDate}>{ref.date}</Text>
              </View>
              <View style={styles.referralStatus}>
                <View style={[styles.statusBadge, ref.status === 'completed' ? styles.statusCompleted : styles.statusPending]}>
                  <Text style={styles.statusText}>{ref.status}</Text>
                </View>
                <Text style={styles.referralReward}>{ref.reward}</Text>
              </View>
            </View>
          ))}
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
  content: { paddingHorizontal: 20, paddingTop: 20 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 16, marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 18 },
  codeSection: { marginBottom: 20 },
  codeLabel: { fontSize: 14, fontWeight: '500', color: C.textSub, marginBottom: 8 },
  codeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.primaryLight, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  codeValue: { fontSize: 18, fontWeight: '700', color: C.primary, letterSpacing: 1 },
  copyButton: { padding: 8 },
  shareButton: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  shareGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14 },
  shareText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 },
  statNumber: { fontSize: 22, fontWeight: '800', color: C.primary },
  statLabel: { fontSize: 12, color: C.textSub },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 16 },
  referralItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  referralInfo: { flex: 1 },
  referralName: { fontSize: 15, fontWeight: '500', color: C.text, marginBottom: 2 },
  referralDate: { fontSize: 11, color: C.textSub },
  referralStatus: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusCompleted: { backgroundColor: C.success + '20' },
  statusPending: { backgroundColor: C.warning + '20' },
  statusText: { fontSize: 10, fontWeight: '600', color: C.text },
  referralReward: { fontSize: 14, fontWeight: '600', color: C.violet },
});