// components/dashboardComponent/Header.tsx
import { useRouter } from 'expo-router';
import { Bell, HelpCircle, User, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './colors';

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  
  const userName = user?.fullName || user?.name || "Guest";
  const firstName = userName.split(' ')[0];
  
  const userImage = { 
    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' 
  };

  const handleHelpPress = () => router.push('/help-support');
  const handleNotificationPress = () => router.push('/notification');
  const handleProfilePress = () => router.push('/me');

  return (
    <LinearGradient
      colors={[C.primaryLight, C.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.row} onPress={handleProfilePress} activeOpacity={0.7}>
        {imageError ? (
          <View style={[styles.userImage, styles.avatarFallback]}>
            <User size={20} color={C.primary} />
          </View>
        ) : (
          <Image source={userImage} style={styles.userImage} onError={() => setImageError(true)} />
        )}
        <View>
          <Text style={styles.greetingTop}>Welcome back,</Text>
          <Text style={styles.greeting}>{firstName}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleHelpPress}>
          <HelpCircle size={22} color={C.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleNotificationPress}>
          <Bell size={22} color={C.primary} />
          <View style={[styles.badge, styles.badgeRed]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: C.violet,
    backgroundColor: C.primaryLight,
  },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  greetingTop: { fontSize: 12, color: C.textSub, marginBottom: 2 },
  greeting: { fontSize: 18, fontWeight: '700', color: C.primary },
  iconRow: { flexDirection: 'row', gap: 16 },
  iconWrapper: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeRed: { backgroundColor: C.error },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

export default Header;