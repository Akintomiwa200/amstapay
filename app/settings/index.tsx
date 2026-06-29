// app/settings/index.tsx
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  Shield,
  Star,
  Sun,
  User,
  Users,
  Wallet,
  Globe,
  Zap,
  Mail,
  Fingerprint,
  Eye,
  RefreshCw,
  Smartphone,
  Award,
} from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { BiometricAuth } from '@/utils/biometric';
import { useAuth } from '@/context/AuthContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { authService } from '@/services/auth';
import { storage } from '@/lib/storage';

type SettingItemProps = {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle?: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  iconColor?: string;
  showDivider?: boolean;
  isDanger?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  iconColor: iconColorProp,
  showDivider = true,
  isDanger = false,
  isFirst = false,
  isLast = false,
}) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const iconColor = iconColorProp ?? c.violet;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.settingItem,
          isFirst && styles.settingItemFirst,
          isLast && styles.settingItemLast,
        ]}
        onPress={onPress}
        disabled={showSwitch}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <View style={[
            styles.iconContainer, 
            { backgroundColor: isDanger ? `${c.error}15` : `${iconColor}15` }
          ]}>
            <Icon size={20} color={isDanger ? c.error : iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.settingTitle, isDanger && { color: c.error }, !isDanger && { color: c.text }]}>
              {title}
            </Text>
            {subtitle && <Text style={[styles.settingSubtitle, { color: c.textSub }]}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {showSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: c.border, true: c.violet }}
              thumbColor={switchValue ? '#fff' : '#fff'}
            />
          ) : (
            showArrow && <ChevronRight size={20} color={c.textSub} />
          )}
        </View>
      </TouchableOpacity>
      {showDivider && <View style={[styles.divider, { backgroundColor: c.border }]} />}
    </>
  );
};

const Settings: React.FC = () => {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const c = theme.colors;
  const { user, logout, deleteAccount } = useAuth();
  const { currency, locale, notificationPrefs, updateNotificationPrefs } = usePersonalization();

  const currencyLabel = {
    NGN: 'Nigerian Naira (NGN)',
    USD: 'US Dollar (USD)',
    GBP: 'British Pound (GBP)',
    EUR: 'Euro (EUR)',
    GHS: 'Ghanaian Cedi (GHS)',
    KES: 'Kenyan Shilling (KES)',
    ZAR: 'South African Rand (ZAR)',
  }[currency] || currency;

  const languageLabel = {
    en: 'English',
    ha: 'Hausa',
    ig: 'Igbo',
    yo: 'Yoruba',
    fr: 'French',
    ar: 'Arabic',
  }[locale.split('-')[0]] || 'English';
  
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    preferences: false,
    security: false,
    notifications: false,
    support: false,
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(notificationPrefs.pushEnabled);
  const [emailEnabled, setEmailEnabled] = useState(notificationPrefs.emailEnabled);
  const [transactionAlerts, setTransactionAlerts] = useState(notificationPrefs.transactionAlerts);
  const [securityAlerts, setSecurityAlerts] = useState(notificationPrefs.securityAlerts);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  useEffect(() => {
    setNotificationsEnabled(notificationPrefs.pushEnabled);
    setEmailEnabled(notificationPrefs.emailEnabled);
    setTransactionAlerts(notificationPrefs.transactionAlerts);
    setSecurityAlerts(notificationPrefs.securityAlerts);
  }, [notificationPrefs]);

  useFocusEffect(
    useCallback(() => {
      checkBiometricStatus();
      loadSettings();
    }, [])
  );

  const checkBiometricStatus = async () => {
    const available = await BiometricAuth.isAvailable();
    setBiometricAvailable(available);
    if (available) {
      const enabled = await BiometricAuth.isEnabled();
      setBiometricEnabled(enabled);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await authService.get2FAStatus();
      const data = (res as { data?: { enabled: boolean } })?.data ?? res;
      const enabled = (data as { enabled?: boolean })?.enabled ?? false;
      setTwoFactorEnabled(enabled);
      await storage.set('twoFactorEnabled', enabled);
    } catch {
      const cached = await storage.get<boolean | string>('twoFactorEnabled');
      setTwoFactorEnabled(cached === true || cached === 'true');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedSections]
    }));
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value && biometricAvailable) {
      const authenticated = await BiometricAuth.authenticate('Authenticate to enable biometric login');
      if (!authenticated) {
        Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again.');
        return;
      }
    }
    await BiometricAuth.setEnabled(value);
    setBiometricEnabled(value);
  };

  const handleTwoFactorPress = () => {
    navigateTo('/settings/two-factor');
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              console.error('Logout failed:', error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is irreversible. All your data, wallet balance, and transaction history will be permanently deleted.\n\nAre you sure you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete My Account",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount();
              router.replace('/login');
            } catch (error) {
              console.error('Delete account failed:', error);
              Alert.alert("Error", "Failed to delete account. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderSettingGroup = (
    items: {
      icon: React.ComponentType<{ size: number; color: string }>;
      title: string;
      subtitle?: string;
      onPress?: () => void;
      showSwitch?: boolean;
      switchValue?: boolean;
      onSwitchChange?: (value: boolean) => void;
      showArrow?: boolean;
      isDanger?: boolean;
    }[]
  ) => {
    return items.map((item, index) => (
      <SettingItem
        key={item.title}
        icon={item.icon}
        title={item.title}
        subtitle={item.subtitle}
        onPress={item.onPress}
        showSwitch={item.showSwitch}
        switchValue={item.switchValue}
        onSwitchChange={item.onSwitchChange}
        showArrow={item.showArrow !== undefined ? item.showArrow : true}
        isDanger={item.isDanger}
        isFirst={index === 0}
        isLast={index === items.length - 1}
        showDivider={index !== items.length - 1}
      />
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[c.primary, c.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <SettingsIcon size={28} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your account & preferences</Text>
          </View>
        </LinearGradient>

        {/* Account Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('account')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: `${c.violet}15` }]}>
                <User size={18} color={c.violet} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
            </View>
            {expandedSections.account ? (
              <ChevronRight size={20} color={c.textSub} style={{ transform: [{ rotate: '90deg' }] }} />
            ) : (
              <ChevronRight size={20} color={c.textSub} />
            )}
          </TouchableOpacity>
          
          {expandedSections.account && (
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
              {renderSettingGroup([
                {
                  icon: User,
                  title: "Profile Information",
                  subtitle: user?.fullName || "Update your personal details",
                  onPress: () => navigateTo('/settings/profile'),
                },
                {
                  icon: Wallet,
                  title: "Wallet",
                  subtitle: "Manage your funds & balance",
                  onPress: () => navigateTo('/settings/wallet'),
                },
                {
                  icon: CreditCard,
                  title: "Payment Methods",
                  subtitle: "Manage cards and accounts",
                  onPress: () => navigateTo('/settings/payment-methods'),
                  showArrow: true,
                },
              ])}
            </View>
          )}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('preferences')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: `${c.blue}15` }]}>
                {isDarkMode ? <Moon size={18} color={c.blue} /> : <Sun size={18} color={c.blue} />}
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
            </View>
            {expandedSections.preferences ? (
              <ChevronRight size={20} color={c.textSub} style={{ transform: [{ rotate: '90deg' }] }} />
            ) : (
              <ChevronRight size={20} color={c.textSub} />
            )}
          </TouchableOpacity>
          
          {expandedSections.preferences && (
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
              {renderSettingGroup([
                {
                  icon: isDarkMode ? Moon : Sun,
                  title: "Dark Mode",
                  subtitle: "Switch between light and dark theme",
                  showSwitch: true,
                  switchValue: isDarkMode,
                  onSwitchChange: toggleTheme,
                  showArrow: false,
                },
                {
                  icon: Globe,
                  title: "Language",
                  subtitle: languageLabel,
                  onPress: () => navigateTo('/settings/language'),
                },
                {
                  icon: Wallet,
                  title: "Currency",
                  subtitle: currencyLabel,
                  onPress: () => navigateTo('/settings/currency'),
                  showArrow: true,
                },
              ])}
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('notifications')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: `${c.mint}15` }]}>
                <Bell size={18} color={c.mint} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
            </View>
            {expandedSections.notifications ? (
              <ChevronRight size={20} color={c.textSub} style={{ transform: [{ rotate: '90deg' }] }} />
            ) : (
              <ChevronRight size={20} color={c.textSub} />
            )}
          </TouchableOpacity>
          
          {expandedSections.notifications && (
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
              {renderSettingGroup([
                {
                  icon: Bell,
                  title: "Push Notifications",
                  subtitle: "Receive alerts on your device",
                  showSwitch: true,
                  switchValue: notificationsEnabled,
                  onSwitchChange: (v) => {
                    setNotificationsEnabled(v);
                    updateNotificationPrefs({ pushEnabled: v });
                  },
                  showArrow: false,
                },
                {
                  icon: Mail,
                  title: "Email Notifications",
                  subtitle: "Get updates via email",
                  showSwitch: true,
                  switchValue: emailEnabled,
                  onSwitchChange: (v) => {
                    setEmailEnabled(v);
                    updateNotificationPrefs({ emailEnabled: v });
                  },
                  showArrow: false,
                },
                {
                  icon: Zap,
                  title: "Transaction Alerts",
                  subtitle: "Notify for every transaction",
                  showSwitch: true,
                  switchValue: transactionAlerts,
                  onSwitchChange: (v) => {
                    setTransactionAlerts(v);
                    updateNotificationPrefs({ transactionAlerts: v });
                  },
                  showArrow: false,
                },
                {
                  icon: Shield,
                  title: "Security Alerts",
                  subtitle: "Login and PIN change notifications",
                  showSwitch: true,
                  switchValue: securityAlerts,
                  onSwitchChange: (v) => {
                    setSecurityAlerts(v);
                    updateNotificationPrefs({ securityAlerts: v });
                  },
                  showArrow: false,
                },
              ])}
            </View>
          )}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('security')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: `${c.pink}15` }]}>
                <Shield size={18} color={c.pink} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Security & Privacy</Text>
            </View>
            {expandedSections.security ? (
              <ChevronRight size={20} color={c.textSub} style={{ transform: [{ rotate: '90deg' }] }} />
            ) : (
              <ChevronRight size={20} color={c.textSub} />
            )}
          </TouchableOpacity>
          
          {expandedSections.security && (
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
              {renderSettingGroup([
                {
                  icon: Lock,
                  title: "Change PIN",
                  subtitle: "Update your transaction PIN",
                  onPress: () => navigateTo('/settings/change-pin'),
                },
                {
                  icon: Lock,
                  title: "Change Password",
                  subtitle: "Update your login password",
                  onPress: () => navigateTo('/settings/change-password'),
                },
                {
                  icon: Award,
                  title: "KYC Verification",
                  subtitle: user?.kycLevel && user.kycLevel >= 2 ? 'Identity verified' : 'Upload ID to verify your account',
                  onPress: () => navigateTo('/settings/kyc'),
                },
                {
                  icon: Fingerprint,
                  title: "Biometric Authentication",
                  subtitle: !biometricAvailable ? 'Not available on this device' : biometricEnabled ? 'Fingerprint or Face ID enabled' : 'Use fingerprint or face ID',
                  showSwitch: true,
                  switchValue: biometricEnabled,
                  onSwitchChange: handleBiometricToggle,
                  showArrow: false,
                },
                {
                  icon: Shield,
                  title: "Two-Factor Authentication",
                  subtitle: twoFactorEnabled ? 'Extra security layer active' : 'Add extra security layer',
                  onPress: handleTwoFactorPress,
                },
                {
                  icon: Smartphone,
                  title: "Active Sessions",
                  subtitle: "Manage devices signed in to your account",
                  onPress: () => navigateTo('/settings/sessions'),
                },
                {
                  icon: Eye,
                  title: "Privacy Settings",
                  subtitle: "Manage your data privacy",
                  onPress: () => navigateTo('/settings/privacy'),
                },
                {
                  icon: FileText,
                  title: "Privacy Policy",
                  subtitle: "Read our privacy policy",
                  onPress: () => navigateTo('/settings/privacy-policy'),
                  showArrow: true,
                },
                {
                  icon: Trash2,
                  title: "Delete Account",
                  subtitle: "Permanently delete your account and data",
                  onPress: handleDeleteAccount,
                  isDanger: true,
                },
              ])}
            </View>
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('support')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: `${c.blue}15` }]}>
                <HelpCircle size={18} color={c.blue} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
            </View>
            {expandedSections.support ? (
              <ChevronRight size={20} color={c.textSub} style={{ transform: [{ rotate: '90deg' }] }} />
            ) : (
              <ChevronRight size={20} color={c.textSub} />
            )}
          </TouchableOpacity>
          
          {expandedSections.support && (
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
              {renderSettingGroup([
                {
                  icon: HelpCircle,
                  title: "Help & Support",
                  subtitle: "FAQs and contact support",
                  onPress: () => navigateTo('/settings/help-support'),
                },
                {
                  icon: Users,
                  title: "Refer Friends",
                  subtitle: "Invite and earn rewards",
                  onPress: () => navigateTo('/settings/referral'),
                },
                {
                  icon: Star,
                  title: "Rate Us",
                  subtitle: "Rate us on the app store",
                  onPress: () => navigateTo('/settings/rate-us'),
                },
                {
                  icon: RefreshCw,
                  title: "About",
                  subtitle: "App version and information",
                  onPress: () => navigateTo('/settings/about'),
                  showArrow: true,
                },
              ])}
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={[styles.logoutButton, { borderColor: c.error }]}
            onPress={handleLogout}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={c.error} />
            ) : (
              <>
                <LogOut size={20} color={c.error} />
                <Text style={[styles.logoutText, { color: c.error }]}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textSub }]}>
            AmstaPay v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'transparent',
  },
  settingItemFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  settingItemLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingTitleDanger: {},
  settingSubtitle: {
    fontSize: 12,
  },
  settingRight: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginLeft: 70,
  },
  logoutContainer: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
