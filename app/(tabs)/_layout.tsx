import { Tabs } from 'expo-router/tabs';
import { useTheme } from '@/context/ThemeContext';
import { Home, DollarSign, CreditCard, Gift, User } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();
  const c = theme.colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 60,
          backgroundColor: theme.colors.surface,
          borderRadius: 30,
          paddingHorizontal: 12,
          shadowColor: c.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 8,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: c.violet,
        tabBarInactiveTintColor: c.textSub,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Home} color={color} size={focused ? 22 : 20} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={DollarSign} color={color} size={focused ? 22 : 20} focused={focused} label="Finance" />
          ),
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={CreditCard} color={color} size={focused ? 22 : 20} focused={focused} label="Cards" />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Gift} color={color} size={focused ? 22 : 20} focused={focused} label="Rewards" />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={User} color={color} size={focused ? 22 : 20} focused={focused} label="Me" />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ Icon, color, size, focused, label }: any) {
  const { theme } = useTheme();
  const c = theme.colors;
  if (focused) {
    return (
      <View style={[styles.pill, { backgroundColor: c.primaryLight }]}>
        <Icon size={size} color={color} strokeWidth={2} />
        <Text style={[styles.pillLabel, { color: c.violet }]}>{label}</Text>
      </View>
    );
  }
  return <Icon size={size} color={color} strokeWidth={1.8} />;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
