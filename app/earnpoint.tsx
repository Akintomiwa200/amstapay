import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Gift, Star, TrendingUp, Clock, Award } from 'lucide-react-native';

const EarnPoint = () => {
  const router = useRouter();

  const rewards = [
    { icon: Star, title: 'Daily Check-in', points: 10, color: '#F97316' },
    { icon: TrendingUp, title: 'Complete Profile', points: 50, color: '#EA580C' },
    { icon: Gift, title: 'Refer a Friend', points: 100, color: '#C2410C' },
    { icon: Clock, title: 'Weekly Challenge', points: 75, color: '#9A3412' },
    { icon: Award, title: 'First Transaction', points: 25, color: '#7C2D12' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earn Points</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>1,250 pts</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Earn Points & Get Rewards!</Text>
          <Text style={styles.welcomeSubtitle}>
            Complete tasks to earn points and unlock exclusive rewards
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Tasks</Text>
        
        {rewards.map((reward, index) => {
          const Icon = reward.icon;
          return (
            <TouchableOpacity key={index} style={styles.rewardCard}>
              <View style={[styles.iconContainer, { backgroundColor: reward.color }]}>
                <Icon size={24} color="#FFF" />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardPoints}>+{reward.points} points</Text>
              </View>
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimText}>Claim</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Your Rewards</Text>
          <View style={styles.rewardsGrid}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardItemTitle}>₦500 Cashback</Text>
              <Text style={styles.rewardItemPoints}>2,000 pts</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardItemTitle}>Free Transfer</Text>
              <Text style={styles.rewardItemPoints}>1,500 pts</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardItemTitle}>Discount Coupon</Text>
              <Text style={styles.rewardItemPoints}>800 pts</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EarnPoint;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  pointsBadge: {
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#FFF7ED',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  claimText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  rewardsSection: {
    marginTop: 24,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardItem: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  rewardItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  rewardItemPoints: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '500',
  },
});