// app/rewards.tsx - Rewards Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Star, Zap, TrendingUp, Award, ChevronRight, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function RewardsScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const router = useRouter();
  const totalPoints = 1250;

  const rewards = [
    { id: 1, title: 'â‚¦500 Airtime', points: 200, category: 'airtime', available: true },
    { id: 2, title: 'â‚¦1,000 Data Bundle', points: 400, category: 'data', available: true },
    { id: 3, title: 'â‚¦2,000 Shopping Voucher', points: 800, category: 'shopping', available: true },
    { id: 4, title: 'â‚¦5,000 Cash Back', points: 2000, category: 'cashback', available: false },
    { id: 5, title: 'Free Transfer (10x)', points: 500, category: 'transfer', available: true },
  ];

  const achievements = [
    { id: 1, title: 'Welcome Bonus', desc: 'Create your account', points: 50, icon: Star, achieved: true },
    { id: 2, title: 'First Transaction', desc: 'Complete your first transaction', points: 100, icon: Zap, achieved: true },
    { id: 3, title: 'Referral Master', desc: 'Refer 5 friends', points: 500, icon: Gift, achieved: false, progress: '3/5' },
    { id: 4, title: 'Monthly Spender', desc: 'Spend â‚¦100,000 in a month', points: 300, icon: TrendingUp, achieved: false, progress: 'â‚¦65k/â‚¦100k' },
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
            <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Redeem Rewards */}
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Redeem Rewards</Text>
        {rewards.map((reward) => (
          <TouchableOpacity key={reward.id} style={[styles.rewardCard, { backgroundColor: c.bg, borderColor: c.border }, !reward.available && styles.rewardDisabled]}>
            <View style={styles.rewardLeft}>
              <Gift size={20} color={reward.available ? c.violet : c.textSub} />
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: !reward.available ? c.textSub : c.text }]}>{reward.title}</Text>
                <Text style={[styles.rewardPoints, { color: c.textSub }]}>{reward.points} points</Text>
              </View>
            </View>
            {reward.available && totalPoints >= reward.points ? (
              <TouchableOpacity style={[styles.redeemBtn, { backgroundColor: c.violet }]}>
                <Text style={styles.redeemText}>Redeem</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.insufficientText, { color: c.textSub }]}>
                {!reward.available ? 'Coming Soon' : 'Insufficient'}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Achievements */}
        <Text style={[styles.sectionTitle, { color: c.primary, marginTop: 10 }]}>Earn More Points</Text>
        {achievements.map((ach) => {
          const Icon = ach.icon;
          return (
            <View key={ach.id} style={[styles.achieveCard, { backgroundColor: c.primaryLight }]}>
              <View style={[styles.achieveIcon, { backgroundColor: ach.achieved ? c.mint + '20' : c.bg }]}>
                <Icon size={20} color={ach.achieved ? c.mint : c.violet} />
              </View>
              <View style={styles.achieveInfo}>
                <Text style={[styles.achieveTitle, { color: c.text }]}>{ach.title}</Text>
                <Text style={[styles.achieveDesc, { color: c.textSub }]}>{ach.desc}</Text>
                {ach.progress && <Text style={[styles.achieveProgress, { color: c.violet }]}>{ach.progress}</Text>}
              </View>
              <View style={styles.achieveRight}>
                <Text style={[styles.achievePoints, { color: c.violet }]}>+{ach.points}</Text>
                {ach.achieved && (
                  <View style={[styles.earnedBadge, { backgroundColor: c.mint + '20' }]}>
                    <Text style={[styles.earnedText, { color: c.mint }]}>Earned</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  pointsCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 20, gap: 16 },
  pointsInfo: { flex: 1 },
  pointsLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  pointsValue: { fontSize: 32, fontWeight: '800', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  rewardCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
  rewardDisabled: { opacity: 0.6 },
  rewardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 14, fontWeight: '600' },
  rewardPoints: { fontSize: 12, marginTop: 2 },
  redeemBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  redeemText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  insufficientText: { fontSize: 12 },
  achieveCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10 },
  achieveIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  achieveInfo: { flex: 1 },
  achieveTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  achieveDesc: { fontSize: 12 },
  achieveProgress: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  achieveRight: { alignItems: 'flex-end', gap: 4 },
  achievePoints: { fontSize: 14, fontWeight: '700' },
  earnedBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  earnedText: { fontSize: 10, fontWeight: '600' },
});
