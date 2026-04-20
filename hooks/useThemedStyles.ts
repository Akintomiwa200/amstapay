// hooks/useThemedStyles.ts
import { useTheme } from '../context/ThemeContext';
import { StyleSheet } from 'react-native';

export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (theme: any) => T
): T => {
  const { theme } = useTheme();
  return styleCreator(theme);
};