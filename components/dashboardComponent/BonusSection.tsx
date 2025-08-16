import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Gift, ChevronRight, Target } from 'lucide-react-native';

const BonusSection: React.FC = () => (
  <View style={bonusStyles.container}>
    <View style={bonusStyles.card}>
      {/* Top row */}
      <View style={[bonusStyles.row, bonusStyles.mb3]}>
        <Text style={bonusStyles.title}>Earn Your Bonus</Text>
        <View style={bonusStyles.row}>
          <Gift size={20} color="#D4AF37" style={bonusStyles.iconSpacing} />
          <ChevronRight size={16} color="#6b7280" />
        </View>
      </View>

      {/* Inner white box */}
      <View style={bonusStyles.innerBox}>
        <View style={bonusStyles.row}>
          {/* Icon circle */}
          <View style={bonusStyles.iconContainer}>
            <Target size={20} color="#D4AF37" />
          </View>

          {/* Text block */}
          <View style={bonusStyles.textContainer}>
            <Text style={bonusStyles.innerTitle}>Betting Bonus</Text>
            <Text style={bonusStyles.innerText}>
              Fund your betting account with ₦100 or more and earn up to ₦10 cashback!
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={bonusStyles.button}>
          <Text style={bonusStyles.buttonText}>Claim Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default BonusSection;

const bonusStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFF9E6', // Light gold background
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0E6CC', // Subtle gold border
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
    color: '#333333', // Dark text
    fontSize: 16,
  },
  iconSpacing: {
    marginRight: 8,
  },
  innerBox: {
    backgroundColor: '#FFFFFF', // Pure white
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0F0F0', // Very light gray border
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF5D9', // Light gold
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0E6CC', // Subtle gold border
  },
  textContainer: {
    flex: 1,
  },
  innerTitle: {
    fontWeight: '500',
    color: '#333333', // Dark text
    fontSize: 14,
  },
  innerText: {
    fontSize: 12,
    color: '#666666', // Medium gray
  },
  button: {
    backgroundColor: '#D4AF37', // Gold button
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontWeight: '500',
    fontSize: 14,
  },
});