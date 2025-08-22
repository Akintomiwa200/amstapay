// app/payment-methods.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard, Building } from 'lucide-react-native';

const PaymentMethods = () => {
  const router = useRouter();
  const paymentMethods = [
    { id: 1, type: 'card', name: 'Visa •••• 4582', default: true },
    { id: 2, type: 'card', name: 'Mastercard •••• 7821', default: false },
    { id: 3, type: 'bank', name: 'GTBank •••• 1234', default: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Payment Methods List */}
        {paymentMethods.map((method) => (
          <TouchableOpacity key={method.id} style={styles.methodCard}>
            <View style={styles.methodLeft}>
              {method.type === 'card' ? (
                <CreditCard size={24} color="#FF8C00" />
              ) : (
                <Building size={24} color="#FF8C00" />
              )}
              <Text style={styles.methodName}>{method.name}</Text>
            </View>
            {method.default && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Add New Button */}
        <TouchableOpacity style={styles.addCardButton}>
          <Plus size={20} color="#FF8C00" />
          <Text style={styles.addCardText}>Add New Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodName: {
    fontSize: 16,
    color: '#000000',
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderStyle: 'dashed',
    borderRadius: 8,
    margin: 16,
    gap: 8,
  },
  addCardText: {
    color: '#FF8C00',
    fontWeight: '500',
  },
});

export default PaymentMethods;