// app/settings/payment-methods/index.tsx - Payment Methods Settings Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, Building, Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  const cards = [
    { id: 1, type: 'Visa', last4: '1234', expiry: '12/26', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '5678', expiry: '08/25', isDefault: false },
  ];

  const bankAccounts = [
    { id: 1, bank: 'GTBank', account: '****9012', name: 'John Doe', isDefault: true },
    { id: 2, bank: 'Access Bank', account: '****3456', name: 'John Doe', isDefault: false },
  ];

  const handleDelete = (type: string, id: number) => {
    Alert.alert('Remove', `Are you sure you want to remove this ${type}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Payment Methods</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Cards</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-account' as any)}>
              <Plus size={16} color={c.violet} />
              <Text style={[styles.addText, { color: c.violet }]}>Add Card</Text>
            </TouchableOpacity>
          </View>
          {cards.map((card) => (
            <View key={card.id} style={[styles.methodCard, { backgroundColor: c.bg, borderColor: c.border }]}>
              <View style={[styles.cardIcon, { backgroundColor: c.primaryLight }]}>
                <CreditCard size={22} color={c.violet} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, { color: c.text }]}>{card.type} •••• {card.last4}</Text>
                <Text style={[styles.methodSub, { color: c.textSub }]}>Expires {card.expiry}</Text>
              </View>
              {card.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: c.mint + '20' }]}>
                  <Text style={[styles.defaultText, { color: c.mint }]}>Default</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => handleDelete('card', card.id)} style={styles.deleteBtn}>
                <Trash2 size={16} color={c.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bank Accounts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.primary }]}>Bank Accounts</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-account' as any)}>
              <Plus size={16} color={c.violet} />
              <Text style={[styles.addText, { color: c.violet }]}>Add Account</Text>
            </TouchableOpacity>
          </View>
          {bankAccounts.map((account) => (
            <View key={account.id} style={[styles.methodCard, { backgroundColor: c.bg, borderColor: c.border }]}>
              <View style={[styles.bankIcon, { backgroundColor: c.blue + '15' }]}>
                <Building size={22} color={c.blue} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, { color: c.text }]}>{account.bank}</Text>
                <Text style={[styles.methodSub, { color: c.textSub }]}>{account.name} • {account.account}</Text>
              </View>
              {account.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: c.mint + '20' }]}>
                  <Text style={[styles.defaultText, { color: c.mint }]}>Default</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => handleDelete('account', account.id)} style={styles.deleteBtn}>
                <Trash2 size={16} color={c.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { fontSize: 13, fontWeight: '600' },
  methodCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10 },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  bankIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '600' },
  methodSub: { fontSize: 12, marginTop: 2 },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  defaultText: { fontSize: 10, fontWeight: '600' },
  deleteBtn: { padding: 8 },
});
