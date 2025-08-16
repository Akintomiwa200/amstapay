import { Mail } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EmailBanner = () => (
  <View style={styles.container}>
    {/* Icon container */}
    <View style={styles.iconWrapper}>
      <Mail size={20} color="#16a34a" />
    </View>

    {/* Text content - All text properly wrapped in Text components */}
    <View style={styles.textWrapper}>
      <Text style={styles.title}>Stay Connected with AmstaPay</Text>
      <Text style={styles.subtitle}>
        Add your email to receive the latest updates and offers
      </Text>
    </View>

    {/* Add button with proper touch feedback */}
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Add Email</Text>
    </TouchableOpacity>
  </View>
);

export default EmailBanner;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0', // Light green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
    marginRight: 8, // Add spacing between text and button
  },
  title: {
    fontWeight: '600', // Slightly bolder
    color: '#14532d',
    fontSize: 15, // Slightly smaller for better proportion
    lineHeight: 20, // Add line height for better readability
  },
  subtitle: {
    fontSize: 13, // Slightly larger
    color: '#166534',
    marginTop: 4, // Slightly more spacing
    lineHeight: 18, // Add line height
  },
  button: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80, // Ensure consistent width
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});