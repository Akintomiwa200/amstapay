import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, GraduationCap, Search, Calendar, DollarSign } from 'lucide-react-native';

const SchoolFees = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
        
        {institutions.map((institution, index) => (
          <TouchableOpacity key={index} style={styles.institutionCard}>
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
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

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
});