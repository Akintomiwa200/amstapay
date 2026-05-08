import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secure?: boolean;
  icon?: React.ReactNode;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  hint?: string;
}

export function Input({
  label, placeholder, value, onChangeText, error, secure,
  icon, keyboardType, autoCapitalize = 'none', autoComplete,
  multiline, numberOfLines, editable = true, hint,
}: InputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secure);

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: error ? theme.colors.error : focused ? theme.colors.primary : theme.colors.border,
            opacity: editable ? 1 : 0.5,
          },
          multiline && { height: 'auto', minHeight: 100, paddingVertical: 12 },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text },
            multiline && styles.multiline,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eye}>
            {visible ? <EyeOff size={18} color={theme.colors.textSecondary} /> : <Eye size={18} color={theme.colors.textSecondary} />}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
      {hint && !error && <Text style={[styles.hint, { color: theme.colors.textLight }]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, letterSpacing: 0.2 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 54,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },
  multiline: { textAlignVertical: 'top', paddingTop: 0 },
  eye: { padding: 4 },
  error: { fontSize: 12, marginTop: 5, marginLeft: 2, fontWeight: '500' },
  hint: { fontSize: 12, marginTop: 4, marginLeft: 2 },
});

