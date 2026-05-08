import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PiggyBank } from 'lucide-react-native';

const AmstaWealthScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const router = useRouter();

  const investmentPlans = [
    { id: 'basic', name: 'Basic Plan', return: '10%', duration: '30 days', minAmount: 5000 },
    { id: 'premium', name: 'Premium Plan', return: '15%', duration: '60 days', minAmount: 20000 },
    { id: 'elite', name: 'Elite Plan', return: '25%', duration: '90 days', minAmount: 50000 },
  ];

  const handleInvest = (planId) => {
    console.log('Investing in plan:', planId);
    router.push('/invest-confirm');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AmstaWealth Investment</Text>
        <Text style={styles.subtitle}>Grow your money with secure investments</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Investment Plans</Text>
        
        {investmentPlans.map(plan => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planReturn}>{plan.return} Returns</Text>
            </View>
            
            <View style={styles.planDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{plan.duration}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Minimum</Text>
                <Text style={styles.detailValue}>₦{plan.minAmount.toLocaleString()}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.investButton}
              onPress={() => handleInvest(plan.id)}
            >
              <Text style={styles.investButtonText}>Invest Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  formContainer: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
  planCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  planReturn: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  planDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  investButton: { backgroundColor: '#F97316', padding: 12, borderRadius: 8, alignItems: 'center' },
  investButtonText: { color: '#FFFFFF', fontWeight: '600' },
});

export default AmstaWealthScreen;