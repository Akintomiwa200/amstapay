import { useRouter } from 'expo-router';
import { QrCode, Send, ArrowDownLeft, Plus, Receipt } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

const QuickActions = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const actions = [
    {
      icon: Plus,
      label: 'Add Money',
      onPress: () => router.push('/add-money'),
      gradient: [theme.colors.mint, theme.colors.blue],
    },
    {
      icon: Send,
      label: 'Transfer',
      onPress: () => router.push('/send-money'),
      gradient: [theme.colors.violet, theme.colors.pink],
    },
    {
      icon: Receipt,
      label: 'Pay Bills',
      onPress: () => router.push('/data'),
      gradient: [theme.colors.primary, theme.colors.violet],
    },
    {
      icon: QrCode,
      label: 'Snap & Pay',
      onPress: () => router.push('/snap-pay'),
      gradient: [theme.colors.blue, theme.colors.mint],
    },
    {
      icon: ArrowDownLeft,
      label: 'Request',
      onPress: () => router.push('/request-money'),
      gradient: [theme.colors.pink, theme.colors.violet],
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
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
              colors={action.gradient as [string, string]}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 28,
  },
  actionWrapper: { alignItems: 'center', gap: 8, width: 72 },
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
  label: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
});

export default QuickActions;
