import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard,
  Plus,
  Shield,
  Zap,
  Globe,
  Snowflake,
  Wallet,
  ChevronRight,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { cardService } from '@/services/cards';
import { formatMoney } from '@/lib/format';
import type { VirtualCard } from '@/lib/models';

function parseCards(res: unknown): VirtualCard[] {
  const data = (res as { data?: VirtualCard[] })?.data ?? res;
  return Array.isArray(data) ? data : [];
}

const Cards = () => {
  const { theme } = useTheme();
  const c = theme.colors;
  const { user } = useAuth();
  const { socket } = useSocket();
  const { currency } = usePersonalization();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [fundModal, setFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  const selected = cards.find((card) => card._id === selectedId) ?? cards[0] ?? null;

  const loadCards = useCallback(async () => {
    try {
      const res = await cardService.getAll();
      const list = parseCards(res);
      setCards(list);
      if (list.length && !selectedId) setSelectedId(list[0]._id);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedId]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards]),
  );

  useEffect(() => {
    if (!socket) return;
    const refresh = () => loadCards();
    socket.on('card:update', refresh);
    socket.on('card:funded', refresh);
    socket.on('transaction:completed', refresh);
    return () => {
      socket.off('card:update', refresh);
      socket.off('card:funded', refresh);
      socket.off('transaction:completed', refresh);
    };
  }, [socket, loadCards]);

  const handleCreateCard = async () => {
    try {
      setCreating(true);
      await cardService.create('virtual');
      await loadCards();
      Alert.alert('Success', 'Your virtual card has been issued instantly.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create card');
    } finally {
      setCreating(false);
    }
  };

  const handleFreezeToggle = async () => {
    if (!selected) return;
    const freeze = selected.status === 'active';
    Alert.alert(
      freeze ? 'Freeze card' : 'Unfreeze card',
      freeze ? 'Card payments will be paused until you unfreeze.' : 'Resume card payments?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: freeze ? 'Freeze' : 'Unfreeze',
          onPress: async () => {
            try {
              setActionLoading(true);
              await cardService.freeze(selected._id);
              await loadCards();
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Action failed');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleFund = async () => {
    if (!selected) return;
    const amount = Number(fundAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount to fund your card.');
      return;
    }
    try {
      setActionLoading(true);
      await cardService.fund(selected._id, amount);
      setFundModal(false);
      setFundAmount('');
      await loadCards();
      Alert.alert('Success', `${formatMoney(amount, currency)} added to your card.`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to fund card');
    } finally {
      setActionLoading(false);
    }
  };

  const cardholder = selected?.cardholderName || user?.fullName || 'CARD HOLDER';
  const cardNumber = selected ? `•••• •••• •••• ${selected.last4}` : '•••• •••• •••• ••••';
  const expiry = selected?.expiry || '**/**';
  const cardBalance = selected ? formatMoney(selected.balance, selected.currency || currency) : formatMoney(0, currency);

  const features = [
    { icon: Zap, title: 'Instant Issuance', description: 'Virtual card ready in seconds' },
    { icon: Shield, title: 'Secure', description: 'Freeze anytime from the app' },
    { icon: Globe, title: 'Global', description: 'Pay online worldwide' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadCards(); }} tintColor={c.violet} />}
      >
        <LinearGradient colors={[c.primary, c.violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <Text style={styles.headerTitle}>Cards</Text>
          <Text style={styles.headerSubtitle}>Virtual debit cards for online & in-app payments</Text>
        </LinearGradient>

        <View style={[styles.contentArea, { backgroundColor: c.bg }]}>
          {loading ? (
            <ActivityIndicator color={c.violet} style={{ marginVertical: 40 }} />
          ) : (
            <>
              <View style={styles.cardPreviewContainer}>
                <LinearGradient
                  colors={selected?.status === 'frozen' ? ['#64748b', '#475569'] : [c.primary, c.violet]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.cardPreview, { shadowColor: c.primary }]}
                >
                  <View style={styles.cardHeader}>
                    <CreditCard size={28} color="#fff" />
                    <Text style={styles.cardType}>{selected?.brand || selected?.cardType || 'Virtual Debit'}</Text>
                  </View>
                  <Text style={styles.cardNumber}>{cardNumber}</Text>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardLabel}>Card Holder</Text>
                      <Text style={styles.cardValue}>{cardholder.toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardLabel}>Expires</Text>
                      <Text style={styles.cardValue}>{expiry}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardLabel}>Balance</Text>
                      <Text style={styles.cardValue}>{cardBalance}</Text>
                    </View>
                  </View>
                </LinearGradient>

                {selected?.status === 'frozen' && (
                  <View style={[styles.statusBadge, { backgroundColor: c.blue }]}>
                    <Snowflake size={14} color="#fff" />
                    <Text style={styles.statusText}>Frozen</Text>
                  </View>
                )}
              </View>

              {cards.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardTabs}>
                  {cards.map((card) => (
                    <TouchableOpacity
                      key={card._id}
                      style={[
                        styles.cardTab,
                        { borderColor: selectedId === card._id ? c.violet : c.border, backgroundColor: selectedId === card._id ? c.primaryLight : c.bg },
                      ]}
                      onPress={() => setSelectedId(card._id)}
                    >
                      <Text style={[styles.cardTabText, { color: c.text }]}>•••• {card.last4}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {selected ? (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: c.primaryLight }]}
                    onPress={() => setFundModal(true)}
                    disabled={actionLoading || selected.status === 'frozen'}
                  >
                    <Wallet size={20} color={c.violet} />
                    <Text style={[styles.actionText, { color: c.text }]}>Fund</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: c.primaryLight }]}
                    onPress={handleFreezeToggle}
                    disabled={actionLoading}
                  >
                    <Snowflake size={20} color={c.blue} />
                    <Text style={[styles.actionText, { color: c.text }]}>
                      {selected.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={handleCreateCard}
                  disabled={creating}
                >
                  <LinearGradient colors={[c.mint, c.violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createGradient}>
                    {creating ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Plus size={20} color="#fff" />
                        <Text style={styles.createText}>Get Virtual Card</Text>
                        <ChevronRight size={18} color="#fff" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {selected && (
                <TouchableOpacity style={styles.secondaryCreate} onPress={handleCreateCard} disabled={creating}>
                  <Plus size={16} color={c.violet} />
                  <Text style={[styles.secondaryCreateText, { color: c.violet }]}>Issue another card</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View key={index} style={[styles.featureCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: `${c.violet}15` }]}>
                    <Icon size={24} color={c.violet} />
                  </View>
                  <Text style={[styles.featureTitle, { color: c.text }]}>{feature.title}</Text>
                  <Text style={[styles.featureDescription, { color: c.textSub }]}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal visible={fundModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: c.bg }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>Fund card</Text>
            <Text style={[styles.modalSub, { color: c.textSub }]}>Amount is deducted from your AmstaPay wallet</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: c.border, color: c.text }]}
              value={fundAmount}
              onChangeText={setFundAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={c.textSub}
            />
            <TouchableOpacity
              style={[styles.modalPrimary, { backgroundColor: c.violet }]}
              onPress={handleFund}
              disabled={actionLoading}
            >
              {actionLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalPrimaryText}>Fund card</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFundModal(false)}>
              <Text style={[styles.modalCancel, { color: c.textSub }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5, marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  contentArea: { borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, paddingTop: 20, paddingHorizontal: 20 },
  cardPreviewContainer: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  cardPreview: { width: '100%', borderRadius: 20, padding: 20, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 },
  cardType: { fontSize: 14, fontWeight: '600', color: '#fff', opacity: 0.85 },
  cardNumber: { fontSize: 18, fontWeight: '700', color: '#fff', letterSpacing: 2, marginBottom: 28 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  cardValue: { fontSize: 11, fontWeight: '600', color: '#fff' },
  statusBadge: { position: 'absolute', top: -10, right: 16, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardTabs: { gap: 10, marginBottom: 16 },
  cardTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  cardTabText: { fontSize: 13, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  actionBtn: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', gap: 8 },
  actionText: { fontSize: 13, fontWeight: '600' },
  createBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  createGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  createText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryCreate: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 },
  secondaryCreateText: { fontSize: 14, fontWeight: '600' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 8 },
  featureCard: { flex: 1, minWidth: '45%', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1 },
  featureIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  featureTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  featureDescription: { fontSize: 11, textAlign: 'center', lineHeight: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  modalSub: { fontSize: 13, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, marginBottom: 16 },
  modalPrimary: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  modalPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalCancel: { textAlign: 'center', fontSize: 14, paddingVertical: 8 },
});
