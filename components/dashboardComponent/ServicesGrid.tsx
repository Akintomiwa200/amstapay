import { useRouter } from 'expo-router';
import {
  Book,
  Car,
  ChevronUp,
  CreditCard,
  Database,
  Gamepad2,
  Gift,
  Home,
  Mail,
  MoreHorizontal,
  Phone,
  PiggyBank,
  Shield,
  Target,
  Tv,
  Users,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define a type for the services
type Service = {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  badge?: string; // Optional badge property
};

const ServicesGrid: React.FC = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleNavigation = (service: string): void => {
    if (service === 'More' || service === 'Less') {
      setIsExpanded(!isExpanded);
      return;
    }
  
    const routes: Record<string, string> = {
      Airtime: '/airtime',
      Data: '/data',
      Betting: '/scanner?type=betting',
      TV: '/tv-services',
      OWealth: '/owealth',
      Loan: '/loan-services',
      Invitation: '/invite',
      Electricity: '/electricity',
      Insurance: '/insurance',
      'Bank Transfer': '/bank-transfer',
      'Gift Cards': '/gift-cards',
      Transport: '/transport',
      'Real Estate': '/real-estate',
      Gaming: '/gaming',
    };
  
    if (routes[service]) {
      router.push(routes[service] as any); 
    } else {
      console.warn(`No route defined for service: ${service}`);
    }
  };
  const mainServices: Service[] = [
    { icon: Phone, label: 'Airtime', badge: 'Up to 5%' },
    { icon: Database, label: 'Data', badge: 'Up to 5%' },
    { icon: Target, label: 'Betting' },
    { icon: Tv, label: 'TV' },
    { icon: PiggyBank, label: 'OWealth' },
    { icon: Users, label: 'Loan' },
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
    { icon: Book, label: 'School Fees' },
  ];

  const allServices = isExpanded
    ? [...mainServices, ...additionalServices]
    : mainServices;

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {allServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handleNavigation(service.label)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon size={24} color="#000000" />
                {service.badge && (
                  <View style={styles.badge}>
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

export default ServicesGrid;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#000',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#000',
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFD700',
    fontSize: 9,
  },
  label: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
});