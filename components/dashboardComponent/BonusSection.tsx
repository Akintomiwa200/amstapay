import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Gift, ChevronRight, Target } from 'lucide-react-native';

const BonusSection = () => (
  <View style={styles.container}>
    <View style={styles.card}>
      {/* Top row */}
      <View style={[styles.row, styles.mb3]}>
        <Text style={styles.title}>Earn Your Bonus</Text>
        <View style={styles.row}>
          <Gift size={20} color="#16a34a" style={styles.iconSpacing} /> {/* Updated to AmstaPay's primary green */}
          <ChevronRight size={16} color="#6b7280" /> {/* Neutral gray */}
        </View>
      </View>

      {/* Inner white box */}
      <View style={styles.innerBox}>
        <View style={styles.row}>
          {/* Icon circle */}
          <View style={styles.iconContainer}>
            <Target size={20} color="#facc15" /> {/* Yellow for emphasis */}
          </View>

          {/* Text block */}
          <View style={{ flex: 1 }}>
            <Text style={styles.innerTitle}>Betting Bonus</Text>
            <Text style={styles.innerText}>
              Fund your betting account with ₦100 or more and earn up to ₦10 cashback!
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Claim Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default BonusSection;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#f0fdf4', // Light green background
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mb3: {
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
    color: '#14532d', // Dark green for the title
    fontSize: 16,
  },
  iconSpacing: {
    marginRight: 8,
  },
  innerBox: {
    backgroundColor: '#ffffff', // White background
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#fef9c3', // Light yellow background
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  innerTitle: {
    fontWeight: '500',
    color: '#14532d', // Dark green for the title
    fontSize: 14,
  },
  innerText: {
    fontSize: 12,
    color: '#166534', // Medium green for the text
  },
  button: {
    backgroundColor: '#16a34a', // AmstaPay's primary green
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff', // White text
    fontWeight: '500',
    fontSize: 14,
  },
});