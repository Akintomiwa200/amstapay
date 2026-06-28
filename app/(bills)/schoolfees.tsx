import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, GraduationCap, Search, Calendar, DollarSign } from 'lucide-react-native';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess } from '@/lib/billPayment';

const SchoolFees = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const institutions = [
    {
      name: 'University of Lagos',
      code: 'UNILAG',
      logo: '🎓',
      recentPayment: '₦150,000',
      date: '12 Jan 2024'
    },
    {
      name: 'Covenant University',
      code: 'CU',
      logo: '🏫',
      recentPayment: '₦250,000',
      date: '5 Jan 2024'
    },
    {
      name: 'University of Ibadan',
      code: 'UI',
      logo: '📚',
      recentPayment: '₦120,000',
      date: '20 Dec 2023'
    },
    {
      name: 'LASU',
      code: 'LASU',
      logo: '🎒',
      recentPayment: '₦80,000',
      date: '15 Dec 2023'
    },
  ];

  const filtered = institutions.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePayFees = async () => {
    const schoolName = selectedSchool || filtered[0]?.name;
    const amountValue = Number(amount);
    if (!schoolName || !studentId || !Number.isFinite(amountValue) || amountValue < 100) {
      Alert.alert('Invalid input', 'Select a school, enter student ID, and amount from ₦100.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.paySchoolFees({
        studentId,
        amount: amountValue,
        schoolName,
      });
      handleBillSuccess(router, result, 'School fees payment completed.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>School Fees</Text>
        <View style={styles.headerIcon}>
          <BookOpen size={20} color="#F97316" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for institution..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <GraduationCap size={24} color="#F97316" />
            <Text style={styles.quickActionText}>Pay Fees</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <DollarSign size={24} color="#F97316" />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Calendar size={24} color="#F97316" />
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Institutions</Text>
        
        {filtered.map((institution, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.institutionCard, selectedSchool === institution.name && { borderColor: '#F97316' }]}
            onPress={() => setSelectedSchool(institution.name)}
          >
            <View style={styles.institutionLogo}>
              <Text style={styles.logoText}>{institution.logo}</Text>
            </View>
            <View style={styles.institutionInfo}>
              <Text style={styles.institutionName}>{institution.name}</Text>
              <Text style={styles.institutionCode}>{institution.code}</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentAmount}>{institution.recentPayment}</Text>
              <Text style={styles.paymentDate}>{institution.date}</Text>
            </View>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => {
                setSelectedSchool(institution.name);
                setAmount(institution.recentPayment.replace(/[₦,]/g, ''));
              }}
            >
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.paymentForm}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <Text style={styles.formLabel}>School</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Select a school above"
            value={selectedSchool}
            onChangeText={setSelectedSchool}
          />
          <Text style={styles.formLabel}>Student ID</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter student ID"
            value={studentId}
            onChangeText={setStudentId}
          />
          <Text style={styles.formLabel}>Amount (₦)</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.promoButton, submitting && { opacity: 0.7 }]}
            onPress={handlePayFees}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.promoButtonText}>Pay School Fees</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>🎉 Special Offer</Text>
          <Text style={styles.promoText}>
            Get 5% cashback on all school fees payments this semester!
          </Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SchoolFees;

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
  headerIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 12,
    width: '30%',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  institutionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  institutionLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  logoText: {
    fontSize: 20,
  },
  institutionInfo: {
    flex: 1,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  institutionCode: {
    fontSize: 12,
    color: '#666',
  },
  paymentInfo: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  payButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  promoSection: {
    backgroundColor: '#FFF7ED',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: '#F97316',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  paymentForm: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
});