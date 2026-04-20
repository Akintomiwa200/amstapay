// components/dashboardComponent/ServicesGrid.tsx
import { useRouter } from 'expo-router';
import {
  Smartphone, Wifi, DollarSign, Tv, PiggyBank, Banknote, Mail,
  Zap, Shield, CreditCard, Gift, Car, Home, Gamepad2, GraduationCap,
  MoreHorizontal, ChevronUp, Scan, Camera, Send, QrCode
} from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from './colors';

type Service = {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  badge?: string;
  route?: string;
};

const ServicesGrid: React.FC = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

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
      AmstaWealth: '/amstawealth',
      Loan: '/loan',
      Electricity: '/electricity',
      'Bank Transfer': '/bank-transfer',
      'Gift Cards': '/giftcard',
      'School Fees': '/schoolfees',
    };
  
    const targetRoute = route || routes[service];
    if (targetRoute) router.push(targetRoute as any);
  };
  
  const mainServices: Service[] = [
    { icon: Scan, label: 'Scan & Send', badge: 'Web3', route: '/scan-send' },
    { icon: Camera, label: 'Snap & Pay', badge: 'New', route: '/snap-pay' },
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
      <Text style={styles.sectionTitle}>Services</Text>
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
              <View style={styles.iconWrapper}>
                <Icon size={24} color={C.violet} />
                {service.badge && (
                  <View style={[styles.badge, service.badge === 'Web3' && styles.web3Badge]}>
                    <Text style={styles.badgeText}>{service.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.label}>{service.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  item: { width: '22%', alignItems: 'center', marginBottom: 20 },
  iconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: C.primaryLight,
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
    backgroundColor: C.mint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 30,
    alignItems: 'center',
  },
  web3Badge: { backgroundColor: C.violet },
  badgeText: { color: C.primary, fontSize: 8, fontWeight: 'bold' },
  label: { fontSize: 11, color: C.text, textAlign: 'center', fontWeight: '500' },
});

export default ServicesGrid;