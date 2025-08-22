import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, BarChart3, PiggyBank, Target, Clock, Shield } from 'lucide-react-native';

const Invest = () => {
  const router = useRouter();

  const investmentOptions = [
    {
      icon: PiggyBank,
      title: 'Savings Plan',
      return: '10% per annum',
      minAmount: '₦5,000',
      duration: '30 days',
      risk: 'Low',
      color: '#F97316'
    },
    {
      icon: BarChart3,
      title: 'Growth Fund',
      return: '15% per annum',
      minAmount: '₦10,000',
      duration: '90 days',
      risk: 'Medium',
      color: '#EA580C'
    },
    {
      icon: Target,
      title: 'High Yield',
      return: '22% per annum',
      minAmount: '₦20,000',
      duration: '180 days',
      risk: 'High',
      color: '#C2410C'
    },
    {
      icon: Shield,
      title: 'Secure Bonds',
      return: '8% per annum',
      minAmount: '₦3,000',
      duration: '365 days',
      risk: 'Very Low',
      color: '#9A3412'
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invest</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>₦50,000.00</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <TrendingUp size={32} color="#F97316" />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Grow Your Money</Text>
            <Text style={styles.welcomeSubtitle}>
              Choose from our carefully curated investment options
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Investment Options</Text>
        
        {investmentOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <TouchableOpacity key={index} style={styles.investmentCard}>
              <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                <Icon size={24} color="#FFF" />
              </View>
              <View style={styles.investmentInfo}>
                <Text style={styles.investmentTitle}>{option.title}</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>{option.return}</Text>
                  <Text style={styles.detailText}>•</Text>
                  <Text style={styles.detailText}>{option.duration}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>Min: {option.minAmount}</Text>
                  <Text style={[styles.riskText, { 
                    color: option.risk === 'High' ? '#DC2626' : 
                           option.risk === 'Medium' ? '#F97316' : '#16A34A' 
                  }]}>
                    {option.risk} Risk
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.investButton}>
                <Text style={styles.investButtonText}>Invest</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Portfolio</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₦25,000</Text>
              <Text style={styles.statLabel}>Total Invested</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>+₦2,500</Text>
              <Text style={styles.statLabel}>Returns</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Active Plans</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Invest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceContainer: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  balanceText: {
    color: '#F97316',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  investmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  investButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  investButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statsSection: {
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});