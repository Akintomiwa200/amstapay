import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Share2, Copy, Users, Award } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { referralService, type ReferralEntry } from '@/services/referral';
import { parseList, parseData } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

export default function ReferralScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const referralLink = referralCode ? `https://amstapay.com/ref/${referralCode}` : '';

  const load = useCallback(async () => {
    try {
      const [codeRes, listRes, statsRes] = await Promise.allSettled([
        referralService.getCode(),
        referralService.getList(),
        referralService.getStats(),
      ]);

      if (codeRes.status === 'fulfilled') {
        const data = parseData<{ code: string }>(codeRes.value);
        setReferralCode(data?.code || user?._id?.slice(-8).toUpperCase() || 'AMSTAPAY');
      } else {
        setReferralCode(user?._id?.slice(-8).toUpperCase() || 'AMSTAPAY');
      }

      if (listRes.status === 'fulfilled') {
        setReferrals(parseList<ReferralEntry>(listRes.value));
      }

      if (statsRes.status === 'fulfilled') {
        const stats = parseData<{ totalEarned?: number }>(statsRes.value);
        setTotalEarned(stats?.totalEarned ?? 0);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleShare = async () => {
    await Share.share({
      message: `Join AmstaPay using my referral code: ${referralCode}\n${referralLink}`,
      title: 'Refer Friends to AmstaPay',
    });
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Refer & Earn</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={c.violet} />}
      >
        <LinearGradient colors={[c.primary, c.violet]} style={styles.heroCard}>
          <Gift size={40} color="#fff" />
          <Text style={styles.heroTitle}>Earn {formatMoney(200)} per referral</Text>
          <Text style={styles.heroSub}>Invite friends and earn when they complete their first transaction</Text>
          <Text style={styles.earnedLabel}>Total earned</Text>
          <Text style={styles.earnedValue}>{formatMoney(totalEarned)}</Text>
        </LinearGradient>

        <View style={[styles.codeCard, { backgroundColor: c.bg, borderColor: c.border }]}>
          <Text style={[styles.codeLabel, { color: c.textSub }]}>Your Referral Code</Text>
          {loading ? (
            <ActivityIndicator color={c.violet} style={{ marginVertical: 12 }} />
          ) : (
            <Text style={[styles.codeValue, { color: c.primary }]}>{referralCode}</Text>
          )}
          <View style={styles.codeActions}>
            <TouchableOpacity style={[styles.codeBtn, { backgroundColor: c.primaryLight }]} onPress={handleCopy}>
              <Copy size={18} color={c.violet} />
              <Text style={[styles.codeBtnText, { color: c.violet }]}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.codeBtn, { backgroundColor: c.violet }]} onPress={handleShare}>
              <Share2 size={18} color="#fff" />
              <Text style={[styles.codeBtnText, { color: '#fff' }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: c.primaryLight }]}>
            <Users size={22} color={c.violet} />
            <Text style={[styles.statNum, { color: c.text }]}>{referrals.length}</Text>
            <Text style={[styles.statLabel, { color: c.textSub }]}>Referrals</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: c.primaryLight }]}>
            <Award size={22} color={c.mint} />
            <Text style={[styles.statNum, { color: c.text }]}>{referrals.filter((r) => r.status === 'completed').length}</Text>
            <Text style={[styles.statLabel, { color: c.textSub }]}>Completed</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: c.primary }]}>Referral History</Text>
        {referrals.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No referrals yet. Share your code to get started!</Text>
        ) : (
          referrals.map((ref) => (
            <View key={ref._id || ref.id || ref.name} style={[styles.referralItem, { borderBottomColor: c.border }]}>
              <View style={styles.referralInfo}>
                <Text style={[styles.referralName, { color: c.text }]}>{ref.referredName || ref.name}</Text>
                <Text style={[styles.referralDate, { color: c.textSub }]}>
                  {ref.date || (ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : '')}
                </Text>
              </View>
              <View style={styles.referralStatus}>
                <View style={[styles.statusBadge, { backgroundColor: ref.status === 'completed' ? `${c.mint}22` : `${c.warning}22` }]}>
                  <Text style={{ color: ref.status === 'completed' ? c.mint : c.warning, fontSize: 10, fontWeight: '700' }}>{ref.status}</Text>
                </View>
                <Text style={[styles.referralReward, { color: c.violet }]}>{formatMoney(ref.reward ?? 200)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 12, marginBottom: 8 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 19 },
  earnedLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 16 },
  earnedValue: { fontSize: 24, fontWeight: '800', color: '#fff' },
  codeCard: { borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 20, alignItems: 'center' },
  codeLabel: { fontSize: 13, marginBottom: 8 },
  codeValue: { fontSize: 28, fontWeight: '800', letterSpacing: 2, marginBottom: 16 },
  codeActions: { flexDirection: 'row', gap: 12 },
  codeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  codeBtnText: { fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, borderRadius: 14, padding: 16, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  empty: { fontSize: 13, marginBottom: 32 },
  referralItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  referralInfo: { flex: 1 },
  referralName: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  referralDate: { fontSize: 11 },
  referralStatus: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  referralReward: { fontSize: 14, fontWeight: '600' },
});
