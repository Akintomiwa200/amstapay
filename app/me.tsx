import { ChevronRight, Gift, LogOut, Mail, Phone, Settings, Star, User, Zap } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Me = () => {
  // User profile data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: require('@/assets/images/logo.png'),
    tier: 'Gold Member',
    points: 1250,
  };

  // Mock reward data
  const rewards = [
    { id: 1, title: 'Welcome Bonus', points: 50, icon: <Star size={24} color="#D4AF37" /> },
    { id: 2, title: 'First Transaction', points: 100, icon: <Zap size={24} color="#D4AF37" /> },
    { id: 3, title: 'Referral Bonus', points: 200, icon: <Gift size={24} color="#D4AF37" /> },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userTier}>{user.tier}</Text>
          </View>
        </View>
      </View>

      {/* Rewards Summary */}
      <View style={styles.rewardsSummary}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <Text style={styles.pointsValue}>{user.points}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.rewardsActions}>
          <TouchableOpacity style={styles.rewardAction}>
            <Gift size={20} color="#D4AF37" />
            <Text style={styles.rewardActionText}>Redeem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rewardAction}>
            <Star size={20} color="#D4AF37" />
            <Text style={styles.rewardActionText}>Earn More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <ProfileItem 
          icon={<User size={20} color="#6B7280" />}
          title="Name"
          value={user.name}
        />
        <ProfileItem 
          icon={<Mail size={20} color="#6B7280" />}
          title="Email"
          value={user.email}
        />
        <ProfileItem 
          icon={<Phone size={20} color="#6B7280" />}
          title="Phone"
          value={user.phone}
        />
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Earn More Points</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
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

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.accountAction}>
          <View style={styles.actionIcon}>
            <Settings size={20} color="#6B7280" />
          </View>
          <Text style={styles.actionText}>Settings</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountAction} onPress={handleLogout}>
          <View style={[styles.actionIcon, styles.logoutIcon]}>
            <LogOut size={20} color="#EF4444" />
          </View>
          <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Reusable Profile Item Component
const ProfileItem = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <View style={styles.profileItem}>
    <View style={styles.itemIcon}>{icon}</View>
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#000000',
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#D4AF37',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userTier: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '500',
  },
  rewardsSummary: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  pointsContainer: {
    flex: 1,
  },
  pointsLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    color: '#111827',
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  rewardsActions: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rewardAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardActionText: {
    color: '#111827',
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
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
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: '#6B7280',
    fontSize: 14,
  },
  itemValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
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
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutText: {
    color: '#EF4444',
  },
});

export default Me;