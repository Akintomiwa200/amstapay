// app/bill-payment.tsx - Bill Payment Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Zap, Tv, Wifi, Smartphone, Shield, GraduationCap, Droplets, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function BillPaymentScreen() {
  const router = useRouter();

  const billCategories = [
    { id: 1, title: 'Electricity', icon: Zap, route: '/electricity', color: C.violet },
    { id: 2, title: 'TV Subscription', icon: Tv, route: '/tv', color: C.blue },
    { id: 3, title: 'Internet', icon: Wifi, route: '/data', color: C.mint },
    { id: 4, title: 'Airtime', icon: Smartphone, route: '/airtime', color: C.pink },
    { id: 5, title: 'Insurance', icon: Shield, route: '/insurance', color: C.violet },
    { id: 6, title: 'School Fees', icon: GraduationCap, route: '/schoolfees', color: C.blue },
    { id: 7, title: 'Water Bill', icon: Droplets, route: '/electricity', color: C.mint },
  ];

  const recentBills = [
    { id: 1, title: 'IKEDC Electricity', amount: '₦15,000', date: 'Mar 12, 2024', status: 'Paid' },
    { id: 2, title: 'DSTV Premium', amount: '₦24,500', date: 'Mar 8, 2024', status: 'Paid' },
    { id: 3, title: 'MTN Data Bundle', amount: '₦5,000', date: 'Mar 5, 2024', status: 'Paid' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bills</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>Quick and easy bill payments</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bill Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Categories</Text>
          {billCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <TouchableOpacity key={cat.id} style={styles.categoryRow} onPress={() => router.push(cat.route as any)}>
                <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}15` }]}>
                  <Icon size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
                <ChevronRight size={18} color={C.textSub} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
          {recentBills.map((bill) => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billInfo}>
                <Text style={styles.billTitle}>{bill.title}</Text>
                <Text style={styles.billDate}>{bill.date}</Text>
              </View>
              <View style={styles.billRight}>
                <Text style={styles.billAmount}>{bill.amount}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{bill.status}</Text>
                </View>
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
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 16 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  categoryIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  categoryTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
  billCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  billInfo: { flex: 1 },
  billTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  billDate: { fontSize: 12, color: C.textSub, marginTop: 2 },
  billRight: { alignItems: 'flex-end' },
  billAmount: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 4 },
  statusBadge: { backgroundColor: C.success + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '600', color: C.success },
});
