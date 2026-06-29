import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Share } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Share2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { referralService } from '@/services/referral';
import { parseData, parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

export default function InviteScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [totalInvites, setTotalInvites] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pending, setPending] = useState(0);

  const referralLink = referralCode ? `https://amstapay.com/invite?ref=${referralCode}` : '';

  const load = useCallback(async () => {
    try {
      const [codeRes, listRes, statsRes] = await Promise.allSettled([
        referralService.getCode(),
        referralService.getList(),
        referralService.getStats(),
      ]);
      if (codeRes.status === 'fulfilled') {
        setReferralCode(parseData<{ code: string }>(codeRes.value)?.code || user?._id?.slice(-8).toUpperCase() || '');
      }
      if (listRes.status === 'fulfilled') {
        const list = parseList<{ status?: string }>(listRes.value);
        setTotalInvites(list.length);
        setPending(list.filter((r) => r.status === 'pending').length);
      }
      if (statsRes.status === 'fulfilled') {
        setTotalEarned(parseData<{ totalEarned?: number }>(statsRes.value)?.totalEarned ?? 0);
      }
    } catch {
      setReferralCode(user?._id?.slice(-8).toUpperCase() || 'AMSTAPAY');
    }
  }, [user?._id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleShare = async () => {
    await Share.share({
      message: `Join me on AmstaPay! Use my referral code ${referralCode} to get ${formatMoney(500)} bonus.\n${referralLink}`,
    });
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <Text style={styles.subtitle}>Earn {formatMoney(500)} for each friend who joins</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>Your Referral Code</Text>
          <View style={[styles.referralBox, { backgroundColor: c.primaryLight }]}>
            <Text style={[styles.referralCode, { color: c.violet }]}>{referralCode || '...'}</Text>
            <TouchableOpacity style={[styles.copyButton, { backgroundColor: c.violet }]} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.shareButton, { backgroundColor: c.violet }]} onPress={handleShare}>
          <Share2 size={18} color="#fff" />
          <Text style={styles.shareButtonText}>Share Invitation</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>Your Referrals</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Gift size={20} color={c.violet} />
              <Text style={[styles.statNumber, { color: c.text }]}>{totalInvites}</Text>
              <Text style={[styles.statLabel, { color: c.textSub }]}>Total Invites</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: c.mint }]}>{formatMoney(totalEarned)}</Text>
              <Text style={[styles.statLabel, { color: c.textSub }]}>Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: c.text }]}>{pending}</Text>
              <Text style={[styles.statLabel, { color: c.textSub }]}>Pending</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  content: { padding: 20 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  referralBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12 },
  referralCode: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  copyButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  copyButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  shareButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 14, marginBottom: 16 },
  shareButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statNumber: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 12 },
});
