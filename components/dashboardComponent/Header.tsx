import { useRouter } from 'expo-router'; // Import router for navigation
import { Bell, HelpCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
  const router = useRouter();

  const handleHelpPress = () => {
    router.push('/help'); // Navigate to the Help screen
  };

  const handleNotificationPress = () => {
    router.push('/notification'); // Navigate to the Notifications screen
  };

  return (
    <View style={styles.container}>
      {/* Left section: avatar and greeting */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <View style={styles.avatarInner} />
        </View>
        <Text style={styles.greeting}>Hi, HAPPINESS</Text>
      </View>

      {/* Right section: icons */}
      <View style={styles.iconRow}>
        {/* Help icon with badge */}
        <TouchableOpacity style={styles.iconWrapper} onPress={handleHelpPress}>
          <HelpCircle size={24} color="#0D47A1" /> {/* Amstapay deep blue */}
          <View style={[styles.badge, styles.badgePink]}>
            <Text style={styles.badgeText}>?</Text>
          </View>
        </TouchableOpacity>

        {/* Notification icon with badge */}
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={handleNotificationPress}
        >
          <Bell size={24} color="#0D47A1" />
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
    paddingTop: 50, // extra top padding for notched phones
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF', // light background
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#0D47A1', // Amstapay deep blue
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 18,
    height: 18,
    backgroundColor: '#FFD700', // Amstapay gold
    borderRadius: 9,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1', // Deep blue for text
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
  badgePink: {
    backgroundColor: '#FF4081', // Vibrant pink
    width: 16,
    height: 16,
  },
  badgeRed: {
    backgroundColor: '#E53935', // Rich red
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