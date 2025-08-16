import { useRouter } from 'expo-router';
import { ChevronRight, Plus, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const router = useRouter();

  const handleOpenHistory = () => {
    router.push('/transactions');
  };

  const handleAddMoney = () => {
    router.push('/add-money');
  };

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.row}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <View style={styles.iconDot} />
          </View>
          <Text style={styles.subText}>Available Balance</Text>
          <View style={styles.smallCircle} />
        </View>

        <TouchableOpacity style={styles.row} onPress={handleOpenHistory}>
          <Text style={styles.linkText}>Transaction History</Text>
          <ChevronRight size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Bottom row */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.row} onPress={() => setShowBalance((prev) => !prev)}>
          <Text style={styles.balance}>
            {showBalance ? '₦0.00' : '•••••••'}
          </Text>
          {showBalance ? (
            <EyeOff size={20} color="#000" style={{ marginLeft: 6 }} />
          ) : (
            <Eye size={20} color="#000" style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.addMoneyBtn} onPress={handleAddMoney}>
          <Plus size={16} color="#000" />
          <Text style={styles.addMoneyText}>Add Money</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff', // Light background
    borderWidth: 1,
    borderColor: '#FFD700', // Gold border
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  smallCircle: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 8,
    marginLeft: 8,
  },
  subText: {
    fontSize: 12,
    color: '#000',
  },
  linkText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  addMoneyBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMoneyText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});
