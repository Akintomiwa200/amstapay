import { useRouter } from 'expo-router';
import { ChevronRight, Eye, EyeOff, Plus } from 'lucide-react-native';
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
  const balanceText = showBalance ? '₦0.00' : '•••••••';

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

        <TouchableOpacity style={styles.historyButton} onPress={handleOpenHistory}>
          <Text style={styles.linkText}>Transaction History</Text>
          <ChevronRight size={16} color="#F97316" />
        </TouchableOpacity>
      </View>

      {/* Bottom row */}
      <View style={[styles.row, styles.bottomRow]}>
        <TouchableOpacity style={styles.row} onPress={() => setShowBalance((prev) => !prev)}>
          <Text style={styles.balance}>{balanceText}</Text>
          {showBalance ? (
            <EyeOff size={20} color="#1F2937" style={{ marginLeft: 8 }} />
          ) : (
            <Eye size={20} color="#1F2937" style={{ marginLeft: 8 }} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.addMoneyBtn} onPress={handleAddMoney}>
          <Plus size={16} color="#FFFFFF" />
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    marginTop: 16,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(249, 115, 22, 0.2)', // Orange-500 with opacity
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F97316', // Orange-500
    borderRadius: 4,
  },
  smallCircle: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(249, 115, 22, 0.2)', // Orange-500 with opacity
    borderRadius: 8,
    marginLeft: 8,
  },
  subText: {
    fontSize: 12,
    color: '#6B7280', // Medium gray
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 64,
    padding: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#F97316', // Orange-500
    fontWeight: '500',
    marginRight: 4,
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Dark gray
  },
  addMoneyBtn: {
    backgroundColor: '#F97316', // Orange-500
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMoneyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});