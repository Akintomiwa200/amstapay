import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Globe, Send } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { internationalService } from '@/services/international';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

export default function InternationalTransferScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [countries, setCountries] = useState<{ code: string; name: string; currency: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await internationalService.getCountries();
      const list = parseList<{ code: string; name: string; currency: string }>(res);
      setCountries(list);
      if (list[0]) setSelectedCountry(list[0].code);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleTransfer = async () => {
    const num = Number(amount);
    if (!recipientName || !accountNumber || !num || !selectedCountry) {
      Alert.alert('Error', 'Complete all fields');
      return;
    }
    const country = countries.find((x) => x.code === selectedCountry);
    try {
      setSubmitting(true);
      await internationalService.transfer({
        amount: num,
        currency: country?.currency || currency,
        country: selectedCountry,
        recipientName,
        accountNumber,
      });
      Alert.alert('Success', 'International transfer submitted', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.blue]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>International Transfer</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : (
          <>
            <Text style={[styles.label, { color: c.text }]}>Destination country</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countryScroll}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[styles.countryChip, { borderColor: selectedCountry === country.code ? c.violet : c.border, backgroundColor: selectedCountry === country.code ? c.primaryLight : c.bg }]}
                  onPress={() => setSelectedCountry(country.code)}
                >
                  <Globe size={14} color={c.violet} />
                  <Text style={{ color: c.text, fontSize: 12, fontWeight: '600' }}>{country.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: c.text }]}>Recipient name</Text>
            <TextInput style={[styles.input, { borderColor: c.border, color: c.text }]} value={recipientName} onChangeText={setRecipientName} placeholder="Full name" placeholderTextColor={c.textSub} />

            <Text style={[styles.label, { color: c.text }]}>Account / IBAN</Text>
            <TextInput style={[styles.input, { borderColor: c.border, color: c.text }]} value={accountNumber} onChangeText={setAccountNumber} placeholder="Account number" placeholderTextColor={c.textSub} />

            <Text style={[styles.label, { color: c.text }]}>Amount ({currency})</Text>
            <TextInput style={[styles.input, { borderColor: c.border, color: c.text }]} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor={c.textSub} />

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: c.violet }]} onPress={handleTransfer} disabled={submitting}>
              {submitting ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Send size={18} color="#fff" />
                  <Text style={styles.submitText}>Send {amount ? formatMoney(Number(amount), currency) : ''}</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  countryScroll: { marginBottom: 8 },
  countryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 8 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, marginTop: 16 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
