// app/budget/create.tsx - Create Budget Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, Calendar, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function CreateBudgetScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Health', 'Education', 'Savings',
  ];

  const handleCreate = () => {
    if (!category || !amount) {
      Alert.alert('Error', 'Please select a category and enter an amount');
      return;
    }
    Alert.alert('Budget Created', `₦${parseInt(amount).toLocaleString()} ${period} budget for ${category}`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primary, C.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Budget</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Selection */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Amount</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.amountField}
              placeholder="0.00"
              placeholderTextColor={C.textSub}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Period */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Period</Text>
          <View style={styles.periodRow}>
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        {category && amount ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Budget Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Category</Text>
              <Text style={styles.summaryValue}>{category}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>₦{parseInt(amount || '0').toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Period</Text>
              <Text style={styles.summaryValue}>{period}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.createGradient}>
            <Plus size={20} color="#fff" />
            <Text style={styles.createText}>Create Budget</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: C.primaryLight, borderWidth: 1, borderColor: C.border },
  categoryChipActive: { backgroundColor: C.violet, borderColor: C.violet },
  categoryText: { fontSize: 13, fontWeight: '500', color: C.text },
  categoryTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 24 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1, borderColor: C.border },
  currency: { fontSize: 28, fontWeight: '800', color: C.primary, marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700', color: C.text },
  periodRow: { flexDirection: 'row', gap: 8 },
  periodBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  periodBtnActive: { backgroundColor: C.violet, borderColor: C.violet },
  periodText: { fontSize: 14, fontWeight: '600', color: C.text },
  periodTextActive: { color: '#fff' },
  summaryCard: { backgroundColor: C.primaryLight, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: C.border, gap: 12 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: C.primary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: C.textSub },
  summaryValue: { fontSize: 14, fontWeight: '600', color: C.text },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  createBtn: { borderRadius: 16, overflow: 'hidden' },
  createGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  createText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
