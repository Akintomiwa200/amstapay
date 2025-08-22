import { useRouter } from 'expo-router';
import { ArrowUpRight, ArrowDownLeft, SendIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuickActions = () => {
  const router = useRouter();

  const actions = [
    { icon: SendIcon, label: 'Send Money', onPress: () => router.push('/scan') },
    { icon: ArrowDownLeft, label: 'Receive Money', onPress: () => router.push('/checkscan') },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <TouchableOpacity
            key={index}
            style={styles.actionWrapper}
            onPress={action.onPress}
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
    width: 96,
    height: 32,
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