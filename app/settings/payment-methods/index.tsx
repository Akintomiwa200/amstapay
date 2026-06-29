import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, Building, Plus, Trash2 } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { cardService } from '@/services/cards';
import { beneficiaryService } from '@/services/beneficiary';
import type { VirtualCard, Beneficiary } from '@/lib/models';

function parseList<T>(res: unknown): T[] {
  const data = (res as { data?: T[] })?.data ?? res;
  return Array.isArray(data) ? data : [];
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [accounts, setAccounts] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMethods = useCallback(async () => {
    try {
      setLoading(true);
      const [cardsRes, beneficiariesRes] = await Promise.allSettled([
        cardService.getAll(),
        beneficiaryService.getAll(),
      ]);
      if (cardsRes.status === 'fulfilled') setCards(parseList<VirtualCard>(cardsRes.value));
      if (beneficiariesRes.status === 'fulfilled') setAccounts(parseList<Beneficiary>(beneficiariesRes.value));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMethods();
    }, [loadMethods]),
  );

  const handleDeleteBeneficiary = (account: Beneficiary) => {
    Alert.alert('Remove account', `Remove ${account.bankName} •••• ${account.accountNumber.slice(-4)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await beneficiaryService.delete(account._id);
            await loadMethods();
          } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to remove account');
          }
        },
      },
    ]);
  };

  const handleCancelCard = (card: VirtualCard) => {
    Alert.alert('Cancel card', `Cancel virtual card ending ${card.last4}?`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel card',
        style: 'destructive',
        onPress: async () => {
          try {
            await cardService.cancel(card._id);
            await loadMethods();
          } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to cancel card');
          }
        },
      },
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
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: c.primary }]}>Cards</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/card' as any)}>
                  <Plus size={16} color={c.violet} />
                  <Text style={[styles.addText, { color: c.violet }]}>Manage</Text>
                </TouchableOpacity>
              </View>
              {cards.length === 0 ? (
                <Text style={[styles.emptyText, { color: c.textSub }]}>No cards yet. Issue one from the Cards tab.</Text>
              ) : (
                cards.map((card) => (
                  <View key={card._id} style={[styles.methodCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                    <View style={[styles.cardIcon, { backgroundColor: c.primaryLight }]}>
                      <CreditCard size={22} color={c.violet} />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodTitle, { color: c.text }]}>
                        {(card.brand || card.cardType || 'Card')} •••• {card.last4}
                      </Text>
                      <Text style={[styles.methodSub, { color: c.textSub }]}>
                        {card.status === 'frozen' ? 'Frozen' : 'Active'} · Expires {card.expiry || 'N/A'}
                      </Text>
                    </View>
                    {card.status === 'active' && (
                      <View style={[styles.defaultBadge, { backgroundColor: c.mint + '20' }]}>
                        <Text style={[styles.defaultText, { color: c.mint }]}>Active</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => handleCancelCard(card)} style={styles.deleteBtn}>
                      <Trash2 size={16} color={c.error} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: c.primary }]}>Bank Accounts</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-account' as any)}>
                  <Plus size={16} color={c.violet} />
                  <Text style={[styles.addText, { color: c.violet }]}>Add Account</Text>
                </TouchableOpacity>
              </View>
              {accounts.length === 0 ? (
                <Text style={[styles.emptyText, { color: c.textSub }]}>No saved beneficiaries yet.</Text>
              ) : (
                accounts.map((account) => (
                  <View key={account._id} style={[styles.methodCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                    <View style={[styles.bankIcon, { backgroundColor: c.blue + '15' }]}>
                      <Building size={22} color={c.blue} />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodTitle, { color: c.text }]}>{account.bankName}</Text>
                      <Text style={[styles.methodSub, { color: c.textSub }]}>
                        {account.name} • •••• {account.accountNumber.slice(-4)}
                      </Text>
                    </View>
                    {account.isFavorite && (
                      <View style={[styles.defaultBadge, { backgroundColor: c.mint + '20' }]}>
                        <Text style={[styles.defaultText, { color: c.mint }]}>Favorite</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteBeneficiary(account)} style={styles.deleteBtn}>
                      <Trash2 size={16} color={c.error} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </>
        )}
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
  emptyText: { fontSize: 13, marginBottom: 8 },
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
