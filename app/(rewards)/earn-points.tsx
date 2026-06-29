import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Gift, Star, Zap, Users, CreditCard, Shield, Smartphone, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { cashbackService } from '@/services/cashback';
import { parseList } from '@/lib/parse';

const ICONS: Record<string, typeof CreditCard> = {
  transaction: CreditCard,
  referral: Users,
  profile: Shield,
  bills: Smartphone,
  rate: Star,
  invest: TrendingUp,
  default: Gift,
};

export default function EarnPointsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [ways, setWays] = useState<{ icon: typeof CreditCard; title: string; desc: string; points: string; color: string; route?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await cashbackService.getEarnWays();
      const list = parseList<{ title: string; desc?: string; description?: string; points: string; type?: string; route?: string }>(res);
      if (list.length) {
        setWays(list.map((item, i) => ({
          icon: ICONS[item.type || 'default'] || Gift,
          title: item.title,
          desc: item.desc || item.description || '',
          points: item.points,
          color: [c.violet, c.blue, c.mint, c.pink, c.warning][i % 5],
          route: item.route,
        })));
      } else {
        setWays([
          { icon: CreditCard, title: 'Make Transactions', desc: 'Earn 1 point for every ₦100 spent', points: '1pt/₦100', color: c.violet, route: '/send-money' },
          { icon: Users, title: 'Refer Friends', desc: 'Earn 100 points per referral', points: '100pts', color: c.blue, route: '/settings/referral' },
          { icon: Shield, title: 'Complete Profile', desc: 'Verify your identity for bonus points', points: '200pts', color: c.mint, route: '/settings/profile' },
          { icon: Smartphone, title: 'Bill Payments', desc: 'Pay bills and earn extra points', points: '2x pts', color: c.pink, route: '/data' },
          { icon: Star, title: 'Rate the App', desc: 'Leave a review and earn points', points: '50pts', color: c.warning, route: '/settings/rate-us' },
          { icon: TrendingUp, title: 'Save with AmstaWealth', desc: 'Earn bonus points on investments', points: '3x pts', color: c.violet, route: '/amsta-wealth' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [c]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earn Points</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : (
          ways.map((way, i) => {
            const Icon = way.icon;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.wayCard, { backgroundColor: c.bg, borderColor: c.border }]}
                onPress={() => way.route && router.push(way.route as never)}
              >
                <View style={[styles.wayIcon, { backgroundColor: `${way.color}18` }]}>
                  <Icon size={22} color={way.color} />
                </View>
                <View style={styles.wayInfo}>
                  <Text style={[styles.wayTitle, { color: c.text }]}>{way.title}</Text>
                  <Text style={[styles.wayDesc, { color: c.textSub }]}>{way.desc}</Text>
                </View>
                <View style={styles.wayRight}>
                  <Text style={[styles.wayPoints, { color: way.color }]}>{way.points}</Text>
                  <ChevronRight size={16} color={c.textSub} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { padding: 20 },
  wayCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  wayIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  wayInfo: { flex: 1 },
  wayTitle: { fontSize: 14, fontWeight: '600' },
  wayDesc: { fontSize: 12, marginTop: 2 },
  wayRight: { alignItems: 'flex-end', gap: 4 },
  wayPoints: { fontSize: 12, fontWeight: '700' },
});
