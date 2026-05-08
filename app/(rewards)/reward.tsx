import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Gift, Star, Zap, CreditCard, ChevronRight } from 'lucide-react-native';

const Rewards = () => {
  const router = useRouter();
  
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

  const handleSeeAll = () => {
    router.push('/recent-reward-transaction');
  };

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
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.map((txn) => (
          <View key={txn.id} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <CreditCard size={20} color="#FF8C00" />
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
          source={{ uri: 'https://illustrations.popsy.co/orange/gift-box.svg' }} 
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
    backgroundColor: '#FF8C00',
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
    backgroundColor: '#E67300',
    borderRadius: 12,
    padding: 16,
  },
  pointsLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.9,
  },
  pointsValue: {
    color: '#FFFFFF',
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
    color: '#000000',
  },
  seeAll: {
    color: '#FF8C00',
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
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
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
    color: '#000000',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 14,
    color: '#666666',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionIcon: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
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
    color: '#000000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
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
    backgroundColor: '#FFF4E6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  promoContent: {
    flex: 1,
    padding: 16,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default Rewards;