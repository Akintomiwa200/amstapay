import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowDownLeft, Building } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const QuickActions = () => {
  const router = useRouter();

  const actions = [
    { icon: ArrowDownLeft, label: 'To Amsta User' },
    { icon: Building, label: 'To Other Bank' },
    { icon: ArrowDownLeft, label: 'Withdraw' },
  ];

  const handleOpenScanner = () => {
    router.push('/scan'); // Navigate to QR code scan screen
  };

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <TouchableOpacity
            key={index}
            style={styles.actionWrapper}
            onPress={handleOpenScanner}
          >
            <View style={styles.iconContainer}>
              <Icon size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#F97316', // Orange-500 background
    borderWidth: 1,
    borderColor: '#EA580C', // Orange-600 border
  },
  label: {
    fontSize: 12,
    color: '#1F2937', // Dark gray text
    fontWeight: '500',
  },
});