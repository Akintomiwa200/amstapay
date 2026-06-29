import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Share, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Download, Filter, ArrowDownRight, ArrowUpRight, Calendar } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { reportsService } from '@/services/reports';
import { transactionService } from '@/services/transactions';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';
import type { Transaction } from '@/lib/models';

type Stmt = { id: string; type: string; amount: number; date: string; balance?: number };

export default function StatementsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-NG', { month: 'long', year: 'numeric' }));
  const [statements, setStatements] = useState<Stmt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [stmtRes, txRes] = await Promise.allSettled([
        reportsService.getStatement(),
        transactionService.getAll(1, 100),
      ]);

      let rows: Stmt[] = [];
      if (stmtRes.status === 'fulfilled') {
        const data = (stmtRes.value as { data?: Stmt[] })?.data ?? stmtRes.value;
        if (Array.isArray(data)) {
          rows = data.map((s, i) => ({
            id: (s as Stmt).id || String(i),
            type: (s as Stmt).type || 'Transaction',
            amount: (s as Stmt).amount || 0,
            date: (s as Stmt).date || '',
            balance: (s as Stmt).balance,
          }));
        }
      }
      if (!rows.length && txRes.status === 'fulfilled') {
        const txs = parseList<Transaction>(txRes.value);
        rows = txs.map((t) => ({
          id: t._id,
          type: t.description || t.type || 'Transaction',
          amount: t.amount,
          date: new Date(t.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
        }));
      }
      setStatements(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleExport = async () => {
    try {
      const text = statements.map((s) => `${s.date} | ${s.type} | ${formatMoney(s.amount, currency)}`).join('\n');
      await Share.share({ message: `AmstaPay Statement\n\n${text}`, title: 'Account Statement' });
    } catch {
      Alert.alert('Export failed', 'Could not share statement.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statements</Text>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleExport}>
            <Download size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.monthSelector}>
          <Calendar size={16} color="#fff" />
          <Text style={styles.monthText}>{selectedMonth}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : statements.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No statements yet.</Text>
        ) : (
          statements.map((stmt) => {
            const isCredit = stmt.amount > 0;
            return (
              <View key={stmt.id} style={[styles.stmtRow, { borderBottomColor: c.border }]}>
                <View style={[styles.stmtIcon, { backgroundColor: isCredit ? `${c.mint}18` : `${c.error}18` }]}>
                  {isCredit ? <ArrowDownRight size={18} color={c.mint} /> : <ArrowUpRight size={18} color={c.error} />}
                </View>
                <View style={styles.stmtInfo}>
                  <Text style={[styles.stmtType, { color: c.text }]}>{stmt.type}</Text>
                  <Text style={[styles.stmtDate, { color: c.textSub }]}>{stmt.date}</Text>
                </View>
                <Text style={[styles.stmtAmount, { color: isCredit ? c.mint : c.error }]}>
                  {isCredit ? '+' : ''}{formatMoney(stmt.amount, currency)}
                </Text>
              </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  monthSelector: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  monthText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  empty: { textAlign: 'center', marginTop: 32 },
  stmtRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  stmtIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stmtInfo: { flex: 1 },
  stmtType: { fontSize: 14, fontWeight: '600' },
  stmtDate: { fontSize: 12, marginTop: 2 },
  stmtAmount: { fontSize: 14, fontWeight: '700' },
});
