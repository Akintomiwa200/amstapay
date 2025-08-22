import { CreditCard, Gift, Home, TrendingUp, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { icon: Home, label: 'Home', key: 'dashboard' },
  { icon: Gift, label: 'Rewards', key: 'reward' },
  { icon: TrendingUp, label: 'Finance', key: 'finance' },
  { icon: CreditCard, label: 'Cards', key: 'card' },
  { icon: User, label: 'Me', key: 'me' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => setActiveTab(item.key)}
            style={styles.item}
          >
            <Icon color={activeTab === item.key ? '#F97316' : '#9ca3af'} size={20} />
            <Text style={[styles.label, activeTab === item.key && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  item: { alignItems: 'center' },
  label: { fontSize: 10, color: '#9ca3af' },
  activeLabel: { color: '#F97316' },
});
