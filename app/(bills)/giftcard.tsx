import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess } from '@/lib/billPayment';

const GiftCardsScreen = () => {
  const [selectedCard, setSelectedCard] = useState('');
  const [denomination, setDenomination] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const giftCards = [
    { id: 'amazon', name: 'Amazon', denominations: [10, 25, 50, 100] },
    { id: 'steam', name: 'Steam', denominations: [20, 50, 100] },
    { id: 'googleplay', name: 'Google Play', denominations: [10, 25, 50] },
    { id: 'appstore', name: 'App Store', denominations: [15, 25, 50, 100] },
    { id: 'razergold', name: 'Razer Gold', denominations: [10, 20, 50, 100] },
    { id: 'sephora', name: 'Sephora', denominations: [25, 50, 100] },
  ];

  const denominationValue = useMemo(() => Number(denomination), [denomination]);
  const quantityValue = useMemo(() => Number(quantity) || 1, [quantity]);
  const isFormValid = !!selectedCard && Number.isFinite(denominationValue) && denominationValue > 0;

  const handlePurchase = async () => {
    if (!isFormValid) {
      Alert.alert('Invalid input', 'Select a gift card and denomination.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.buyGiftCard({
        brand: selectedCard,
        denomination: denominationValue,
        quantity: quantityValue,
        email: email || undefined,
      });
      handleBillSuccess(router, result, 'Gift card purchased successfully.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gift Cards</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Card Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Gift Card</Text>
          <View style={styles.grid}>
            {giftCards.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.gridButton,
                  selectedCard === card.id && styles.gridButtonSelected
                ]}
                onPress={() => setSelectedCard(card.id)}
              >
                <Text style={[
                  styles.gridButtonText,
                  selectedCard === card.id && styles.gridButtonTextSelected
                ]}>
                  {card.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Denomination Selection */}
        {selectedCard && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Denomination ($)</Text>
            <View style={styles.denominationGrid}>
              {giftCards.find(card => card.id === selectedCard)?.denominations.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.denominationButton,
                    denomination === amount.toString() && styles.denominationButtonSelected
                  ]}
                  onPress={() => setDenomination(amount.toString())}
                >
                  <Text style={[
                    styles.denominationText,
                    denomination === amount.toString() && styles.denominationTextSelected
                  ]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handlePurchase}
          disabled={!isFormValid || submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Purchase Gift Card</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  formContainer: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', minWidth: 100, alignItems: 'center' },
  gridButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  gridButtonText: { color: '#6B7280', fontWeight: '500' },
  gridButtonTextSelected: { color: '#FFFFFF' },
  denominationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  denominationButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  denominationButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  denominationText: { color: '#6B7280', fontWeight: '500' },
  denominationTextSelected: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, fontSize: 16 },
  button: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default GiftCardsScreen;