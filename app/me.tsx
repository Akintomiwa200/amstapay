import { ChevronRight, ChevronDown, Gift, LogOut, Mail, Phone, Settings, Star, User, Zap, X, CreditCard, MapPin, HelpCircle, Shield, Bell } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View, Modal, Switch } from 'react-native';
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
 

const Me = () => {
   const { user, logout } = useAuth();
  const router = useRouter();
  
  // State for settings modal
  const [settingsVisible, setSettingsVisible] = useState(false);
  
  // State for collapsible sections
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true);
  const [rewardsExpanded, setRewardsExpanded] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [settingsSections, setSettingsSections] = useState({
    appearance: true,
    notifications: true,
    privacy: true
  });
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
  avatar: user?.avatar ? { uri: user.avatar } : require("../assets/images/logo.png"),
  points: user?.points ?? 0,
  address: user?.address || "Not provided",
};


const paymentMethods = [
  { id: '1', type: 'Visa', last4: '1234' },
  { id: '2', type: 'Mastercard', last4: '5678' },
];


  // Mock reward data
  const rewards = [
    { id: 1, title: 'Welcome Bonus', points: 50, icon: <Star size={24} color="#FF8C00" /> },
    { id: 2, title: 'First Transaction', points: 100, icon: <Zap size={24} color="#FF8C00" /> },
    { id: 3, title: 'Referral Bonus', points: 200, icon: <Gift size={24} color="#FF8C00" /> },
  ];

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const handleLogout = async () => {
    try {
      // Show confirmation dialog
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              try {
                setIsLoggingOut(true);
                
                // Clear all data using SecureStore
                await SecureStore.deleteItemAsync('authToken');
                await SecureStore.deleteItemAsync('refreshToken');
                await SecureStore.deleteItemAsync('userData');
                await SecureStore.deleteItemAsync('userPreferences');
                await SecureStore.deleteItemAsync('recentTransactions');
                await SecureStore.deleteItemAsync('cachedBalance');
                
                // Use the logout function from AuthContext
                await logout();
                
                // Reset navigation state and redirect to login
                router.replace('/login');
                
                // Show success message
                Toast.show({
                  type: 'success',
                  text1: 'Logged out successfully',
                  position: 'bottom',
                });
                
                console.log('User logged out successfully');
                
              } catch (error) {
                console.error('Logout error:', error);
                Toast.show({
                  type: 'error',
                  text1: 'Logout failed',
                  text2: 'Please try again',
                  position: 'bottom',
                });
              } finally {
                setIsLoggingOut(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Logout confirmation error:', error);
    }
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  const toggleSection = (section: string) => {
    switch(section) {
      case 'personalInfo':
        setPersonalInfoExpanded(!personalInfoExpanded);
        break;
      case 'rewards':
        setRewardsExpanded(!rewardsExpanded);
        break;
      case 'account':
        setAccountExpanded(!accountExpanded);
        break;
      default:
        break;
    }
  };

  const toggleSettingsSection = (section: string) => {
    setSettingsSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <>
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Image source={profileUser.avatar} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{profileUser.name}</Text>
              <Text style={styles.userTier}>{profileUser.accountType}</Text>
            </View>
          </View>
        </View>

        {/* Rewards Summary */}
        <View style={styles.rewardsSummary}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Available Points</Text>
            <Text style={styles.pointsValue}>{profileUser.points}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rewardsActions}>
            <TouchableOpacity style={styles.rewardAction}>
              <Gift size={20} color="#FF8C00" />
              <Text style={styles.rewardActionText}>Redeem</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.rewardAction}
              onPress={() => navigateTo('/rewards')}
            >
              <Star size={20} color="#FF8C00" />
              <Text style={styles.rewardActionText}>Earn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('personalInfo')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {personalInfoExpanded ? 
              <ChevronDown size={20} color="#666666" /> : 
              <ChevronRight size={20} color="#666666" />
            }
          </TouchableOpacity>
          
          {personalInfoExpanded && (
            <>
              <ProfileItem 
                icon={<User size={20} color="#666666" />}
                title="Name"
                value={profileUser.name}
              />
              <ProfileItem 
                icon={<Mail size={20} color="#666666" />}
                title="Email"
                value={profileUser.email}
              />
              <ProfileItem 
                icon={<Phone size={20} color="#666666" />}
                title="Phone"
                value={profileUser.phone}
              />
              <ProfileItem 
                icon={<MapPin size={20} color="#666666" />}
                title="Address"
                value={profileUser.address}
              />
              <View style={styles.paymentMethods}>
                <Text style={styles.subSectionTitle}>Payment Methods</Text>
                {paymentMethods.map((method) => (
                  <View key={method.id} style={styles.paymentMethod}>
                    <CreditCard size={16} color="#666666" />
                    <Text style={styles.paymentText}>{method.type} •••• {method.last4}</Text>
                  </View>
                ))}
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => navigateTo('/payment-methods')}
                >
                  <Text style={styles.addButtonText}>Add Payment Method</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('rewards')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Earn More Points</Text>
            {rewardsExpanded ? 
              <ChevronDown size={20} color="#666666" /> : 
              <ChevronRight size={20} color="#666666" />
            }
          </TouchableOpacity>
          
          {rewardsExpanded && (
            <>
              {rewards.map((reward) => (
                <TouchableOpacity key={reward.id} style={styles.rewardCard}>
                  <View style={styles.rewardIcon}>{reward.icon}</View>
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardPoints}>{reward.points} points</Text>
                  </View>
                  <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => navigateTo('/reward')}
              >
                <Text style={styles.seeAllText}>See All Rewards</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('account')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Account</Text>
            {accountExpanded ? 
              <ChevronDown size={20} color="#666666" /> : 
              <ChevronRight size={20} color="#666666" />
            }
          </TouchableOpacity>
          
          {accountExpanded && (
            <>
              <TouchableOpacity 
                style={styles.accountAction} 
                onPress={handleSettingsPress}
              >
                <View style={styles.actionIcon}>
                  <Settings size={20} color="#666666" />
                </View>
                <Text style={styles.actionText}>Settings</Text>
                <ChevronRight size={20} color="#666666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.accountAction}
                onPress={() => navigateTo('/help-support')}
              >
                <View style={styles.actionIcon}>
                  <HelpCircle size={20} color="#666666" />
                </View>
                <Text style={styles.actionText}>Help & Support</Text>
                <ChevronRight size={20} color="#666666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.accountAction}
                onPress={() => navigateTo('/privacy-policy')}
              >
                <View style={styles.actionIcon}>
                  <Shield size={20} color="#666666" />
                </View>
                <Text style={styles.actionText}>Privacy Policy</Text>
                <ChevronRight size={20} color="#666666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.accountAction}
                onPress={() => navigateTo('/referral')}
              >
                <View style={styles.actionIcon}>
                  <Gift size={20} color="#666666" />
                </View>
                <Text style={styles.actionText}>Refer Friends</Text>
                <ChevronRight size={20} color="#666666" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.accountAction} onPress={handleLogout}>
                <View style={[styles.actionIcon, styles.logoutIcon]}>
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text style={[styles.actionText, styles.logoutText]}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Text>
                {isLoggingOut ? null : <ChevronRight size={20} color="#666666" />}
              </TouchableOpacity>
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
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSettingsVisible(false)}
            >
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.settingsContent}>
            {/* Appearance Section */}
            <View style={styles.settingsSection}>
              <TouchableOpacity 
                style={styles.settingsSectionHeader}
                onPress={() => toggleSettingsSection('appearance')}
                activeOpacity={0.7}
              >
                <Text style={styles.settingsSectionTitle}>Appearance</Text>
                {settingsSections.appearance ? 
                  <ChevronDown size={20} color="#666666" /> : 
                  <ChevronRight size={20} color="#666666" />
                }
              </TouchableOpacity>
              
              {settingsSections.appearance && (
                <>
                  <View style={styles.settingsItem}>
                    <Text style={styles.settingsItemText}>Dark Mode</Text>
                    <Switch
                      value={darkMode}
                      onValueChange={setDarkMode}
                      trackColor={{ false: '#E5E7EB', true: '#FF8C00' }}
                      thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
                    />
                  </View>
                  <TouchableOpacity style={styles.settingsItem}>
                    <Text style={styles.settingsItemText}>Language</Text>
                    <Text style={styles.settingsValue}>English</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            {/* Notifications Section */}
            <View style={styles.settingsSection}>
              <TouchableOpacity 
                style={styles.settingsSectionHeader}
                onPress={() => toggleSettingsSection('notifications')}
                activeOpacity={0.7}
              >
                <Text style={styles.settingsSectionTitle}>Notifications</Text>
                {settingsSections.notifications ? 
                  <ChevronDown size={20} color="#666666" /> : 
                  <ChevronRight size={20} color="#666666" />
                }
              </TouchableOpacity>
              
              {settingsSections.notifications && (
                <>
                  <View style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                      <Bell size={20} color="#666666" style={styles.settingIcon} />
                      <Text style={styles.settingsItemText}>Push Notifications</Text>
                    </View>
                    <Switch
                      value={pushNotifications}
                      onValueChange={setPushNotifications}
                      trackColor={{ false: '#E5E7EB', true: '#FF8C00' }}
                      thumbColor={pushNotifications ? '#FFFFFF' : '#FFFFFF'}
                    />
                  </View>
                  <View style={styles.settingsItem}>
                    <View style={styles.settingsItemLeft}>
                      <Mail size={20} color="#666666" style={styles.settingIcon} />
                      <Text style={styles.settingsItemText}>Email Notifications</Text>
                    </View>
                    <Switch
                      value={emailNotifications}
                      onValueChange={setEmailNotifications}
                      trackColor={{ false: '#E5E7EB', true: '#FF8C00' }}
                      thumbColor={emailNotifications ? '#FFFFFF' : '#FFFFFF'}
                    />
                  </View>
                </>
              )}
            </View>
            
            {/* Privacy & Security Section */}
            <View style={styles.settingsSection}>
              <TouchableOpacity 
                style={styles.settingsSectionHeader}
                onPress={() => toggleSettingsSection('privacy')}
                activeOpacity={0.7}
              >
                <Text style={styles.settingsSectionTitle}>Privacy & Security</Text>
                {settingsSections.privacy ? 
                  <ChevronDown size={20} color="#666666" /> : 
                  <ChevronRight size={20} color="#666666" />
                }
              </TouchableOpacity>
              
              {settingsSections.privacy && (
                <>
                  <TouchableOpacity 
                    style={styles.settingsItem}
                    onPress={() => navigateTo('/change-pin')}
                  >
                    <Text style={styles.settingsItemText}>Change PIN</Text>
                    <ChevronRight size={20} color="#666666" />
                  </TouchableOpacity>
                  <View style={styles.settingsItem}>
                    <Text style={styles.settingsItemText}>Two-Factor Authentication</Text>
                    <Switch
                      value={twoFactorAuth}
                      onValueChange={setTwoFactorAuth}
                      trackColor={{ false: '#E5E7EB', true: '#FF8C00' }}
                      thumbColor={twoFactorAuth ? '#FFFFFF' : '#FFFFFF'}
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.settingsItem}
                    onPress={() => navigateTo('/privacy-policy')}
                  >
                    <Text style={styles.settingsItemText}>Data & Privacy</Text>
                    <ChevronRight size={20} color="#666666" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#FF8C00',
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
    borderColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
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
    color: '#666666',
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    color: '#FF8C00',
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
    color: '#000000',
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
    color: '#000000',
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
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: '#666666',
    fontSize: 14,
  },
  itemValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  paymentMethods: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentText: {
    marginLeft: 8,
    color: '#666666',
  },
  addButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
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
    backgroundColor: '#FFF4E6',
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
  seeAllButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  seeAllText: {
    color: '#FF8C00',
    fontWeight: '500',
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
    color: '#000000',
    fontWeight: '500',
  },
  logoutText: {
    color: '#EF4444',
  },
  // Settings Modal Styles
  settingsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  settingsContent: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#000000',
  },
  settingsValue: {
    fontSize: 14,
    color: '#666666',
  },
});

export default Me;