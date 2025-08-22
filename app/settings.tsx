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
  Moon,
  Shield,
  Star,
  User,
  Users,
  Wallet,
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
} from 'react-native';

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
  iconColor = '#FF8C00',
  showDivider = true,
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
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <Icon size={20} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {showSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: '#D1D5DB', true: '#FFE0B2' }}
              thumbColor={switchValue ? '#FF8C00' : '#F3F4F6'}
            />
          ) : (
            showArrow && <ChevronRight size={20} color="#9CA3AF" />
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
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
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
    support: false
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedSections]
    }));
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Account Section */}
        <SettingSection 
          title="Account" 
          isExpanded={expandedSections.account} 
          onToggle={() => toggleSection('account')}
        >
          <SettingItem
            icon={User}
            title="Profile Information"
            subtitle="Update your personal details, profile photo"
            onPress={() => navigateTo('/profile')}
          />
          
          <SettingItem
            icon={Wallet}
            title="Wallet Balance"
            subtitle="Current balance: ₦245.50"
            onPress={() => navigateTo('/wallet')}
          />
          
          <SettingItem
            icon={CreditCard}
            title="Payment Methods"
            subtitle="2 cards added • 1 bank account"
            onPress={() => navigateTo('/payment-methods')}
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
            subtitle="Last changed: 3 months ago"
            onPress={() => navigateTo('/change-pin')}
          />
          
          <SettingItem
            icon={Shield}
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID for login"
            showSwitch={true}
            switchValue={biometricEnabled}
            onSwitchChange={setBiometricEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon={FileText}
            title="Privacy Policy"
            subtitle="Last updated: January 2023"
            onPress={() => navigateTo('/privacy-policy')}
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
            subtitle="FAQs, contact support, report issues"
            onPress={() => navigateTo('/help-support')}
          />
          
          <SettingItem
            icon={Users}
            title="Refer Friends"
            subtitle="Invite friends and earn rewards"
            onPress={() => navigateTo('/referral')}
            showDivider={false}
          />
        </SettingSection>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  settingRight: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
    marginRight: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 12,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});