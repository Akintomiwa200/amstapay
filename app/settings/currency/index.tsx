// app/settings/currency/index.tsx - Currency Settings Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function CurrencyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
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
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Currency</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.desc, { color: c.textSub }]}>Select your preferred display currency</Text>
        {currencies.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[
              styles.currencyRow,
              selected === currency.code && styles.currencyRowActive,
              { borderColor: selected === currency.code ? c.violet : c.border },
              selected === currency.code && { backgroundColor: c.primaryLight }
            ]}
            onPress={() => setSelected(currency.code)}
          >
            <View style={[styles.currencySymbol, { backgroundColor: c.primaryLight }]}>
              <Text style={[styles.symbolText, { color: c.primary }]}>{currency.symbol}</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={[styles.currencyName, { color: c.text }]}>{currency.name}</Text>
              <Text style={[styles.currencyCode, { color: c.textSub }]}>{currency.code}</Text>
            </View>
            {selected === currency.code && (
              <View style={[styles.checkIcon, { backgroundColor: c.violet }]}>
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
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  desc: { fontSize: 14, marginBottom: 20 },
  currencyRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  currencyRowActive: {},
  currencySymbol: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  symbolText: { fontSize: 18, fontWeight: '700' },
  currencyInfo: { flex: 1 },
  currencyName: { fontSize: 15, fontWeight: '600' },
  currencyCode: { fontSize: 12, marginTop: 2 },
  checkIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
