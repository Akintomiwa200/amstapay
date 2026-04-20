// components/dashboardComponent/QuickAction.tsx
import { useRouter } from 'expo-router';
import { QrCode, Scan, Send, ArrowDownLeft, Camera } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './colors';

const QuickActions = () => {
  const router = useRouter();

  const actions = [
    { 
      icon: Scan, 
      label: 'Scan & Pay', 
      onPress: () => router.push('/scan'),
      gradient: [C.mint, C.blue]
    },
    { 
      icon: Send, 
      label: 'Send', 
      onPress: () => router.push('/send-money'),
      gradient: [C.violet, C.pink]
    },
    { 
      icon: QrCode, 
      label: 'My QR', 
      onPress: () => router.push('/my-qr'),
      gradient: [C.primary, C.violet]
    },
    { 
      icon: ArrowDownLeft, 
      label: 'Request', 
      onPress: () => router.push('/request-money'),
      gradient: [C.blue, C.mint]
    },
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
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={action.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Icon size={22} color="#fff" />
            </LinearGradient>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  actionWrapper: { alignItems: 'center', gap: 8 },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 12, color: C.text, fontWeight: '500' },
});

export default QuickActions;