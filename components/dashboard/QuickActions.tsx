// components/dashboard/QuickActions.tsx
import { useRouter } from 'expo-router';
import { QrCode, Scan, Send, ArrowDownLeft, Camera } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

const QuickActions = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const actions = [
    { 
      icon: Scan, 
      label: 'Scan & Pay', 
      onPress: () => router.push('/scan'),
      gradient: [theme.colors.mint, theme.colors.blue]
    },
    { 
      icon: Send, 
      label: 'Send', 
      onPress: () => router.push('/send-money'),
      gradient: [theme.colors.violet, theme.colors.pink]
    },
    { 
      icon: QrCode, 
      label: 'My QR', 
      onPress: () => router.push('/my-qr'),
      gradient: [theme.colors.primary, theme.colors.violet]
    },
    { 
      icon: ArrowDownLeft, 
      label: 'Request', 
      onPress: () => router.push('/request-money'),
      gradient: [theme.colors.blue, theme.colors.mint]
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
            <Text style={[styles.label, { color: theme.colors.text }]}>{action.label}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 12, fontWeight: '500' },
});

export default QuickActions;
