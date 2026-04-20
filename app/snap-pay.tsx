// app/snap-pay.tsx - Snap & Pay Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Camera, ScanLine, Zap, ShieldCheck, Clock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function SnapPayScreen() {
  const router = useRouter();
  const [recentSnaps] = useState([
    { id: 1, merchant: 'ShopRight Grocery', amount: '₦12,500', date: 'Today, 2:30 PM', status: 'Completed' },
    { id: 2, merchant: 'QuickMart', amount: '₦3,200', date: 'Yesterday', status: 'Completed' },
    { id: 3, merchant: 'Total Filling Station', amount: '₦8,000', date: 'Mar 15', status: 'Completed' },
  ]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Snap & Pay</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>Point your camera at any bill, invoice, or price tag to pay instantly</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Snap Action */}
        <TouchableOpacity style={styles.snapCard} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.pink]} style={styles.snapGradient}>
            <Camera size={48} color="#fff" />
            <Text style={styles.snapTitle}>Tap to Snap</Text>
            <Text style={styles.snapSub}>Take a photo of any bill or price tag</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          {[
            { icon: Camera, title: 'Snap', desc: 'Take a photo of the bill or price tag' },
            { icon: ScanLine, title: 'Detect', desc: 'AI reads the amount and merchant details' },
            { icon: Zap, title: 'Pay', desc: 'Confirm and pay instantly from your wallet' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <Icon size={20} color={C.violet} />
                </View>
                <View style={styles.stepInfo}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <ShieldCheck size={20} color={C.mint} />
            <Text style={styles.featureText}>Secure</Text>
          </View>
          <View style={styles.featureCard}>
            <Zap size={20} color={C.violet} />
            <Text style={styles.featureText}>Instant</Text>
          </View>
          <View style={styles.featureCard}>
            <Clock size={20} color={C.blue} />
            <Text style={styles.featureText}>24/7</Text>
          </View>
        </View>

        {/* Recent Snaps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Snap Payments</Text>
          {recentSnaps.map((snap) => (
            <View key={snap.id} style={styles.snapItem}>
              <View style={styles.snapItemIcon}>
                <Camera size={18} color={C.violet} />
              </View>
              <View style={styles.snapItemInfo}>
                <Text style={styles.snapItemMerchant}>{snap.merchant}</Text>
                <Text style={styles.snapItemDate}>{snap.date}</Text>
              </View>
              <Text style={styles.snapItemAmount}>{snap.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  snapCard: { marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  snapGradient: { padding: 40, alignItems: 'center', gap: 12 },
  snapTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  snapSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: C.text, marginBottom: 2 },
  stepDesc: { fontSize: 13, color: C.textSub },
  featuresRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  featureCard: { flex: 1, backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 },
  featureText: { fontSize: 12, fontWeight: '600', color: C.text },
  snapItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  snapItemIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  snapItemInfo: { flex: 1 },
  snapItemMerchant: { fontSize: 14, fontWeight: '600', color: C.text },
  snapItemDate: { fontSize: 12, color: C.textSub, marginTop: 2 },
  snapItemAmount: { fontSize: 15, fontWeight: '700', color: C.text },
});
