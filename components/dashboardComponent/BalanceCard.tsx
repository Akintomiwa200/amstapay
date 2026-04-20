// components/dashboardComponent/BalanceCard.tsx
import { useRouter } from 'expo-router';
import { ChevronRight, Wallet,Eye, EyeOff, Plus, TrendingUp, Shield } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { C } from './colors';

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getWalletBalance } = useAuth();

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const data = await getWalletBalance();
      setBalance(data.balance);
    } catch (err) {
      console.error("Failed to fetch balance", err);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleOpenHistory = () => router.push('/transactions');
  const handleAddMoney = () => router.push('/add-money');

  const balanceText = showBalance
    ? loading
      ? 'Loading...'
      : balance !== null
      ? `₦${balance.toLocaleString()}`
      : '₦0.00'
    : '•••••••';

  return (
    <LinearGradient
      colors={[C.primary, C.violet]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Wallet size={16} color="#fff" />
          </View>
          <Text style={styles.subText}>Total Balance</Text>
        </View>
        <TouchableOpacity style={styles.historyButton} onPress={handleOpenHistory}>
          <Text style={styles.linkText}>History</Text>
          <ChevronRight size={14} color={C.mint} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceRow}>
        <TouchableOpacity style={styles.balanceWrapper} onPress={() => setShowBalance(prev => !prev)}>
          <Text style={styles.balance}>{balanceText}</Text>
          {showBalance ? (
            <EyeOff size={20} color="rgba(255,255,255,0.7)" />
          ) : (
            <Eye size={20} color="rgba(255,255,255,0.7)" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.addMoneyBtn} onPress={handleAddMoney}>
          <Plus size={16} color={C.primary} />
          <Text style={styles.addMoneyText}>Add Money</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <TrendingUp size={14} color={C.mint} />
          <Text style={styles.statLabel}>Today's Spend</Text>
          <Text style={styles.statValue}>₦0.00</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Shield size={14} color={C.mint} />
          <Text style={styles.statLabel}>Locked Savings</Text>
          <Text style={styles.statValue}>₦0.00</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 20,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  historyButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: 12, color: C.mint, fontWeight: '600' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  balanceWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balance: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  addMoneyBtn: { 
    backgroundColor: '#fff', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  addMoneyText: { color: C.primary, fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 16 },
  statItem: { flex: 1, gap: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 16 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  statValue: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default BalanceCard;