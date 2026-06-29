import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { cashbackService } from '@/services/cashback';
import { transactionService } from '@/services/transactions';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import type { Transaction } from '@/lib/models';

type RewardTxn = { id: string; type: string; amount: number; date: string; status: string };

export default function RecentRewardTransaction() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [transactions, setTransactions] = useState<RewardTxn[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [histRes, txRes] = await Promise.allSettled([
        cashbackService.getHistory(),
        transactionService.getAll(1, 50),
      ]);

      let rows: RewardTxn[] = [];
      if (histRes.status === 'fulfilled') {
        const list = parseList<{ id?: string; _id?: string; description?: string; amount?: number; points?: number; createdAt?: string }>(histRes.value);
        rows = list.map((item, i) => ({
          id: item._id || item.id || String(i),
          type: item.description || 'Cashback Reward',
          amount: item.points ?? item.amount ?? 0,
          date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-NG') : '',
          status: 'Completed',
        }));
      }
      if (!rows.length && txRes.status === 'fulfilled') {
        const txs = parseList<Transaction>(txRes.value).filter((t) =>
          /cashback|reward|referral|bonus/i.test(t.description || t.type || ''),
        );
        rows = txs.map((t) => ({
          id: t._id,
          type: t.description || t.type,
          amount: t.amount,
          date: new Date(t.createdAt).toLocaleString('en-NG'),
          status: t.status,
        }));
      }
      setTransactions(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={c.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Reward History</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={c.violet} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {transactions.length === 0 ? (
            <Text style={[styles.empty, { color: c.textSub }]}>No reward transactions yet.</Text>
          ) : (
            transactions.map((item) => (
              <View key={item.id} style={[styles.card, { borderColor: c.border, backgroundColor: c.bg }]}>
                <View style={[styles.icon, { backgroundColor: c.primaryLight }]}>
                  <CreditCard size={20} color={c.violet} />
                </View>
                <View style={styles.info}>
                  <Text style={[styles.type, { color: c.text }]}>{item.type}</Text>
                  <Text style={[styles.date, { color: c.textSub }]}>{item.date}</Text>
                  <Text style={[styles.status, { color: c.mint }]}>{item.status}</Text>
                </View>
                <Text style={[styles.amount, { color: item.amount >= 0 ? c.mint : c.error }]}>
                  {item.amount >= 0 ? '+' : ''}{typeof item.amount === 'number' && item.amount < 1000 ? `${item.amount} pts` : formatMoney(item.amount, currency)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  list: { padding: 16 },
  empty: { textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  type: { fontSize: 14, fontWeight: '600' },
  date: { fontSize: 12, marginTop: 2 },
  status: { fontSize: 11, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '700' },
});
