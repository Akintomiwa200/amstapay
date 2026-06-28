// app/snap-pay.tsx - Snap & Pay hub (loads real recent snap transfers)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Camera, ScanLine, Zap, ShieldCheck, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { transactionService } from '@/services/transactions';
import type { Transaction } from '@/lib/models';

type SnapItem = {
  id: string;
  merchant: string;
  amount: string;
  date: string;
  status: string;
};

export default function SnapPayScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [recentSnaps, setRecentSnaps] = useState<SnapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService.getAll(1, 20)
      .then((data) => {
        const list = (Array.isArray(data) ? data : (data as { data?: Transaction[] })?.data || []) as Transaction[];
        const snaps = list
          .filter((tx) =>
            tx.description?.toLowerCase().includes('snap') ||
            tx.type === 'qr_payment' ||
            tx.type === 'normal_transfer',
          )
          .slice(0, 5)
          .map((tx) => ({
            id: tx._id,
            merchant: tx.receiverName || tx.sender || 'Transfer',
            amount: `${tx.amount < 0 ? '-' : '+'}₦${Math.abs(tx.amount).toLocaleString()}`,
            date: new Date(tx.createdAt).toLocaleString(),
            status: tx.status,
          }));
        setRecentSnaps(snaps);
      })
      .catch(() => setRecentSnaps([]))
      .finally(() => setLoading(false));
  }, []);

  const openSnap = (mode: 'pay' | 'send' = 'pay') => {
    router.push({ pathname: '/scan-send', params: { mode } });
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Snap & Pay</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>Point your camera at any bill, invoice, or bank slip to pay instantly</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.snapCard} activeOpacity={0.85} onPress={() => openSnap('pay')}>
          <LinearGradient colors={[c.violet, c.pink || c.primary]} style={styles.snapGradient}>
            <Camera size={48} color="#fff" />
            <Text style={styles.snapTitle}>Tap to Snap</Text>
            <Text style={styles.snapSub}>Take a photo — we extract account & amount</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>How It Works</Text>
          {[
            { icon: Camera, title: 'Snap', desc: 'Take a photo of the bill or bank slip' },
            { icon: ScanLine, title: 'Detect', desc: 'OCR reads account number, bank, name & amount' },
            { icon: Zap, title: 'Pay', desc: 'Verify and send instantly from your wallet' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepIcon, { backgroundColor: c.primaryLight }]}>
                  <Icon size={20} color={c.violet} />
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, { color: c.text }]}>{step.title}</Text>
                  <Text style={[styles.stepDesc, { color: c.textSub }]}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.featuresRow}>
          {[
            { icon: ShieldCheck, label: 'Secure', color: c.mint },
            { icon: Zap, label: 'Instant', color: c.violet },
            { icon: Clock, label: '24/7', color: c.blue },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <View key={f.label} style={[styles.featureCard, { backgroundColor: c.primaryLight }]}>
                <Icon size={20} color={f.color} />
                <Text style={[styles.featureText, { color: c.text }]}>{f.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Recent Snap Payments</Text>
          {loading ? (
            <ActivityIndicator color={c.primary} style={{ marginVertical: 20 }} />
          ) : recentSnaps.length === 0 ? (
            <Text style={[styles.emptyText, { color: c.textSub }]}>No snap payments yet. Tap above to start.</Text>
          ) : (
            recentSnaps.map((snap) => (
              <TouchableOpacity
                key={snap.id}
                style={[styles.snapItem, { borderBottomColor: c.border }]}
                onPress={() => router.push(`/transactions/${snap.id}`)}
              >
                <View style={[styles.snapItemIcon, { backgroundColor: c.primaryLight }]}>
                  <Camera size={18} color={c.violet} />
                </View>
                <View style={styles.snapItemInfo}>
                  <Text style={[styles.snapItemMerchant, { color: c.text }]}>{snap.merchant}</Text>
                  <Text style={[styles.snapItemDate, { color: c.textSub }]}>{snap.date}</Text>
                </View>
                <Text style={[styles.snapItemAmount, { color: c.text }]}>{snap.amount}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  snapCard: { marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  snapGradient: { padding: 40, alignItems: 'center', gap: 12 },
  snapTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  snapSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  stepDesc: { fontSize: 13 },
  featuresRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  featureCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 },
  featureText: { fontSize: 12, fontWeight: '600' },
  emptyText: { textAlign: 'center', fontSize: 14, marginVertical: 16 },
  snapItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  snapItemIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  snapItemInfo: { flex: 1 },
  snapItemMerchant: { fontSize: 14, fontWeight: '600' },
  snapItemDate: { fontSize: 12, marginTop: 2 },
  snapItemAmount: { fontSize: 15, fontWeight: '700' },
});
