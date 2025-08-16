import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Gift, Star, Zap, CreditCard, ChevronRight } from 'lucide-react-native';

const Rewards = () => {
  // Mock reward data
  const rewards = [
    { id: 1, title: 'Welcome Bonus', points: 50, icon: <Star size={24} color="#D4AF37" /> },
    { id: 2, title: 'First Transaction', points: 100, icon: <Zap size={24} color="#D4AF37" /> },
    { id: 3, title: 'Referral Bonus', points: 200, icon: <Gift size={24} color="#D4AF37" /> },
  ];

  const transactions = [
    { id: 1, type: 'Cashback', amount: '+₦500', date: 'Today, 10:45 AM' },
    { id: 2, type: 'Payment', amount: '-₦2,500', date: 'Yesterday, 3:20 PM' },
    { id: 3, type: 'Cashback', amount: '+₦150', date: 'Mar 12, 9:15 AM' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rewards</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <Text style={styles.pointsValue}>1,250</Text>
        </View>
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earn More Points</Text>
        {rewards.map((reward) => (
          <TouchableOpacity key={reward.id} style={styles.rewardCard}>
            <View style={styles.rewardIcon}>{reward.icon}</View>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardPoints}>{reward.points} points</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.map((txn) => (
          <View key={txn.id} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <CreditCard size={20} color="#D4AF37" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{txn.type}</Text>
              <Text style={styles.transactionDate}>{txn.date}</Text>
            </View>
            <Text 
              style={[
                styles.transactionAmount,
                txn.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount
              ]}
            >
              {txn.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.bannerImage}
        />
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Double Points Week!</Text>
          <Text style={styles.promoText}>Earn 2x points on all transactions until Friday</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#000000',
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  pointsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  pointsLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    color: '#D4AF37',
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAll: {
    color: '#D4AF37',
    fontWeight: '500',
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rewardIcon: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionIcon: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
  promoBanner: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
  },
  bannerImage: {
    width: 120,
    height: '100%',
  },
  promoContent: {
    flex: 1,
    padding: 16,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: '#92400E',
  },
});

export default Rewards;