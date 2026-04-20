// app/settings/currency/index.tsx - Currency Settings Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function CurrencyScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('NGN');

  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Currency</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.desc}>Select your preferred display currency</Text>
        {currencies.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[styles.currencyRow, selected === currency.code && styles.currencyRowActive]}
            onPress={() => setSelected(currency.code)}
          >
            <View style={styles.currencySymbol}>
              <Text style={styles.symbolText}>{currency.symbol}</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyName}>{currency.name}</Text>
              <Text style={styles.currencyCode}>{currency.code}</Text>
            </View>
            {selected === currency.code && (
              <View style={styles.checkIcon}>
                <Check size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  desc: { fontSize: 14, color: C.textSub, marginBottom: 20 },
  currencyRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 10 },
  currencyRowActive: { borderColor: C.violet, backgroundColor: C.primaryLight },
  currencySymbol: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  symbolText: { fontSize: 18, fontWeight: '700', color: C.primary },
  currencyInfo: { flex: 1 },
  currencyName: { fontSize: 15, fontWeight: '600', color: C.text },
  currencyCode: { fontSize: 12, color: C.textSub, marginTop: 2 },
  checkIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center' },
});
