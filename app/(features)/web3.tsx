import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Wallet, ArrowUpRight, RefreshCw } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { web3Service } from '@/services/web3';
import { parseList } from '@/lib/parse';

type CryptoBalance = { currency: string; balance: number; usdValue?: number };

export default function Web3Screen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [balances, setBalances] = useState<CryptoBalance[]>([]);
  const [address, setAddress] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const [walletRes, balRes] = await Promise.allSettled([
        web3Service.getWallet(),
        web3Service.getBalances(),
      ]);
      if (walletRes.status === 'fulfilled') {
        const w = (walletRes.value as { data?: { address?: string }; address?: string });
        setAddress(w?.data?.address || w?.address || '');
      }
      if (balRes.status === 'fulfilled') {
        setBalances(parseList<CryptoBalance>(balRes.value));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleSend = async () => {
    const amount = Number(sendAmount);
    if (!sendTo || !amount) {
      Alert.alert('Error', 'Enter recipient address and amount');
      return;
    }
    try {
      setSending(true);
      await web3Service.send({ to: sendTo, amount, currency: selectedCurrency });
      Alert.alert('Success', 'Crypto transfer submitted');
      setSendTo('');
      setSendAmount('');
      load();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Transfer failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={['#8b5cf6', c.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Web3 Wallet</Text>
          <TouchableOpacity onPress={load}><RefreshCw size={20} color="#fff" /></TouchableOpacity>
        </View>
        {address ? <Text style={styles.address}>{address.slice(0, 8)}...{address.slice(-6)}</Text> : null}
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : (
          <>
            <Text style={[styles.section, { color: c.primary }]}>Balances</Text>
            {balances.length === 0 ? (
              <Text style={[styles.empty, { color: c.textSub }]}>No crypto balances yet. Deposit to get started.</Text>
            ) : (
              balances.map((b) => (
                <TouchableOpacity
                  key={b.currency}
                  style={[styles.balCard, { borderColor: c.border, backgroundColor: selectedCurrency === b.currency ? c.primaryLight : c.bg }]}
                  onPress={() => setSelectedCurrency(b.currency)}
                >
                  <Wallet size={20} color={c.violet} />
                  <Text style={[styles.balCurrency, { color: c.text }]}>{b.currency}</Text>
                  <Text style={[styles.balAmount, { color: c.text }]}>{b.balance}</Text>
                </TouchableOpacity>
              ))
            )}

            <Text style={[styles.section, { color: c.primary }]}>Send Crypto</Text>
            <TextInput style={[styles.input, { borderColor: c.border, color: c.text }]} placeholder="Recipient address" placeholderTextColor={c.textSub} value={sendTo} onChangeText={setSendTo} />
            <TextInput style={[styles.input, { borderColor: c.border, color: c.text }]} placeholder="Amount" placeholderTextColor={c.textSub} value={sendAmount} onChangeText={setSendAmount} keyboardType="numeric" />
            <TouchableOpacity style={[styles.sendBtn, { backgroundColor: c.violet }]} onPress={handleSend} disabled={sending}>
              {sending ? <ActivityIndicator color="#fff" /> : (
                <>
                  <ArrowUpRight size={18} color="#fff" />
                  <Text style={styles.sendText}>Send {selectedCurrency}</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  address: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 12, textAlign: 'center' },
  content: { padding: 20 },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  empty: { fontSize: 13, marginBottom: 16 },
  balCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 8 },
  balCurrency: { flex: 1, fontWeight: '600' },
  balAmount: { fontWeight: '800' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 15 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14 },
  sendText: { color: '#fff', fontWeight: '700' },
});
