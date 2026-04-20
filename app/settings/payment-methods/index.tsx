// app/settings/payment-methods/index.tsx - Payment Methods Settings Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, Building, Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function PaymentMethodsScreen() {
  const router = useRouter();

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
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-account' as any)}>
              <Plus size={16} color={C.violet} />
              <Text style={styles.addText}>Add Card</Text>
            </TouchableOpacity>
          </View>
          {cards.map((card) => (
            <View key={card.id} style={styles.methodCard}>
              <View style={styles.cardIcon}>
                <CreditCard size={22} color={C.violet} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{card.type} •••• {card.last4}</Text>
                <Text style={styles.methodSub}>Expires {card.expiry}</Text>
              </View>
              {card.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => handleDelete('card', card.id)} style={styles.deleteBtn}>
                <Trash2 size={16} color={C.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bank Accounts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bank Accounts</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-account' as any)}>
              <Plus size={16} color={C.violet} />
              <Text style={styles.addText}>Add Account</Text>
            </TouchableOpacity>
          </View>
          {bankAccounts.map((account) => (
            <View key={account.id} style={styles.methodCard}>
              <View style={styles.bankIcon}>
                <Building size={22} color={C.blue} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{account.bank}</Text>
                <Text style={styles.methodSub}>{account.name} • {account.account}</Text>
              </View>
              {account.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => handleDelete('account', account.id)} style={styles.deleteBtn}>
                <Trash2 size={16} color={C.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { fontSize: 13, fontWeight: '600', color: C.violet },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 10 },
  cardIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  bankIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.blue + '15', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  methodSub: { fontSize: 12, color: C.textSub, marginTop: 2 },
  defaultBadge: { backgroundColor: C.mint + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  defaultText: { fontSize: 10, fontWeight: '600', color: C.mint },
  deleteBtn: { padding: 8 },
});
