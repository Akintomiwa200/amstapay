// app/budget/create.tsx - Create Budget Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, Calendar, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { budgetService } from '@/services/budget';

export default function CreateBudgetScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const { theme } = useTheme();
  const c = theme.colors;
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Health', 'Education', 'Savings',
  ];

  const handleCreate = async () => {
    if (!category || !amount) {
      Alert.alert('Error', 'Please select a category and enter an amount');
      return;
    }
    try {
      setSubmitting(true);
      await budgetService.create({
        name: category,
        amount: parseInt(amount, 10),
        period,
        categories: [category],
      });
      Alert.alert('Budget Created', `${period} budget for ${category} saved.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create budget');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
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
        <Text style={[styles.label, { color: c.primary }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, { backgroundColor: c.primaryLight, borderColor: c.border }, category === cat && { backgroundColor: c.violet, borderColor: c.violet }]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, { color: c.text }, category === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget Amount */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Budget Amount</Text>
          <View style={[styles.amountInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
            <Text style={[styles.currency, { color: c.primary }]}>₦</Text>
            <TextInput
              style={[styles.amountField, { color: c.text }]}
              placeholder="0.00"
              placeholderTextColor={c.textSub}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Period */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.primary }]}>Budget Period</Text>
          <View style={styles.periodRow}>
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, { backgroundColor: c.primaryLight, borderColor: c.border }, period === p && { backgroundColor: c.violet, borderColor: c.violet }]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodText, { color: c.text }, period === p && styles.periodTextActive]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        {category && amount ? (
          <View style={[styles.summaryCard, { backgroundColor: c.primaryLight, borderColor: c.border }]}>
            <Text style={[styles.summaryTitle, { color: c.primary }]}>Budget Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSub }]}>Category</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>{category}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSub }]}>Amount</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>₦{parseInt(amount || '0').toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSub }]}>Period</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>{period}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Create Button */}
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.85} disabled={submitting}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.createGradient}>
            <Plus size={20} color="#fff" />
            <Text style={styles.createText}>{submitting ? 'Creating...' : 'Create Budget'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  categoryText: { fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 24 },
  amountInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1 },
  currency: { fontSize: 28, fontWeight: '800', marginRight: 8 },
  amountField: { flex: 1, fontSize: 28, fontWeight: '700' },
  periodRow: { flexDirection: 'row', gap: 8 },
  periodBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  periodText: { fontSize: 14, fontWeight: '600' },
  periodTextActive: { color: '#fff' },
  summaryCard: { borderRadius: 18, padding: 20, borderWidth: 1, gap: 12 },
  summaryTitle: { fontSize: 16, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1 },
  createBtn: { borderRadius: 16, overflow: 'hidden' },
  createGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  createText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
