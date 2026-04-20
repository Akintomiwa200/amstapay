// app/earn-points.tsx - Earn Points Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Star, Zap, Users, CreditCard, Shield, Smartphone, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function EarnPointsScreen() {
  const router = useRouter();

  const ways = [
    { icon: CreditCard, title: 'Make Transactions', desc: 'Earn 1 point for every ₦100 spent', points: '1pt/₦100', color: C.violet },
    { icon: Users, title: 'Refer Friends', desc: 'Earn 100 points per referral', points: '100pts', color: C.blue },
    { icon: Shield, title: 'Complete Profile', desc: 'Verify your identity for bonus points', points: '200pts', color: C.mint },
    { icon: Smartphone, title: 'Bill Payments', desc: 'Pay bills and earn extra points', points: '2x pts', color: C.pink },
    { icon: Star, title: 'Rate the App', desc: 'Leave a review and earn points', points: '50pts', color: C.warning },
    { icon: TrendingUp, title: 'Save with AmstaWealth', desc: 'Earn bonus points on investments', points: '3x pts', color: C.violet },
  ];

  const dailyChallenges = [
    { title: 'Send money to a friend', points: 10, completed: true },
    { title: 'Pay a bill', points: 15, completed: false },
    { title: 'Check your budget', points: 5, completed: false },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earn Points</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>Complete activities to earn reward points</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={18} color={C.violet} />
            <Text style={styles.sectionTitle}>Daily Challenges</Text>
          </View>
          {dailyChallenges.map((ch, i) => (
            <View key={i} style={styles.challengeRow}>
              <View style={[styles.challengeCheck, ch.completed && styles.challengeCheckDone]}>
                {ch.completed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.challengeText, ch.completed && styles.challengeTextDone]}>{ch.title}</Text>
              <Text style={styles.challengePoints}>+{ch.points}pts</Text>
            </View>
          ))}
        </View>

        {/* Ways to Earn */}
        <Text style={styles.sectionTitle}>Ways to Earn</Text>
        {ways.map((way, i) => {
          const Icon = way.icon;
          return (
            <TouchableOpacity key={i} style={styles.wayCard}>
              <View style={[styles.wayIcon, { backgroundColor: `${way.color}15` }]}>
                <Icon size={22} color={way.color} />
              </View>
              <View style={styles.wayInfo}>
                <Text style={styles.wayTitle}>{way.title}</Text>
                <Text style={styles.wayDesc}>{way.desc}</Text>
              </View>
              <View style={styles.wayRight}>
                <Text style={styles.wayPoints}>{way.points}</Text>
                <ChevronRight size={16} color={C.textSub} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { backgroundColor: C.primaryLight, borderRadius: 18, padding: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 14 },
  challengeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  challengeCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: C.border, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  challengeCheckDone: { backgroundColor: C.mint, borderColor: C.mint },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  challengeText: { flex: 1, fontSize: 14, color: C.text },
  challengeTextDone: { textDecorationLine: 'line-through', color: C.textSub },
  challengePoints: { fontSize: 13, fontWeight: '600', color: C.violet },
  wayCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  wayIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  wayInfo: { flex: 1 },
  wayTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  wayDesc: { fontSize: 12, color: C.textSub, marginTop: 2 },
  wayRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wayPoints: { fontSize: 13, fontWeight: '700', color: C.violet },
});
