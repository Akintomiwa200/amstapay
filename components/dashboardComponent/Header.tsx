// components/dashboardComponent/Header.tsx
import { useRouter } from 'expo-router';
import { Bell, HelpCircle, User, Wallet, Shield, Award, CheckCircle } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './colors';

const Header = () => {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Extract real user data from the database structure
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
  
  // Get KYC level display
  const getKYCLevelDisplay = () => {
    switch(kycLevel) {
      case 0:
        return { text: "KYC Pending", color: "#ef4444", icon: null };
      case 1:
        return { text: "Basic KYC", color: "#f59e0b", icon: null };
      case 2:
        return { text: "Verified", color: "#10b981", icon: CheckCircle };
      case 3:
        return { text: "Premium", color: "#8b5cf6", icon: Award };
      default:
        return { text: "KYC Pending", color: "#ef4444", icon: null };
    }
  };
  
  const kycInfo = getKYCLevelDisplay();
  const KycIcon = kycInfo.icon;
  
  // Get profile picture or generate avatar based on user initials
  const getUserImageSource = () => {
    if (user?.passportPhoto) {
      return { uri: user.passportPhoto };
    }
    // Generate avatar with full name
    const nameForAvatar = encodeURIComponent(fullName);
    return { uri: `https://ui-avatars.com/api/?name=${nameForAvatar}&background=6366f1&color=fff&size=100&rounded=true&bold=true` };
  };

  // Fetch real wallet balance
  useEffect(() => {
    if (token) {
      
      fetchUnreadNotificationsCount();
     
    }
  }, [token]);

 
  const fetchUnreadNotificationsCount = async () => {
    try {
      // You can implement notifications endpoint later
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
      colors={[C.primaryLight, C.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.row} 
        onPress={handleProfilePress} 
        activeOpacity={0.7}
        accessibilityLabel="View profile"
        accessibilityRole="button"
      >
        {imageError ? (
          <View style={[styles.userImage, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
        ) : (
          <Image 
            source={getUserImageSource()} 
            style={styles.userImage} 
            onError={() => setImageError(true)}
          />
        )}
        
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.greetingTop}>Welcome back,</Text>
            <Text style={styles.greeting} numberOfLines={1}>
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
          <HelpCircle size={22} color={C.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconWrapper} 
          onPress={handleNotificationPress}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Bell size={22} color={C.primary} />
          {unreadCount > 0 && (
            <View style={[styles.badge, styles.badgeRed]}>
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
    borderBottomColor: C.border,
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
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: C.violet,
    backgroundColor: C.primaryLight,
  },
  avatarFallback: { 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: C.violet + '20',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: C.violet,
  },
  greetingTop: { 
    fontSize: 12, 
    color: C.textSub, 
    fontWeight: '500',
  },
  greeting: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: C.primary,
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
  badgeRed: { 
    backgroundColor: C.error,
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: 'bold',
  },
});

export default Header;