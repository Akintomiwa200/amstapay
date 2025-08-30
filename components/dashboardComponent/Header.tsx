import { useRouter } from 'expo-router';
import { Bell, HelpCircle, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";

import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  
  // Define the user name as a proper string
  
  const userName = user?.fullName || user?.name || "Guest";

  
  // Online user profile image
  const userImage = { 
    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' 
  };

  const handleHelpPress = () => {
    router.push('/help-support');
  };

  const handleNotificationPress = () => {
    router.push('/notification');
  };

  const handleProfilePress = () => {
    router.push('/me');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View style={styles.container}>
      {/* Left section: user image and greeting - now clickable */}
      <TouchableOpacity 
        style={styles.row} 
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        {imageError ? (
          <View style={[styles.userImage, styles.avatarFallback]}>
            <User size={20} color="#FF8C00" />
          </View>
        ) : (
          <Image 
            source={userImage} 
            style={styles.userImage}
            resizeMode="cover"
            onError={handleImageError}
          />
        )}
        <Text style={styles.greeting}>{`Hi, ${userName}`}</Text>
      </TouchableOpacity>

      {/* Right section: icons */}
      <View style={styles.iconRow}>
        {/* Help icon with badge */}
        <TouchableOpacity style={styles.iconWrapper} onPress={handleHelpPress}>
          <HelpCircle size={24} color="#FF8C00" />
          <View style={[styles.badge, styles.badgeOrange]}>
            <Text style={styles.badgeText}>?</Text>
          </View>
        </TouchableOpacity>

        {/* Notification icon with badge */}
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={handleNotificationPress}
        >
          <Bell size={24} color="#FF8C00" />
          <View style={[styles.badge, styles.badgeRed]}>
            <Text style={styles.badgeText}>7</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF8C00',
    backgroundColor: '#F3F4F6',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4E6',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    marginHorizontal: 6,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOrange: {
    backgroundColor: '#E67300',
    width: 16,
    height: 16,
  },
  badgeRed: {
    backgroundColor: '#DC2626',
    width: 20,
    height: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});