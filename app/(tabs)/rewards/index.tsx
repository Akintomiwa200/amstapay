import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Star, Zap, TrendingUp, Award, Clock } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSocket } from '@/context/SocketContext';
import { cashbackService } from '@/services/cashback';
import { formatMoney } from '@/lib/format';

type RewardItem = {
  id: string;
  title: string;
  points: number;
  available: boolean;
};

export default function RewardsScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const router = useRouter();
  const { socket } = useSocket();
  const [totalPoints, setTotalPoints] = useState(0);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRewards = useCallback(async () => {
    try {
      const res = await cashbackService.getAll();
      const data = (res as { data?: { totalPoints?: number; entries?: RewardItem[] } })?.data ?? res;
      const summary = data as { totalPoints?: number; balance?: number; entries?: RewardItem[] };
      setTotalPoints(summary.totalPoints ?? summary.balance ?? 0);

      if (Array.isArray(data)) {
        setRewards(
          (data as { id: string; description?: string; amount?: number; points?: number }[]).map((item, i) => ({
            id: item.id || String(i),
            title: item.description || `₦${(item.amount ?? 0).toLocaleString()} Cashback`,
            points: item.points ?? Math.round((item.amount ?? 0) / 10),
            available: true,
          })),
        );
      } else if (summary.entries?.length) {
        setRewards(summary.entries);
      } else {
        setRewards([
          { id: '1', title: '₦500 Airtime', points: 200, available: true },
          { id: '2', title: '₦1,000 Data Bundle', points: 400, available: true },
          { id: '3', title: formatMoney(2000), points: 800, available: totalPoints >= 800 },
          { id: '4', title: 'Free Transfer (10x)', points: 500, available: totalPoints >= 500 },
        ]);
      }
    } catch {
      setRewards([
        { id: '1', title: '₦500 Airtime', points: 200, available: true },
        { id: '2', title: '₦1,000 Data Bundle', points: 400, available: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRewards();
    }, [loadRewards]),
  );

  useEffect(() => {
    if (!socket) return;
    const onUpdate = (payload: { totalPoints?: number; points?: number }) => {
      setTotalPoints(payload.totalPoints ?? payload.points ?? totalPoints);
      loadRewards();
    };
    socket.on('cashback:update', onUpdate);
    return () => socket.off('cashback:update', onUpdate);
  }, [socket, loadRewards]);

  const handleRedeem = async (reward: RewardItem) => {
    if (totalPoints < reward.points) {
      Alert.alert('Insufficient points', 'Earn more points to redeem this reward.');
      return;
    }
    try {
      await cashbackService.redeem(reward.id, reward.points);
      Alert.alert('Redeemed!', `${reward.title} has been added to your account.`);
      loadRewards();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Redemption failed');
    }
  };

  const achievements = [
    { id: 1, title: 'Welcome Bonus', desc: 'Create your account', points: 50, icon: Star, achieved: totalPoints >= 50 },
    { id: 2, title: 'First Transaction', desc: 'Complete your first transaction', points: 100, icon: Zap, achieved: totalPoints >= 100 },
    { id: 3, title: 'Referral Master', desc: 'Refer 5 friends', points: 500, icon: Gift, achieved: totalPoints >= 500 },
    { id: 4, title: 'Monthly Spender', desc: 'Spend ₦100,000 in a month', points: 300, icon: TrendingUp, achieved: totalPoints >= 300 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rewards</Text>
          <TouchableOpacity onPress={() => router.push('/recent-reward-transaction')}>
            <Clock size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.pointsCard}>
          <Award size={36} color={c.mint} />
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>Available Points</Text>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Redeem Rewards</Text>
        {rewards.map((reward) => (
          <TouchableOpacity
            key={reward.id}
            style={[styles.rewardCard, { backgroundColor: c.bg, borderColor: c.border }, !reward.available && styles.rewardDisabled]}
          >
            <View style={styles.rewardLeft}>
              <Gift size={20} color={reward.available ? c.violet : c.textSub} />
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: !reward.available ? c.textSub : c.text }]}>{reward.title}</Text>
                <Text style={[styles.rewardPoints, { color: c.textSub }]}>{reward.points} points</Text>
              </View>
            </View>
            {reward.available && totalPoints >= reward.points ? (
              <TouchableOpacity style={[styles.redeemBtn, { backgroundColor: c.violet }]} onPress={() => handleRedeem(reward)}>
                <Text style={styles.redeemText}>Redeem</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.insufficientText, { color: c.textSub }]}>
                {!reward.available ? 'Coming Soon' : 'Insufficient'}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { color: c.primary, marginTop: 10 }]}>Earn More Points</Text>
        {achievements.map((ach) => {
          const Icon = ach.icon;
          return (
            <View key={ach.id} style={[styles.achCard, { backgroundColor: c.bg, borderColor: c.border }]}>
              <View style={[styles.achIcon, { backgroundColor: ach.achieved ? `${c.mint}22` : `${c.border}44` }]}>
                <Icon size={20} color={ach.achieved ? c.mint : c.textSub} />
              </View>
              <View style={styles.achInfo}>
                <Text style={[styles.achTitle, { color: c.text }]}>{ach.title}</Text>
                <Text style={[styles.achDesc, { color: c.textSub }]}>{ach.desc}</Text>
              </View>
              <Text style={[styles.achPoints, { color: ach.achieved ? c.mint : c.textSub }]}>
                {ach.achieved ? '✓' : `+${ach.points}`}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  pointsCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 20 },
  pointsInfo: { flex: 1 },
  pointsLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  pointsValue: { fontSize: 32, fontWeight: '800', color: '#fff' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  rewardCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  rewardDisabled: { opacity: 0.6 },
  rewardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 14, fontWeight: '600' },
  rewardPoints: { fontSize: 12, marginTop: 2 },
  redeemBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  redeemText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  insufficientText: { fontSize: 11, fontWeight: '600' },
  achCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10, gap: 12 },
  achIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 14, fontWeight: '600' },
  achDesc: { fontSize: 12, marginTop: 2 },
  achPoints: { fontSize: 14, fontWeight: '700' },
});
