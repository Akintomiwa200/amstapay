// app/me/index.tsx
import {
  ChevronRight,
  ChevronDown,
  Gift,
  LogOut,
  Mail,
  Phone,
  FileText,
  Settings,
  Star,
  User,
  Zap,
  X,
  CreditCard,
  MapPin,
  HelpCircle,
  Shield,
  Bell,
  Award,
  TrendingUp,
  Wallet,
  Lock,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Info,
  Fingerprint,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  Modal,
  Switch,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { usePersonalization } from "@/context/PersonalizationContext";
import { useSocket } from "@/context/SocketContext";
import { formatMoney } from "@/lib/format";
import { walletService } from "@/services/wallet";
import { transactionService } from "@/services/transactions";
import { cashbackService } from "@/services/cashback";
import { beneficiaryService } from "@/services/beneficiary";
import { cardService } from "@/services/cards";
import { referralService } from "@/services/referral";
import { parseList } from "@/lib/parse";
import { authService } from "@/services/auth";
import { storage } from "@/lib/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BiometricAuth } from "@/utils/biometric";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const Me = () => {
  const { user, logout, getWalletBalance, getTransactions } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { currency, notificationPrefs, updateNotificationPrefs } = usePersonalization();
  const { socket } = useSocket();
  const c = theme.colors;
  const router = useRouter();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true);
  const [rewardsExpanded, setRewardsExpanded] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [points, setPoints] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<{ id: string; type: string; last4: string; expiry?: string }[]>([]);

  // Settings states
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [pushNotifications, setPushNotifications] = useState(notificationPrefs.pushEnabled);
  const [emailNotifications, setEmailNotifications] = useState(notificationPrefs.emailEnabled);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const profileUser = {
    name: user?.fullName || user?.name || "Guest",
    email: user?.email || "Not provided",
    phone: user?.phoneNumber || user?.phone || "Not provided",
    accountType: user?.accountType || "Personal",
    avatar: user?.avatar ? { uri: user.avatar } : null,
    points: user?.points ?? points,
    address: user?.address || "Not provided",
    joinDate: user?.joinDate || "January 2024",
    verified: user?.verified || true,
  };

  const loadProfileStats = async () => {
    try {
      const [balRes, txRes, cashbackRes, beneficiariesRes, cardsRes] = await Promise.allSettled([
        getWalletBalance?.() ?? walletService.getBalance(),
        getTransactions?.() ?? transactionService.getAll(),
        cashbackService.getAll(),
        beneficiaryService.getAll(),
        cardService.getAll(),
      ]);

      if (balRes.status === 'fulfilled') {
        const data = (balRes.value as { data?: { balance: number }; balance?: number })?.data ?? balRes.value;
        setBalance((data as { balance?: number })?.balance ?? 0);
      }

      if (txRes.status === 'fulfilled') {
        const txs = ((txRes.value as { data?: unknown[] })?.data ?? txRes.value) as { amount?: number; type?: string }[];
        if (Array.isArray(txs)) {
          const spent = txs
            .filter((t) => t.type === 'debit' || (t.amount ?? 0) < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount ?? 0), 0);
          setTotalSpent(spent);
        }
      }

      if (cashbackRes.status === 'fulfilled') {
        const cb = (cashbackRes.value as { data?: { totalPoints?: number; balance?: number } })?.data ?? cashbackRes.value;
        const pts = (cb as { totalPoints?: number; balance?: number })?.totalPoints
          ?? (cb as { balance?: number })?.balance ?? 0;
        setPoints(pts);
      }

      let methodsLoaded = false;
      if (beneficiariesRes.status === 'fulfilled') {
        const list = ((beneficiariesRes.value as { data?: unknown[] })?.data ?? beneficiariesRes.value) as { id: string; bankName?: string; accountNumber?: string }[];
        if (Array.isArray(list) && list.length) {
          methodsLoaded = true;
          setPaymentMethods(
            list.slice(0, 3).map((b) => ({
              id: b.id,
              type: b.bankName || 'Bank',
              last4: (b.accountNumber || '').slice(-4),
            })),
          );
        }
      }

      if (cardsRes.status === 'fulfilled' && !methodsLoaded) {
        const cards = ((cardsRes.value as { data?: unknown[] })?.data ?? cardsRes.value) as { id: string; brand?: string; last4?: string; expiry?: string }[];
        if (Array.isArray(cards) && cards.length) {
          setPaymentMethods(
            cards.slice(0, 3).map((card) => ({
              id: card.id,
              type: card.brand || 'Card',
              last4: card.last4 || '****',
              expiry: card.expiry,
            })),
          );
        }
      }

      try {
        const refRes = await referralService.getList();
        const refs = parseList<{ status?: string }>(refRes);
        setReferralCount(refs.filter((r) => r.status === 'completed').length || refs.length);
      } catch {
        // keep count
      }
    } catch {
      // keep cached values
    }
  };

  useEffect(() => {
    checkBiometricAndLoadSettings();
    loadProfileStats();
  }, []);

  useEffect(() => {
    setPushNotifications(notificationPrefs.pushEnabled);
    setEmailNotifications(notificationPrefs.emailEnabled);
  }, [notificationPrefs]);

  useEffect(() => {
    if (!socket) return;
    const onBalance = (payload: { balance?: number }) => {
      if (payload.balance != null) setBalance(payload.balance);
    };
    const onCashback = (payload: { points?: number; totalPoints?: number }) => {
      setPoints(payload.totalPoints ?? payload.points ?? points);
    };
    socket.on('wallet:balance', onBalance);
    socket.on('cashback:update', onCashback);
    socket.on('transaction:completed', () => loadProfileStats());
    return () => {
      socket.off('wallet:balance', onBalance);
      socket.off('cashback:update', onCashback);
      socket.off('transaction:completed', loadProfileStats);
    };
  }, [socket]);

  const checkBiometricAndLoadSettings = async () => {
    const available = await BiometricAuth.isAvailable();
    setBiometricAvailable(available);
    if (available) {
      const enabled = await BiometricAuth.isEnabled();
      setBiometricEnabled(enabled);
    }

    // Load other settings
    const twoFactor = await storage.get<boolean | string>("twoFactorEnabled");
    setTwoFactorAuth(twoFactor === true || twoFactor === "true");
    try {
      const res = await authService.get2FAStatus();
      const data = (res as { data?: { enabled: boolean } })?.data ?? res;
      const enabled = (data as { enabled?: boolean })?.enabled ?? false;
      setTwoFactorAuth(enabled);
      await storage.set("twoFactorEnabled", enabled);
    } catch {
      // keep cached value
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#6C5CE7",
      "#00B894",
      "#E17055",
      "#0984E3",
      "#FDCB6E",
      "#E84393",
      "#00CEC9",
      "#6C5CE7",
    ];
    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  const quickStats = [
    { label: "Wallet Balance", value: formatMoney(balance, currency), icon: Wallet, color: c.violet },
    { label: "Total Spent", value: formatMoney(totalSpent, currency), icon: TrendingUp, color: c.mint },
    { label: "Points Earned", value: points.toLocaleString(), icon: Award, color: c.blue },
  ];

  const rewards = [
    { id: 1, title: "Welcome Bonus", points: 50, icon: Star, achieved: points >= 50 },
    { id: 2, title: "First Transaction", points: 100, icon: Zap, achieved: totalSpent > 0 },
    { id: 3, title: "Referral Bonus", points: 200, icon: Gift, achieved: referralCount >= 1 },
    { id: 4, title: "Monthly Spender", points: 500, icon: TrendingUp, achieved: totalSpent >= 100000 },
  ];

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            await SecureStore.deleteItemAsync("authToken");
            await SecureStore.deleteItemAsync("refreshToken");
            await SecureStore.deleteItemAsync("userData");
            await logout();
            router.replace("/login");
            Toast.show({
              type: "success",
              text1: "Logged out successfully",
              position: "bottom",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Logout failed",
              position: "bottom",
            });
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  const toggleSection = (section: string) => {
    switch (section) {
      case "personalInfo":
        setPersonalInfoExpanded(!personalInfoExpanded);
        break;
      case "rewards":
        setRewardsExpanded(!rewardsExpanded);
        break;
      case "account":
        setAccountExpanded(!accountExpanded);
        break;
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: c.bg }]} edges={["top"]}>
        <ScrollView
          style={[styles.container, { backgroundColor: c.bg }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header with Gradient */}
          <LinearGradient
            colors={[c.primary, c.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileHeader}
          >
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setSettingsVisible(true)}
              >
                <Settings size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                {profileUser.avatar && !imageError ? (
                  <Image
                    source={profileUser.avatar}
                    style={styles.avatar}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatarFallback,
                      { backgroundColor: getAvatarColor(profileUser.name) },
                    ]}
                  >
                    <Text style={styles.avatarInitials}>
                      {getInitials(profileUser.name)}
                    </Text>
                  </View>
                )}
                {profileUser.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: c.success }]}>
                    <Shield size={12} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profileUser.name}</Text>
                <View style={styles.userMeta}>
                  <Text style={styles.userTier}>{profileUser.accountType}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.userTier}>
                    Member since {profileUser.joinDate}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View key={index} style={[styles.statCard, { backgroundColor: c.bg, borderColor: c.border, shadowColor: c.primary }]}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: `${stat.color}15` },
                    ]}
                  >
                    <Icon size={20} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, { color: c.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: c.textSub }]}>{stat.label}</Text>
                </View>
              );
            })}
          </View>

          {/* Rewards Summary Card */}
          <LinearGradient
            colors={[c.primaryLight, c.bg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.rewardsSummary, { borderColor: c.border }]}
          >
            <View style={styles.pointsContainer}>
              <Text style={[styles.pointsLabel, { color: c.textSub }]}>Available Points</Text>
              <Text style={[styles.pointsValue, { color: c.violet }]}>{profileUser.points}</Text>
              <TouchableOpacity
                style={styles.redeemBtn}
                onPress={() => navigateTo("/rewards")}
              >
                <Text style={[styles.redeemText, { color: c.violet }]}>Redeem →</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <View style={styles.rewardsActions}>
              <TouchableOpacity
                style={styles.rewardAction}
                onPress={() => navigateTo("/rewards")}
              >
                <Gift size={20} color={c.violet} />
                <Text style={[styles.rewardActionText, { color: c.text }]}>Redeem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rewardAction}
                onPress={() => navigateTo("/earn-points")}
              >
                <Star size={20} color={c.violet} />
                <Text style={[styles.rewardActionText, { color: c.text }]}>Earn More</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Personal Information Section */}
          <View style={[styles.section, { backgroundColor: c.bg, borderColor: c.border }]}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("personalInfo")}
            >
              <Text style={[styles.sectionTitle, { color: c.primary }]}>Personal Information</Text>
              {personalInfoExpanded ? (
                <ChevronDown size={20} color={c.textSub} />
              ) : (
                <ChevronRight size={20} color={c.textSub} />
              )}
            </TouchableOpacity>

            {personalInfoExpanded && (
              <>
                <ProfileItem
                  icon={<User size={20} color={c.violet} />}
                  title="Full Name"
                  value={profileUser.name}
                />
                <ProfileItem
                  icon={<Mail size={20} color={c.violet} />}
                  title="Email Address"
                  value={profileUser.email}
                />
                <ProfileItem
                  icon={<Phone size={20} color={c.violet} />}
                  title="Phone Number"
                  value={profileUser.phone}
                />
                <ProfileItem
                  icon={<MapPin size={20} color={c.violet} />}
                  title="Address"
                  value={profileUser.address}
                />

                <View style={[styles.paymentMethods, { borderTopColor: c.border }]}>
                  <Text style={[styles.subSectionTitle, { color: c.primary }]}>Payment Methods</Text>
                  {paymentMethods.map((method) => (
                    <View key={method.id} style={styles.paymentMethod}>
                      <CreditCard size={16} color={c.textSub} />
                      <Text style={[styles.paymentText, { color: c.text }]}>
                        {method.type} •••• {method.last4} (Expires{" "}
                        {method.expiry})
                      </Text>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: c.primaryLight }]}
                    onPress={() => navigateTo("/settings/payment-methods")}
                  >
                    <Text style={[styles.addButtonText, { color: c.violet }]}>
                      + Add Payment Method
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Rewards Section */}
          <View style={[styles.section, { backgroundColor: c.bg, borderColor: c.border }]}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("rewards")}
            >
              <Text style={[styles.sectionTitle, { color: c.primary }]}>Earn More Points</Text>
              {rewardsExpanded ? (
                <ChevronDown size={20} color={c.textSub} />
              ) : (
                <ChevronRight size={20} color={c.textSub} />
              )}
            </TouchableOpacity>

            {rewardsExpanded && (
              <>
                {rewards.map((reward) => {
                  const Icon = reward.icon;
                  return (
<TouchableOpacity key={reward.id} style={[styles.rewardCard, { backgroundColor: c.primaryLight }]}>
                      <View
                        style={[
                          styles.rewardIcon,
                          { backgroundColor: reward.achieved ? c.success + '20' : c.bg },
                        ]}
                      >
                        <Icon
                          size={20}
                          color={reward.achieved ? c.success : c.violet}
                        />
                      </View>
                      <View style={styles.rewardInfo}>
                        <Text style={[styles.rewardTitle, { color: c.text }]}>{reward.title}</Text>
                        <Text style={[styles.rewardPoints, { color: c.textSub }]}>
                          {reward.points} points
                        </Text>
                      </View>
                      {reward.achieved ? (
                        <View style={[styles.achievedBadge, { backgroundColor: c.success + '20' }]}>
                          <Text style={[styles.achievedText, { color: c.success }]}>Earned</Text>
                        </View>
                      ) : (
                        <ChevronRight size={18} color={c.textSub} />
                      )}
                    </TouchableOpacity>
                  );
                })}
                  <TouchableOpacity
                    style={[styles.seeAllButton, { backgroundColor: c.primaryLight }]}
                    onPress={() => navigateTo("/rewards")}
                  >
                    <Text style={[styles.seeAllText, { color: c.violet }]}>View All Rewards</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Account Actions */}
          <View style={[styles.section, { backgroundColor: c.bg, borderColor: c.border }]}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("account")}
            >
              <Text style={[styles.sectionTitle, { color: c.primary }]}>Account</Text>
              {accountExpanded ? (
                <ChevronDown size={20} color={c.textSub} />
              ) : (
                <ChevronRight size={20} color={c.textSub} />
              )}
            </TouchableOpacity>

            {accountExpanded && (
              <>
                <AccountAction
                  icon={Settings}
                  label="Settings"
                  onPress={() => setSettingsVisible(true)}
                />
                <AccountAction
                  icon={HelpCircle}
                  label="Help & Support"
                  onPress={() => navigateTo("/settings/help-support")}
                />
                <AccountAction
                  icon={Shield}
                  label="Privacy Policy"
                  onPress={() => navigateTo("/settings/privacy-policy")}
                />
                <AccountAction
                  icon={Gift}
                  label="Refer Friends"
                  onPress={() => navigateTo("/settings/referral")}
                />
                <AccountAction
                  icon={Lock}
                  label="Change PIN"
                  onPress={() => navigateTo("/settings/change-pin")}
                />
                <AccountAction
                  icon={LogOut}
                  label={isLoggingOut ? "Logging out..." : "Logout"}
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
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <LinearGradient
            colors={[c.primary, c.violet]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSettingsVisible(false)}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            {/* Appearance */}
            <SettingsSection title="Appearance" icon={Sun}>
              <SettingsItem
                label="Dark Mode"
                icon={isDarkMode ? Moon : Sun}
                type="switch"
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
              <SettingsItem
                label="Language"
                value="English"
                icon={Globe}
                onPress={() => handleNavigateToSettings("/settings/language")}
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications" icon={Bell}>
              <SettingsItem
                label="Push Notifications"
                icon={Bell}
                type="switch"
                value={pushNotifications}
                onValueChange={(v) => {
                  setPushNotifications(v);
                  updateNotificationPrefs({ pushEnabled: v });
                }}
              />
              <SettingsItem
                label="Email Notifications"
                icon={Mail}
                type="switch"
                value={emailNotifications}
                onValueChange={(v) => {
                  setEmailNotifications(v);
                  updateNotificationPrefs({ emailEnabled: v });
                }}
              />
            </SettingsSection>

            {/* Security */}
            <SettingsSection title="Security" icon={Shield}>
              <SettingsItem
                label="Two-Factor Authentication"
                icon={Lock}
                value={twoFactorAuth ? "Enabled" : "Disabled"}
                onPress={() => handleNavigateToSettings("/settings/two-factor")}
              />
              <SettingsItem
                label="Active Sessions"
                icon={Smartphone}
                onPress={() => handleNavigateToSettings("/settings/sessions")}
              />
              <SettingsItem
                label="Change PIN"
                icon={Lock}
                onPress={() => handleNavigateToSettings("/settings/change-pin")}
              />
              <SettingsItem
                label="Biometric Login"
                icon={Fingerprint}
                type="switch"
                value={biometricEnabled}
                onValueChange={async (value: boolean) => {
                  if (value && biometricAvailable) {
                    const authenticated = await BiometricAuth.authenticate(
                      "Authenticate to enable biometric login",
                    );
                    if (!authenticated) return;
                  }
                  await BiometricAuth.setEnabled(value);
                  setBiometricEnabled(value);
                }}
              />
              <SettingsItem
                label="Privacy Settings"
                icon={Shield}
                onPress={() => handleNavigateToSettings("/settings/privacy")}
              />
            </SettingsSection>

            {/* Support */}
            <SettingsSection title="Support" icon={HelpCircle}>
              <SettingsItem
                label="Help & Support"
                icon={HelpCircle}
                onPress={() =>
                  handleNavigateToSettings("/settings/help-support")
                }
              />
              <SettingsItem
                label="Refer Friends"
                icon={Gift}
                onPress={() => handleNavigateToSettings("/settings/referral")}
              />
              <SettingsItem
                label="Rate Us"
                icon={Star}
                onPress={() => handleNavigateToSettings('/settings/rate-us')}
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
                onPress={() =>
                  handleNavigateToSettings("/settings/privacy-policy")
                }
              />
              <SettingsItem
                label="Terms of Service"
                icon={FileText}
                onPress={() => handleNavigateToSettings("/settings/terms")}
              />
            </SettingsSection>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

// Reusable Components
const ProfileItem = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
  <View style={[styles.profileItem, { borderBottomColor: c.border }]}>
    <View style={[styles.itemIcon, { backgroundColor: c.primaryLight }]}>{icon}</View>
    <View style={styles.itemInfo}>
      <Text style={[styles.itemTitle, { color: c.textSub }]}>{title}</Text>
      <Text style={[styles.itemValue, { color: c.text }]}>{value}</Text>
    </View>
  </View>
  );
};

const AccountAction = ({
  icon: Icon,
  label,
  onPress,
  isDanger,
  disabled,
}: any) => {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
  <TouchableOpacity
    style={styles.accountAction}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={[styles.actionIcon, { backgroundColor: isDanger ? c.error + '10' : c.primaryLight }]}>
      <Icon size={20} color={isDanger ? c.error : c.violet} />
    </View>
    <Text style={[styles.actionText, { color: isDanger ? c.error : c.text }]}>
      {label}
    </Text>
    {!disabled && <ChevronRight size={18} color={c.textSub} />}
  </TouchableOpacity>
  );
};

const SettingsSection = ({ title, icon: Icon, children }: any) => {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
  <View style={styles.settingsSection}>
    <View style={styles.settingsSectionHeader}>
      <Icon size={20} color={c.violet} />
      <Text style={[styles.settingsSectionTitle, { color: c.primary }]}>{title}</Text>
    </View>
    <View style={[styles.settingsSectionContent, { backgroundColor: c.primaryLight }]}>{children}</View>
  </View>
  );
};

const SettingsItem = ({
  label,
  value,
  icon: Icon,
  type,
  onPress,
  onValueChange,
}: any) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const ItemIcon = Icon;
  if (type === "switch") {
    return (
      <View style={[styles.settingsItem, { borderBottomColor: c.border }]}>
        <View style={styles.settingsItemLeft}>
          <ItemIcon size={18} color={c.textSub} />
          <Text style={[styles.settingsItemText, { color: c.text }]}>{label}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: c.border, true: c.violet + "50" }}
          thumbColor={value ? c.violet : "#fff"}
        />
      </View>
    );
  }
  return (
    <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: c.border }]} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <ItemIcon size={18} color={c.textSub} />
        <Text style={[styles.settingsItemText, { color: c.text }]}>{label}</Text>
      </View>
      {value && <Text style={[styles.settingsItemValue, { color: c.textSub }]}>{value}</Text>}
      <ChevronRight size={16} color={c.textSub} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },

  profileHeader: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 32 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  settingsButton: { padding: 8 },

  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatarContainer: { position: "relative", marginRight: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { fontSize: 28, fontWeight: "700", color: "#fff" },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userDetails: { flex: 1 },
  userName: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 6 },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  userTier: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: { fontSize: 11 },

  rewardsSummary: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    marginBottom: 20,
  },
  pointsContainer: { flex: 1 },
  pointsLabel: { fontSize: 12, marginBottom: 4 },
  pointsValue: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  redeemBtn: { alignSelf: "flex-start" },
  redeemText: { fontSize: 12, fontWeight: "600" },
  divider: { width: 1, marginHorizontal: 16 },
  rewardsActions: { flex: 1, justifyContent: "space-around" },
  rewardAction: { flexDirection: "row", alignItems: "center", gap: 8 },
  rewardActionText: { fontSize: 13, fontWeight: "500" },

  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },

  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 12, marginBottom: 2 },
  itemValue: { fontSize: 15, fontWeight: "500" },

  paymentMethods: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  paymentText: { fontSize: 13 },
  addButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: { fontSize: 14, fontWeight: "600" },

  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  rewardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rewardInfo: { flex: 1 },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  rewardPoints: { fontSize: 12 },
  achievedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievedText: { fontSize: 10, fontWeight: "600" },
  seeAllButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  seeAllText: { fontSize: 14, fontWeight: "600" },

  accountAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  // Modal Styles
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  modalClose: { padding: 8 },
  modalContent: { paddingHorizontal: 20, paddingTop: 20 },

  settingsSection: { marginBottom: 24 },
  settingsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  settingsSectionTitle: { fontSize: 18, fontWeight: "700" },
  settingsSectionContent: {
    borderRadius: 16,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingsItemText: { fontSize: 15, flex: 1 },
  settingsItemValue: { fontSize: 13, marginRight: 8 },
});

export default Me;
