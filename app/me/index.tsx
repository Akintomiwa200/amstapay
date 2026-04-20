// app/me/index.tsx
import { ChevronRight, ChevronDown, Gift, LogOut, Mail, Phone, Settings, Star, User, Zap, X, CreditCard, MapPin, HelpCircle, Shield, Bell, Award, TrendingUp, Wallet, Lock, Smartphone, Globe, Moon, Sun, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View, Modal, Switch, Dimensions } from 'react-native';
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '@/components/dashboardComponent/colors';

const { width } = Dimensions.get('window');

const Me = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true);
  const [rewardsExpanded, setRewardsExpanded] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Settings states
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const profileUser = {
    name: user?.fullName || user?.name || "Guest",
    email: user?.email || "Not provided",
    phone: user?.phoneNumber || user?.phone || "Not provided",
    accountType: user?.accountType || "Personal",
    avatar: user?.avatar ? { uri: user.avatar } : require("../../assets/images/logo.png"),
    points: user?.points ?? 1250,
    address: user?.address || "Not provided",
    joinDate: user?.joinDate || "January 2024",
    verified: user?.verified || true,
  };

  const paymentMethods = [
    { id: '1', type: 'Visa', last4: '1234', expiry: '12/26' },
    { id: '2', type: 'Mastercard', last4: '5678', expiry: '08/25' },
  ];

  const rewards = [
    { id: 1, title: 'Welcome Bonus', points: 50, icon: Star, achieved: true },
    { id: 2, title: 'First Transaction', points: 100, icon: Zap, achieved: true },
    { id: 3, title: 'Referral Bonus', points: 200, icon: Gift, achieved: false },
    { id: 4, title: 'Monthly Spender', points: 500, icon: TrendingUp, achieved: false },
  ];

  const quickStats = [
    { label: 'Total Spent', value: '₦245,800', icon: Wallet, color: C.violet },
    { label: 'Points Earned', value: '1,250', icon: Award, color: C.mint },
    { label: 'Referrals', value: '3', icon: User, color: C.blue },
  ];

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await SecureStore.deleteItemAsync('authToken');
              await SecureStore.deleteItemAsync('refreshToken');
              await SecureStore.deleteItemAsync('userData');
              await logout();
              router.replace('/login');
              Toast.show({ type: 'success', text1: 'Logged out successfully', position: 'bottom' });
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Logout failed', position: 'bottom' });
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  const toggleSection = (section: string) => {
    switch(section) {
      case 'personalInfo': setPersonalInfoExpanded(!personalInfoExpanded); break;
      case 'rewards': setRewardsExpanded(!rewardsExpanded); break;
      case 'account': setAccountExpanded(!accountExpanded); break;
    }
  };

  const handleNavigateToSettings = (screen: string) => {
    setSettingsVisible(false);
    setTimeout(() => {
      router.push(screen as any);
    }, 100);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Header with Gradient */}
          <LinearGradient
            colors={[C.primary, C.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileHeader}
          >
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
                <Settings size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                {imageError ? (
                  <View style={styles.avatarFallback}>
                    <User size={32} color={C.primary} />
                  </View>
                ) : (
                  <Image 
                    source={profileUser.avatar} 
                    style={styles.avatar} 
                    onError={() => setImageError(true)}
                  />
                )}
                {profileUser.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={12} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profileUser.name}</Text>
                <View style={styles.userMeta}>
                  <Text style={styles.userTier}>{profileUser.accountType}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.userTier}>Member since {profileUser.joinDate}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <Icon size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>

          {/* Rewards Summary Card */}
          <LinearGradient
            colors={[C.primaryLight, C.bg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rewardsSummary}
          >
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Available Points</Text>
              <Text style={styles.pointsValue}>{profileUser.points}</Text>
              <TouchableOpacity style={styles.redeemBtn} onPress={() => navigateTo('/rewards')}>
                <Text style={styles.redeemText}>Redeem →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.rewardsActions}>
              <TouchableOpacity style={styles.rewardAction} onPress={() => navigateTo('/rewards')}>
                <Gift size={20} color={C.violet} />
                <Text style={styles.rewardActionText}>Redeem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rewardAction} onPress={() => navigateTo('/earn-points')}>
                <Star size={20} color={C.violet} />
                <Text style={styles.rewardActionText}>Earn More</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('personalInfo')}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              {personalInfoExpanded ? <ChevronDown size={20} color={C.textSub} /> : <ChevronRight size={20} color={C.textSub} />}
            </TouchableOpacity>
            
            {personalInfoExpanded && (
              <>
                <ProfileItem icon={<User size={20} color={C.violet} />} title="Full Name" value={profileUser.name} />
                <ProfileItem icon={<Mail size={20} color={C.violet} />} title="Email Address" value={profileUser.email} />
                <ProfileItem icon={<Phone size={20} color={C.violet} />} title="Phone Number" value={profileUser.phone} />
                <ProfileItem icon={<MapPin size={20} color={C.violet} />} title="Address" value={profileUser.address} />
                
                <View style={styles.paymentMethods}>
                  <Text style={styles.subSectionTitle}>Payment Methods</Text>
                  {paymentMethods.map((method) => (
                    <View key={method.id} style={styles.paymentMethod}>
                      <CreditCard size={16} color={C.textSub} />
                      <Text style={styles.paymentText}>{method.type} •••• {method.last4} (Expires {method.expiry})</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addButton} onPress={() => navigateTo('/settings/payment-methods')}>
                    <Text style={styles.addButtonText}>+ Add Payment Method</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Rewards Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('rewards')}>
              <Text style={styles.sectionTitle}>Earn More Points</Text>
              {rewardsExpanded ? <ChevronDown size={20} color={C.textSub} /> : <ChevronRight size={20} color={C.textSub} />}
            </TouchableOpacity>
            
            {rewardsExpanded && (
              <>
                {rewards.map((reward) => {
                  const Icon = reward.icon;
                  return (
                    <TouchableOpacity key={reward.id} style={styles.rewardCard}>
                      <View style={[styles.rewardIcon, reward.achieved && styles.rewardIconAchieved]}>
                        <Icon size={20} color={reward.achieved ? C.success : C.violet} />
                      </View>
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        <Text style={styles.rewardPoints}>{reward.points} points</Text>
                      </View>
                      {reward.achieved ? (
                        <View style={styles.achievedBadge}>
                          <Text style={styles.achievedText}>Earned</Text>
                        </View>
                      ) : (
                        <ChevronRight size={18} color={C.textSub} />
                      )}
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={styles.seeAllButton} onPress={() => navigateTo('/rewards')}>
                  <Text style={styles.seeAllText}>View All Rewards</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('account')}>
              <Text style={styles.sectionTitle}>Account</Text>
              {accountExpanded ? <ChevronDown size={20} color={C.textSub} /> : <ChevronRight size={20} color={C.textSub} />}
            </TouchableOpacity>
            
            {accountExpanded && (
              <>
                <AccountAction icon={Settings} label="Settings" onPress={() => setSettingsVisible(true)} />
                <AccountAction icon={HelpCircle} label="Help & Support" onPress={() => navigateTo('/settings/help-support')} />
                <AccountAction icon={Shield} label="Privacy Policy" onPress={() => navigateTo('/settings/privacy-policy')} />
                <AccountAction icon={Gift} label="Refer Friends" onPress={() => navigateTo('/settings/referral')} />
                <AccountAction icon={Lock} label="Change PIN" onPress={() => navigateTo('/settings/change-pin')} />
                <AccountAction 
                  icon={LogOut} 
                  label={isLoggingOut ? 'Logging out...' : 'Logout'} 
                  onPress={handleLogout}
                  isDanger
                  disabled={isLoggingOut}
                />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Settings Modal */}
      <Modal 
        animationType="slide" 
        transparent={false} 
        visible={settingsVisible} 
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={[C.primary, C.violet]} style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSettingsVisible(false)}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.modalContent}>
            {/* Appearance */}
            <SettingsSection title="Appearance" icon={Sun}>
              <SettingsItem 
                label="Dark Mode" 
                icon={darkMode ? Moon : Sun}
                type="switch"
                value={darkMode}
                onValueChange={setDarkMode}
              />
              <SettingsItem 
                label="Language" 
                value="English" 
                icon={Globe} 
                onPress={() => handleNavigateToSettings('/settings/language')} 
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications" icon={Bell}>
              <SettingsItem 
                label="Push Notifications" 
                icon={Bell}
                type="switch"
                value={pushNotifications}
                onValueChange={setPushNotifications}
              />
              <SettingsItem 
                label="Email Notifications" 
                icon={Mail}
                type="switch"
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
            </SettingsSection>

            {/* Security */}
            <SettingsSection title="Security" icon={Shield}>
              <SettingsItem 
                label="Two-Factor Authentication" 
                icon={Lock}
                type="switch"
                value={twoFactorAuth}
                onValueChange={setTwoFactorAuth}
              />
              <SettingsItem 
                label="Change Password" 
                icon={Lock} 
                onPress={() => handleNavigateToSettings('/settings/change-password')} 
              />
              <SettingsItem 
                label="Change PIN" 
                icon={Lock} 
                onPress={() => handleNavigateToSettings('/settings/change-pin')} 
              />
              <SettingsItem 
                label="Biometric Login" 
                icon={Smartphone} 
                type="switch" 
                value={false} 
                onValueChange={() => {}} 
              />
              <SettingsItem 
                label="Privacy Settings" 
                icon={Shield} 
                onPress={() => handleNavigateToSettings('/settings/privacy')} 
              />
            </SettingsSection>

            {/* Support */}
            <SettingsSection title="Support" icon={HelpCircle}>
              <SettingsItem 
                label="Help & Support" 
                icon={HelpCircle} 
                onPress={() => handleNavigateToSettings('/settings/help-support')} 
              />
              <SettingsItem 
                label="Refer Friends" 
                icon={Gift} 
                onPress={() => handleNavigateToSettings('/settings/referral')} 
              />
              <SettingsItem 
                label="Rate Us" 
                icon={Star} 
                onPress={() => {}} 
              />
            </SettingsSection>

            {/* About */}
            <SettingsSection title="About" icon={Info}>
              <SettingsItem 
                label="App Version" 
                value="1.0.0" 
                icon={Smartphone} 
                onPress={() => {}} 
              />
              <SettingsItem 
                label="Privacy Policy" 
                icon={Shield} 
                onPress={() => handleNavigateToSettings('/settings/privacy-policy')} 
              />
              <SettingsItem 
                label="Terms of Service" 
                icon={FileText} 
                onPress={() => handleNavigateToSettings('/settings/terms')} 
              />
            </SettingsSection>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

// Reusable Components
const ProfileItem = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
  <View style={styles.profileItem}>
    <View style={styles.itemIcon}>{icon}</View>
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

const AccountAction = ({ icon: Icon, label, onPress, isDanger, disabled }: any) => (
  <TouchableOpacity style={styles.accountAction} onPress={onPress} disabled={disabled}>
    <View style={[styles.actionIcon, isDanger && styles.actionIconDanger]}>
      <Icon size={20} color={isDanger ? C.error : C.violet} />
    </View>
    <Text style={[styles.actionText, isDanger && styles.actionTextDanger]}>{label}</Text>
    {!disabled && <ChevronRight size={18} color={C.textSub} />}
  </TouchableOpacity>
);

const SettingsSection = ({ title, icon: Icon, children }: any) => (
  <View style={styles.settingsSection}>
    <View style={styles.settingsSectionHeader}>
      <Icon size={20} color={C.violet} />
      <Text style={styles.settingsSectionTitle}>{title}</Text>
    </View>
    <View style={styles.settingsSectionContent}>{children}</View>
  </View>
);

const SettingsItem = ({ label, value, icon: Icon, type, onPress, onValueChange }: any) => {
  const ItemIcon = Icon;
  if (type === 'switch') {
    return (
      <View style={styles.settingsItem}>
        <View style={styles.settingsItemLeft}>
          <ItemIcon size={18} color={C.textSub} />
          <Text style={styles.settingsItemText}>{label}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: C.border, true: C.violet + '50' }}
          thumbColor={value ? C.violet : '#fff'}
        />
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <ItemIcon size={18} color={C.textSub} />
        <Text style={styles.settingsItemText}>{label}</Text>
      </View>
      {value && <Text style={styles.settingsItemValue}>{value}</Text>}
      <ChevronRight size={16} color={C.textSub} />
    </TouchableOpacity>
  );
};

// Add FileText icon import
import { FileText } from 'lucide-react-native';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, backgroundColor: C.bg },
  
  profileHeader: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  settingsButton: { padding: 8 },
  
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff' },
  avatarFallback: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: C.success, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userDetails: { flex: 1 },
  userName: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 6 },
  userMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userTier: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: -20, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: C.bg, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border, shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
  statLabel: { fontSize: 11, color: C.textSub },
  
  rewardsSummary: { marginHorizontal: 20, borderRadius: 20, padding: 16, flexDirection: 'row', borderWidth: 1, borderColor: C.border, marginBottom: 20 },
  pointsContainer: { flex: 1 },
  pointsLabel: { fontSize: 12, color: C.textSub, marginBottom: 4 },
  pointsValue: { fontSize: 28, fontWeight: '800', color: C.violet, marginBottom: 8 },
  redeemBtn: { alignSelf: 'flex-start' },
  redeemText: { fontSize: 12, color: C.violet, fontWeight: '600' },
  divider: { width: 1, backgroundColor: C.border, marginHorizontal: 16 },
  rewardsActions: { flex: 1, justifyContent: 'space-around' },
  rewardAction: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rewardActionText: { fontSize: 13, color: C.text, fontWeight: '500' },
  
  section: { backgroundColor: C.bg, marginHorizontal: 20, marginBottom: 16, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  
  profileItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  itemIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 12, color: C.textSub, marginBottom: 2 },
  itemValue: { fontSize: 15, fontWeight: '500', color: C.text },
  
  paymentMethods: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  subSectionTitle: { fontSize: 15, fontWeight: '600', color: C.primary, marginBottom: 12 },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  paymentText: { fontSize: 13, color: C.text },
  addButton: { marginTop: 8, padding: 12, backgroundColor: C.primaryLight, borderRadius: 12, alignItems: 'center' },
  addButtonText: { fontSize: 14, fontWeight: '600', color: C.violet },
  
  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primaryLight, borderRadius: 14, padding: 12, marginBottom: 12 },
  rewardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rewardIconAchieved: { backgroundColor: C.success + '20' },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  rewardPoints: { fontSize: 12, color: C.textSub },
  achievedBadge: { backgroundColor: C.success + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  achievedText: { fontSize: 10, fontWeight: '600', color: C.success },
  seeAllButton: { marginTop: 8, padding: 12, backgroundColor: C.primaryLight, borderRadius: 12, alignItems: 'center' },
  seeAllText: { fontSize: 14, fontWeight: '600', color: C.violet },
  
  accountAction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actionIconDanger: { backgroundColor: C.error + '10' },
  actionText: { flex: 1, fontSize: 15, fontWeight: '500', color: C.text },
  actionTextDanger: { color: C.error },
  
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: C.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  modalClose: { padding: 8 },
  modalContent: { paddingHorizontal: 20, paddingTop: 20 },
  
  settingsSection: { marginBottom: 24 },
  settingsSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  settingsSectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  settingsSectionContent: { backgroundColor: C.primaryLight, borderRadius: 16, overflow: 'hidden' },
  settingsItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingsItemText: { fontSize: 15, color: C.text, flex: 1 },
  settingsItemValue: { fontSize: 13, color: C.textSub, marginRight: 8 },
});

export default Me;