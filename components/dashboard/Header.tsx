// components/dashboard/Header.tsx
import { useRouter } from 'expo-router';
import { Bell, HelpCircle, User, Wallet, Shield, Award, CheckCircle } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = () => {
  const { user, token, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  
  const fullName =
    user?.fullName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : null) ||
    user?.phoneNumber ||
    "Valued Customer";
  const firstName = fullName.split(' ')[0] || "User";
  const userInitial = firstName.charAt(0).toUpperCase();
  const accountNumber = user?.amstapayAccountNumber || user?.accountNumber || "N/A";
  const kycLevel = user?.kycLevel || 0;
  const isVerified = user?.isVerified || false;
  const accountType = user?.accountType || "personal";
  
  const getKYCLevelDisplay = () => {
    switch(kycLevel) {
      case 0:
        return { text: "KYC Pending", color: theme.colors.error, icon: null };
      case 1:
        return { text: "Basic KYC", color: theme.colors.warning, icon: null };
      case 2:
        return { text: "Verified", color: theme.colors.success, icon: CheckCircle };
      case 3:
        return { text: "Premium", color: theme.colors.violet, icon: Award };
      default:
        return { text: "KYC Pending", color: theme.colors.error, icon: null };
    }
  };
  
  const kycInfo = getKYCLevelDisplay();
  const KycIcon = kycInfo.icon;
  
  const getUserImageSource = () => {
    if (user?.passportPhoto) {
      return { uri: user.passportPhoto };
    }
    const nameForAvatar = encodeURIComponent(fullName);
    return { uri: `https://ui-avatars.com/api/?name=${nameForAvatar}&background=6366f1&color=fff&size=100&rounded=true&bold=true` };
  };
  
  useEffect(() => {
    if (token) {
      fetchUnreadNotificationsCount();
    }
  }, [token]);
  
  const fetchUnreadNotificationsCount = async () => {
    try {
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setUnreadCount(0);
    }
  };
  
  const handleHelpPress = () => {
    router.push({
      pathname: '/help-support',
      params: { userId: user?._id }
    });
  };
  
  const handleNotificationPress = () => {
    setUnreadCount(0);
    router.push('/notification');
  };
  
  const handleProfilePress = () => {
    router.push({
      pathname: '/me',
      params: { userId: user?._id }
    });
  };
  
  return (
    <LinearGradient
      colors={[theme.colors.primaryLight, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { borderBottomColor: theme.colors.border }]}
    >
      <TouchableOpacity 
        style={styles.row} 
        onPress={handleProfilePress} 
        activeOpacity={0.7}
        accessibilityLabel="View profile"
        accessibilityRole="button"
      >
        {imageError ? (
          <View style={[styles.userImage, styles.avatarFallback, { backgroundColor: `${theme.colors.violet}20`, borderColor: theme.colors.violet }]}>
            <Text style={[styles.avatarText, { color: theme.colors.violet }]}>{userInitial}</Text>
          </View>
        ) : (
          <Image 
            source={getUserImageSource()} 
            style={[styles.userImage, { borderColor: theme.colors.violet, backgroundColor: theme.colors.primaryLight }]} 
            onError={() => setImageError(true)}
          />
        )}
        
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.greetingTop, { color: theme.colors.textSub }]}>Welcome back,</Text>
            <Text style={[styles.greeting, { color: theme.colors.text }]} numberOfLines={1}>
              {firstName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.iconRow}>
        <TouchableOpacity 
          style={styles.iconWrapper} 
          onPress={handleHelpPress}
          accessibilityLabel="Help and support"
          accessibilityRole="button"
        >
          <HelpCircle size={22} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconWrapper} 
          onPress={handleNotificationPress}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Bell size={22} color={theme.colors.primary} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
  },
  avatarFallback: { 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  greetingTop: { 
    fontSize: 12, 
    fontWeight: '500',
  },
  greeting: { 
    fontSize: 18, 
    fontWeight: '700', 
    letterSpacing: 0.3,
  },
  iconRow: { 
    flexDirection: 'row', 
    gap: 16,
    alignItems: 'center',
  },
  iconWrapper: { 
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: 'bold',
  },
});

export default Header;
