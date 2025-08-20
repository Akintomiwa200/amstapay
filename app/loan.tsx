import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';

const LoanServicesScreen = () => {
  const [selectedLoanType, setSelectedLoanType] = useState('');
  const router = useRouter();

  const loanTypes = [
    { id: 'quick', name: 'Quick Loan', amount: '₦5,000 - ₦50,000', duration: '1-3 months', interest: '5%' },
    { id: 'personal', name: 'Personal Loan', amount: '₦50,000 - ₦500,000', duration: '3-12 months', interest: '8%' },
    { id: 'business', name: 'Business Loan', amount: '₦500,000 - ₦5,000,000', duration: '6-24 months', interest: '12%' },
  ];

  const handleApply = (loanType) => {
    console.log('Applying for loan:', loanType);
    router.push('/loan-application');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loan Services</Text>
        <Text style={styles.subtitle}>Get instant loans with flexible repayment</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Available Loan Types</Text>
        
        {loanTypes.map(loan => (
          <View key={loan.id} style={styles.loanCard}>
            <Text style={styles.loanName}>{loan.name}</Text>
            
            <View style={styles.loanDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Range:</Text>
                <Text style={styles.detailValue}>{loan.amount}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{loan.duration}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Interest Rate:</Text>
                <Text style={styles.detailValue}>{loan.interest}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleApply(loan.id)}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
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
  loanCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  loanName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  loanDetails: { marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  applyButton: { backgroundColor: '#F97316', padding: 12, borderRadius: 8, alignItems: 'center' },
  applyButtonText: { color: '#FFFFFF', fontWeight: '600' },
});

export default LoanServicesScreen;