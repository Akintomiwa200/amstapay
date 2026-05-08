import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Home } from 'lucide-react-native';

const RealEstateScreen = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const router = useRouter();

  const properties = [
    {
      id: '1',
      title: '3-Bedroom Apartment',
      location: 'Lekki Phase 1, Lagos',
      price: '₦25,000,000',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      features: ['3 Bedrooms', '2 Bathrooms', 'Parking']
    },
    {
      id: '2',
      title: 'Office Space',
      location: 'Victoria Island, Lagos',
      price: '₦15,000,000',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
      features: ['200 sqm', 'Fully Furnished', '24/7 Security']
    },
    {
      id: '3',
      title: 'Land Plot',
      location: 'Epe, Lagos',
      price: '₦8,000,000',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
      features: ['500 sqm', 'Dry Land', 'Good Road Access']
    }
  ];

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    router.push('/property-details');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Real Estate</Text>
        <Text style={styles.subtitle}>Find your dream property</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Available Properties</Text>
        
        {properties.map(property => (
          <View key={property.id} style={styles.propertyCard}>
            <Image source={{ uri: property.image }} style={styles.propertyImage} />
            
            <View style={styles.propertyDetails}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <Text style={styles.propertyLocation}>{property.location}</Text>
              
              <View style={styles.featuresContainer}>
                {property.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.propertyPrice}>{property.price}</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewDetails(property)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  propertyCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  propertyImage: { width: '100%', height: 200 },
  propertyDetails: { padding: 16 },
  propertyTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  propertyLocation: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  featuresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  featureTag: { backgroundColor: '#FFEDD5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  featureText: { fontSize: 12, color: '#F97316' },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  propertyPrice: { fontSize: 18, fontWeight: 'bold', color: '#F97316' },
  viewButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  viewButtonText: { color: '#FFFFFF', fontWeight: '500' },
});

export default RealEstateScreen;