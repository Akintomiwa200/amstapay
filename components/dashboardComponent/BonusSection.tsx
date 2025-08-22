import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Gift, ChevronRight, Target } from 'lucide-react-native';

// Color palette
const COLORS = {
  primary: '#F97316',      // Orange
  primaryLight: '#FDBA74', // Light orange
  background: '#FFFFFF',   // White
  text: '#000000',         // Black
  textSecondary: '#374151', // Dark gray
  textTertiary: '#6B7280',  // Medium gray
  border: '#E5E7EB',       // Light border
  accent: '#D97706',       // Darker orange for accents
};

const BonusSection: React.FC = () => (
  <View style={bonusStyles.container}>
    <View style={bonusStyles.card}>
      {/* Top row */}
      <View style={[bonusStyles.row, bonusStyles.mb3]}>
        <Text style={bonusStyles.title}>Earn Your Bonus</Text>
        <View style={bonusStyles.row}>
          <Gift size={20} color={COLORS.primary} style={bonusStyles.iconSpacing} />
          <ChevronRight size={16} color={COLORS.textTertiary} />
        </View>
      </View>

      {/* Inner white box */}
      <View style={bonusStyles.innerBox}>
        {/* Content and button side by side */}
        <View style={bonusStyles.contentContainer}>
          {/* Icon and text */}
          <View style={bonusStyles.contentRow}>
            <View style={bonusStyles.iconContainer}>
              <Target size={20} color={COLORS.primary} />
            </View>
            <View style={bonusStyles.textContainer}>
              <Text style={bonusStyles.innerTitle}>Betting Bonus</Text>
              <Text style={bonusStyles.innerText}>
                Fund your betting account with ₦100 or more and earn up to ₦10 cashback!
              </Text>
            </View>
          </View>
          
          {/* Action Button - Now properly positioned on the side */}
          <TouchableOpacity style={bonusStyles.button}>
            <Text style={bonusStyles.buttonText}>Claim Now</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FFF7ED', // Light orange background
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight, // Light orange border
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
    fontWeight: '600',
    color: COLORS.text,
    fontSize: 16,
  },
  iconSpacing: {
    marginRight: 8,
  },
  innerBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FFEDD5', // Very light orange
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  innerTitle: {
    fontWeight: '600',
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 4,
  },
  innerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexShrink: 0, // Prevent button from shrinking
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});