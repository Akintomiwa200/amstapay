// app/settings/index.tsx
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  Star,
  Sun,
  User,
  Users,
  Wallet,
  Globe,
  Award,
  Zap,
  Mail,
  Phone,
  MapPin,
  Fingerprint,
  Eye,
  RefreshCw,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '@/components/dashboardComponent/colors';

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
};

type SettingSectionProps = {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
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
  iconColor = C.violet,
  showDivider = true,
  isDanger = false,
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={showSwitch}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <Icon size={20} color={isDanger ? C.error : iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.settingTitle, isDanger && styles.settingTitleDanger]}>
              {title}
            </Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {showSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: C.border, true: C.violet + '50' }}
              thumbColor={switchValue ? C.violet : '#fff'}
            />
          ) : (
            showArrow && <ChevronRight size={20} color={C.textSub} />
          )}
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
};

const SettingSection: React.FC<SettingSectionProps> = ({ 
  title, 
  children, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity onPress={onToggle} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {isExpanded ? (
          <ChevronUp size={20} color={C.textSub} />
        ) : (
          <ChevronDown size={20} color={C.textSub} />
        )}
      </TouchableOpacity>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const Settings: React.FC = () => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    preferences: false,
    security: false,
    notifications: false,
    support: false,
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedSections]
    }));
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
          onPress: () => router.replace('/login')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={[C.primaryLight, C.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Section */}
        <SettingSection 
          title="Account" 
          isExpanded={expandedSections.account} 
          onToggle={() => toggleSection('account')}
        >
          <SettingItem
            icon={User}
            title="Profile Information"
            subtitle="Update your personal details"
            onPress={() => navigateTo('/settings/profile')}
          />
          
          <SettingItem
            icon={Wallet}
            title="Wallet Balance"
            subtitle="Manage your funds"
            onPress={() => navigateTo('/settings/wallet')}
          />
          
          <SettingItem
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Manage cards and accounts"
            onPress={() => navigateTo('/settings/payment-methods')}
            showDivider={false}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection 
          title="Preferences" 
          isExpanded={expandedSections.preferences} 
          onToggle={() => toggleSection('preferences')}
        >
          <SettingItem
            icon={darkModeEnabled ? Moon : Sun}
            title="Dark Mode"
            subtitle="Switch between light and dark theme"
            showSwitch={true}
            switchValue={darkModeEnabled}
            onSwitchChange={setDarkModeEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English"
            onPress={() => navigateTo('/settings/language')}
          />
          
          <SettingItem
            icon={Bell}
            title="Currency"
            subtitle="Nigerian Naira (NGN)"
            onPress={() => navigateTo('/settings/currency')}
            showDivider={false}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection 
          title="Notifications" 
          isExpanded={expandedSections.notifications} 
          onToggle={() => toggleSection('notifications')}
        >
          <SettingItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive alerts on your device"
            showSwitch={true}
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon={Mail}
            title="Email Notifications"
            subtitle="Get updates via email"
            showSwitch={true}
            switchValue={emailEnabled}
            onSwitchChange={setEmailEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon={Zap}
            title="Transaction Alerts"
            subtitle="Notify for every transaction"
            showSwitch={true}
            switchValue={true}
            onSwitchChange={() => {}}
            showArrow={false}
            showDivider={false}
          />
        </SettingSection>

        {/* Security Section */}
        <SettingSection 
          title="Security & Privacy" 
          isExpanded={expandedSections.security} 
          onToggle={() => toggleSection('security')}
        >
          <SettingItem
            icon={Lock}
            title="Change PIN"
            subtitle="Update your transaction PIN"
            onPress={() => navigateTo('/settings/change-pin')}
          />
          
          <SettingItem
            icon={Lock}
            title="Change Password"
            subtitle="Update your login password"
            onPress={() => navigateTo('/settings/change-password')}
          />
          
          <SettingItem
            icon={Fingerprint}
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            showSwitch={true}
            switchValue={biometricEnabled}
            onSwitchChange={setBiometricEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon={Shield}
            title="Two-Factor Authentication"
            subtitle="Add extra security layer"
            showSwitch={true}
            switchValue={twoFactorEnabled}
            onSwitchChange={setTwoFactorEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon={Eye}
            title="Privacy Settings"
            subtitle="Manage your data privacy"
            onPress={() => navigateTo('/settings/privacy')}
          />
          
          <SettingItem
            icon={FileText}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => navigateTo('/settings/privacy-policy')}
            showDivider={false}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection 
          title="Support" 
          isExpanded={expandedSections.support} 
          onToggle={() => toggleSection('support')}
        >
          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="FAQs and contact support"
            onPress={() => navigateTo('/settings/help-support')}
          />
          
          <SettingItem
            icon={Users}
            title="Refer Friends"
            subtitle="Invite and earn rewards"
            onPress={() => navigateTo('/settings/referral')}
          />
          
          <SettingItem
            icon={Star}
            title="Rate Us"
            subtitle="Rate us on the app store"
            onPress={() => navigateTo('/settings/rate-us')}
          />
          
          <SettingItem
            icon={RefreshCw}
            title="About"
            subtitle="App version and information"
            onPress={() => navigateTo('/settings/about')}
            showDivider={false}
          />
        </SettingSection>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <SettingItem
            icon={LogOut}
            title="Logout"
            iconColor={C.error}
            onPress={handleLogout}
            showArrow={false}
            showDivider={false}
            isDanger={true}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AmstaPay Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.primary,
    letterSpacing: 0.3,
  },
  sectionContent: {
    backgroundColor: C.bg,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -4,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: C.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: C.bg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
    color: C.text,
    marginBottom: 2,
  },
  settingTitleDanger: {
    color: C.error,
  },
  settingSubtitle: {
    fontSize: 12,
    color: C.textSub,
  },
  settingRight: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginLeft: 74,
  },
  logoutContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 12,
  },
  versionText: {
    fontSize: 12,
    color: C.textSub,
    fontWeight: '500',
  },
});