// transaction-success.tsx (updated)
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, ArrowLeft, Download, Share2 } from 'lucide-react-native';

const TransactionSuccess = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    accountName = "John Doe",
    accountNumber = "1234567890",
    bank = "AmstaPay",
    amount = "₦5,000.00",
    date = new Date().toLocaleDateString(),
    time = new Date().toLocaleTimeString(),
    reference = "REF-123456789"
  } = params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/dashboard')}>
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <CheckCircle size={80} color="#10B981" style={styles.successIcon} />
          
          <Text style={styles.successTitle}>Payment Received!</Text>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.receivedFrom}>From: {accountName}</Text>
          
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Transaction Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Received From</Text>
              <Text style={styles.detailValue}>{accountName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sender's Account</Text>
              <Text style={styles.detailValue}>{accountNumber}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sender's Bank</Text>
              <Text style={styles.detailValue}>{bank}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{date} at {time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference</Text>
              <Text style={styles.detailValue}>{reference}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, styles.statusSuccess]}>Completed</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={20} color="#F97316" />
              <Text style={styles.actionButtonText}>Download Receipt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#F97316" />
              <Text style={styles.actionButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => router.replace('/dashboard')}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#10B981',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2937',
  },
  receivedFrom: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  statusSuccess: {
    color: '#10B981',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#F97316',
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#F97316',
    fontWeight: '500',
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#F97316',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});