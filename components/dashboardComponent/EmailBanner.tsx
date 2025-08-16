import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mail } from 'lucide-react-native';

const EmailBanner = () => (
  <View style={styles.container}>
    {/* Icon container */}
    <View style={styles.iconWrapper}>
      <Mail size={20} color="#16a34a" /> {/* Updated to AmstaPay's primary green */}
    </View>

    {/* Text content */}
    <View style={styles.textWrapper}>
      <Text style={styles.title}>Stay Connected with AmstaPay</Text>
      <Text style={styles.subtitle}>
        Add your email to receive the latest updates and offers
      </Text>
    </View>
  </View>
);

export default EmailBanner;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#f0fdf4', // Light green background
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7', // Lighter green for the icon background
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
    color: '#14532d', // Darker green for the title
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#166534', // Medium green for the subtitle
    marginTop: 2,
  },
});