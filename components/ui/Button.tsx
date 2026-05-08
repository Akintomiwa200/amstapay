import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
}

export function Button({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon, fullWidth = false, gradient = false,
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const getSize = () => {
    switch (size) {
      case 'sm': return { height: 40, paddingHorizontal: 16, fontSize: 13 };
      case 'lg': return { height: 56, paddingHorizontal: 28, fontSize: 17 };
      default: return { height: 48, paddingHorizontal: 24, fontSize: 15 };
    }
  };

  const sizeStyle = getSize();

  const getBackground = () => {
    if (isDisabled) return theme.colors.border;
    switch (variant) {
      case 'secondary': return theme.colors.primaryLight;
      case 'outline':
      case 'ghost': return 'transparent';
      case 'danger': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (isDisabled) return theme.colors.textLight;
    switch (variant) {
      case 'secondary': return theme.colors.primary;
      case 'outline':
      case 'ghost': return theme.colors.primary;
      case 'danger': return '#FFFFFF';
      default: return '#FFFFFF';
    }
  };

  const content = (
    <View style={[styles.content, { gap: icon ? 8 : 0 }]}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor(), fontSize: sizeStyle.fontSize }]}>
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (gradient && !isDisabled && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth]}
      >
        <LinearGradient
          colors={[theme.colors.mint, theme.colors.blue, theme.colors.violet, theme.colors.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            {
              height: sizeStyle.height,
              paddingHorizontal: sizeStyle.paddingHorizontal,
              borderRadius: theme.borderRadius.lg,
              opacity: isDisabled ? 0.6 : 1,
            },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBackground(),
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderRadius: theme.borderRadius.lg,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? theme.colors.primary : undefined,
          opacity: isDisabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

