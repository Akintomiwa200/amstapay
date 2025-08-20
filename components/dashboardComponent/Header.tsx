import { useRouter } from 'expo-router';
import { Bell, HelpCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
  const router = useRouter();
  
  // Define the user name as a proper string
  const userName = "John Doe";

  const handleHelpPress = () => {
    router.push('/help');
  };

  const handleNotificationPress = () => {
    router.push('/notification');
  };

  return (
    <View style={styles.container}>
      {/* Left section: avatar and greeting */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <View style={styles.avatarInner} />
        </View>
        <Text style={styles.greeting}>{`Hi, ${userName}`}</Text>
      </View>

      {/* Right section: icons */}
      <View style={styles.iconRow}>
        {/* Help icon with badge */}
        <TouchableOpacity style={styles.iconWrapper} onPress={handleHelpPress}>
          <HelpCircle size={24} color="#F97316" />
          <View style={[styles.badge, styles.badgeOrange]}>
            <Text style={styles.badgeText}>?</Text>
          </View>
        </TouchableOpacity>

        {/* Notification icon with badge */}
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={handleNotificationPress}
        >
          <Bell size={24} color="#F97316" />
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
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#F97316', // Orange-500
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF', // White inner circle
    borderRadius: 9,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937', // Dark gray text
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
    backgroundColor: '#EA580C', // Orange-600
    width: 16,
    height: 16,
  },
  badgeRed: {
    backgroundColor: '#DC2626', // Red-600
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