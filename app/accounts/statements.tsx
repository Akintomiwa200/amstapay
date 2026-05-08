// app/accounts/statements.tsx - Account Statements Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Download, Filter, ArrowDownRight, ArrowUpRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function StatementsScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('March 2024');
  const { theme } = useTheme();
  const c = theme.colors;

  const statements = [
    { id: 1, type: 'Salary Deposit', amount: '+₦250,000', date: 'Mar 28', category: 'income', balance: '₦485,300' },
    { id: 2, type: 'Electricity Bill', amount: '-₦15,000', date: 'Mar 25', category: 'expense', balance: '₦235,300' },
    { id: 3, type: 'Transfer to Savings', amount: '-₦50,000', date: 'Mar 22', category: 'expense', balance: '₦250,300' },
    { id: 4, type: 'Freelance Payment', amount: '+₦80,000', date: 'Mar 18', category: 'income', balance: '₦300,300' },
    { id: 5, type: 'Grocery Shopping', amount: '-₦12,500', date: 'Mar 15', category: 'expense', balance: '₦220,300' },
    { id: 6, type: 'Airtime Purchase', amount: '-₦5,000', date: 'Mar 12', category: 'expense', balance: '₦232,800' },
    { id: 7, type: 'Investment Return', amount: '+₦8,200', date: 'Mar 8', category: 'income', balance: '₦237,800' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statements</Text>
          <TouchableOpacity style={styles.downloadBtn}>
            <Download size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Month Selector */}
        <TouchableOpacity style={styles.monthSelector}>
          <Calendar size={16} color="#fff" />
          <Text style={styles.monthText}>{selectedMonth}</Text>
        </TouchableOpacity>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <ArrowDownRight size={16} color={c.mint} />
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValue}>+₦338,200</Text>
          </View>
          <View style={styles.summaryCard}>
            <ArrowUpRight size={16} color={c.pink} />
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={styles.summaryValue}>-₦82,500</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Bar */}
      <View style={[styles.filterBar, { borderBottomColor: c.border }]}>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: c.primaryLight }]}>
          <Filter size={16} color={c.violet} />
          <Text style={[styles.filterText, { color: c.violet }]}>Filter</Text>
        </TouchableOpacity>
        <Text style={[styles.resultCount, { color: c.textSub }]}>{statements.length} transactions</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {statements.map((item) => (
          <View key={item.id} style={[styles.statementRow, { borderBottomColor: c.border }]}>
            <View style={[styles.typeIcon, item.category === 'income' ? { backgroundColor: c.success } : { backgroundColor: c.error }]}>
              {item.category === 'income' ?
                <ArrowDownRight size={16} color="#fff" /> :
                <ArrowUpRight size={16} color="#fff" />
              }
            </View>
            <View style={styles.statementInfo}>
              <Text style={[styles.statementType, { color: c.text }]}>{item.type}</Text>
              <Text style={[styles.statementDate, { color: c.textSub }]}>{item.date}</Text>
            </View>
            <View style={styles.statementRight}>
              <Text style={[styles.statementAmount, item.category === 'income' ? { color: c.success } : { color: c.error }]}>
                {item.amount}
              </Text>
              <Text style={[styles.statementBalance, { color: c.textSub }]}>Bal: {item.balance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  monthSelector: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 16 },
  monthText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12, gap: 4 },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  summaryValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  filterBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  resultCount: { fontSize: 13 },
  content: { paddingHorizontal: 20 },
  statementRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  typeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statementInfo: { flex: 1 },
  statementType: { fontSize: 14, fontWeight: '600' },
  statementDate: { fontSize: 12, marginTop: 2 },
  statementRight: { alignItems: 'flex-end' },
  statementAmount: { fontSize: 14, fontWeight: '700' },
  statementBalance: { fontSize: 11, marginTop: 2 },
});
