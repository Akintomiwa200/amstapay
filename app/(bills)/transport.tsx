import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { billsService } from '@/services/bills';
import { handleBillError, handleBillSuccess } from '@/lib/billPayment';

const TransportScreen = () => {
  const [serviceType, setServiceType] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const serviceTypes = [
    { id: 'ride', name: 'Ride' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'rental', name: 'Car Rental' },
  ];

  const vehicles = [
    { id: 'bike', name: 'Bike', price: '₦150/km', estimated: '5 min' },
    { id: 'car', name: 'Car', price: '₦250/km', estimated: '7 min' },
    { id: 'van', name: 'Van', price: '₦400/km', estimated: '10 min' },
  ];

  const estimatedAmount = useMemo(() => {
    const rates: Record<string, number> = { bike: 1500, car: 2500, van: 4000 };
    return rates[selectedVehicle] || 0;
  }, [selectedVehicle]);

  const isFormValid = !!serviceType && !!pickupLocation && !!destination && !!selectedVehicle;

  const handleBook = async () => {
    if (!isFormValid) {
      Alert.alert('Invalid input', 'Complete all transport booking fields.');
      return;
    }
    try {
      setSubmitting(true);
      const result = await billsService.payTransport({
        amount: estimatedAmount,
        transportType: serviceType,
        route: `${pickupLocation} → ${destination}`,
        bookingReference: `${selectedVehicle}-${Date.now()}`,
      });
      handleBillSuccess(router, result, 'Transport booking completed.');
    } catch (error) {
      handleBillError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transport Services</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Service Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type</Text>
          <View style={styles.serviceGrid}>
            {serviceTypes.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceButton,
                  serviceType === service.id && styles.serviceButtonSelected
                ]}
                onPress={() => setServiceType(service.id)}
              >
                <Text style={[
                  styles.serviceText,
                  serviceType === service.id && styles.serviceTextSelected
                ]}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pickup Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pickup Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />
        </View>

        {/* Destination */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        {/* Vehicle Selection */}
        {pickupLocation && destination && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Vehicle</Text>
            <View style={styles.vehicleContainer}>
              {vehicles.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleButton,
                    selectedVehicle === vehicle.id && styles.vehicleButtonSelected
                  ]}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                >
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePrice}>{vehicle.price}</Text>
                  <Text style={styles.vehicleTime}>Est: {vehicle.estimated}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.button, (!isFormValid || submitting) && styles.buttonDisabled]}
          onPress={handleBook}
          disabled={!isFormValid || submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Book Now</Text>}
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
  serviceGrid: { flexDirection: 'row', gap: 12 },
  serviceButton: { flex: 1, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  serviceButtonSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },
  serviceText: { color: '#6B7280', fontWeight: '500' },
  serviceTextSelected: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, fontSize: 16 },
  vehicleContainer: { gap: 12 },
  vehicleButton: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  vehicleButtonSelected: { borderColor: '#F97316', backgroundColor: '#FFEDD5' },
  vehicleName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  vehiclePrice: { fontSize: 14, color: '#F97316', fontWeight: '500', marginBottom: 2 },
  vehicleTime: { fontSize: 12, color: '#6B7280' },
  button: { backgroundColor: '#F97316', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default TransportScreen;