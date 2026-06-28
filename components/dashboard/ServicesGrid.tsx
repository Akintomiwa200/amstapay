// components/dashboard/ServicesGrid.tsx
import { useRouter } from 'expo-router';
import {
  Smartphone, Wifi, DollarSign, Tv, PiggyBank, Banknote, Mail,
  Zap, Shield, CreditCard, Gift, Car, Home, Gamepad2, GraduationCap,
  MoreHorizontal, ChevronUp, Scan, Camera, Send, QrCode
} from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Service = {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  badge?: string;
  route?: string;
};

const ServicesGrid: React.FC = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  const handleNavigation = (service: string, route?: string): void => {
    if (service === 'More' || service === 'Less') {
      setIsExpanded(!isExpanded);
      return;
    }
    
    const routes: Record<string, string> = {
      'Scan & Send': '/scan-send',
      Airtime: '/airtime',
      Data: '/data',
      Betting: '/betting',
      TV: '/tv',
      AmstaWealth: '/amsta-wealth',
      Loan: '/loan',
      Electricity: '/electricity',
      'Bank Transfer': '/register-account',
      'Gift Cards': '/giftcard',
      'School Fees': '/schoolfees',
      Insurance: '/insurance',
      Transport: '/transport',
      'Real Estate': '/realestate',
      Gaming: '/gaming',
      Invitation: '/invitation',
    };
  
    const targetRoute = route || routes[service];
    if (targetRoute) router.push(targetRoute as any);
  };
  
  const mainServices: Service[] = [
    { icon: Camera, label: 'Snap & Pay', badge: 'New', route: '/snap-pay' },
    { icon: Scan, label: 'Scan & Send', badge: 'Web3', route: '/scan-send' },
    { icon: Send, label: 'Send Money', route: '/send-money' },
    { icon: QrCode, label: 'Receive', route: '/receive-money' },
    { icon: Smartphone, label: 'Airtime', badge: 'Up to 5%' },
    { icon: Wifi, label: 'Data', badge: 'Up to 5%' },
    { icon: DollarSign, label: 'Betting' },
    { icon: Tv, label: 'TV' },
    { icon: PiggyBank, label: 'AmstaWealth' },
    { icon: Banknote, label: 'Loan' },
    { icon: Mail, label: 'Invitation' },
    {
      icon: isExpanded ? ChevronUp : MoreHorizontal,
      label: isExpanded ? 'Less' : 'More',
    },
  ];
  
  const additionalServices: Service[] = [
    { icon: Zap, label: 'Electricity' },
    { icon: Shield, label: 'Insurance' },
    { icon: CreditCard, label: 'Bank Transfer' },
    { icon: Gift, label: 'Gift Cards' },
    { icon: Car, label: 'Transport' },
    { icon: Home, label: 'Real Estate' },
    { icon: Gamepad2, label: 'Gaming' },
    { icon: GraduationCap, label: 'School Fees' },
  ];
  
  const allServices = isExpanded ? [...mainServices, ...additionalServices] : mainServices;
  
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Services</Text>
      <View style={styles.grid}>
        {allServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handleNavigation(service.label, service.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryLight }]}>
                <Icon size={24} color={theme.colors.violet} />
                {service.badge && (
                  <View style={[styles.badge, service.badge === 'Web3' && styles.web3Badge]}>
                    <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{service.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, { color: theme.colors.text }]}>{service.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  item: { width: '22%', alignItems: 'center', marginBottom: 20 },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#22f0c3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 30,
    alignItems: 'center',
  },
  web3Badge: { backgroundColor: '#8b5cf6' },
  badgeText: { fontSize: 8, fontWeight: 'bold' },
  label: { fontSize: 11, textAlign: 'center', fontWeight: '500' },
});

export default ServicesGrid;
