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
  Smartphone, // Better icon for Airtime
  PiggyBank,
  Shield,
  Target,
  Tv,
  Users,
  Zap,
  Wifi, // Better icon for Data
  DollarSign, // Better icon for Betting
  Banknote, // Better icon for Loan
  GraduationCap, // Better icon for School Fees
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
      Betting: '/betting',
      TV: '/tv',
      OWealth: '/amstawealth',
      Loan: '/loan',
      Invitation: '/invitation',
      Electricity: '/eletricity',
      Insurance: '/insurance',
      'Bank Transfer': '/bank-transfer',
      'Gift Cards': '/giftcard',
      Transport: '/transport',
      'Real Estate': '/realestate',
      Gaming: '/gaming',
      'School Fees': '/schoolfees'
    };
  
    if (routes[service]) {
      router.push(routes[service] as any); 
    } else {
      console.warn(`No route defined for service: ${service}`);
    }
  };
  
  const mainServices: Service[] = [
    { icon: Smartphone, label: 'Airtime', badge: 'Up to 5%' }, // Changed from Phone to Smartphone
    { icon: Wifi, label: 'Data', badge: 'Up to 5%' }, // Changed from Database to Wifi
    { icon: DollarSign, label: 'Betting' }, // Changed from Target to DollarSign
    { icon: Tv, label: 'TV' },
    { icon: PiggyBank, label: 'OWealth' },
    { icon: Banknote, label: 'Loan' }, // Changed from Users to Banknote
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
    { icon: GraduationCap, label: 'School Fees' }, // Changed from Book to GraduationCap
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
                <Icon size={24} color="#F97316" />
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
    marginBottom: 20,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderColor: '#F97316', 
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    borderWidth: 1,
    color: '#F97316', // Orange-600 border
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EA580C', // Orange-600
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#1F2937', // Dark gray
    textAlign: 'center',
    fontWeight: '500',
  },
});