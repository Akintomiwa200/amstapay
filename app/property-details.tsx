// app/property-details.tsx - Property Details Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MapPin, BedDouble, Bath, Maximize2, Heart, Share2, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        <LinearGradient colors={[C.violet, C.primary]} style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Property Image</Text>
        </LinearGradient>
        <View style={styles.imageOverlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imgAction}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imgAction}>
              <Share2 size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title & Price */}
        <View style={styles.titleSection}>
          <Text style={styles.propertyTitle}>Luxury 3 Bedroom Apartment</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={C.violet} />
            <Text style={styles.location}>Lekki Phase 1, Lagos</Text>
          </View>
          <Text style={styles.price}>₦45,000,000</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <BedDouble size={20} color={C.violet} />
            <Text style={styles.featureValue}>3</Text>
            <Text style={styles.featureLabel}>Bedrooms</Text>
          </View>
          <View style={styles.featureItem}>
            <Bath size={20} color={C.blue} />
            <Text style={styles.featureValue}>3</Text>
            <Text style={styles.featureLabel}>Bathrooms</Text>
          </View>
          <View style={styles.featureItem}>
            <Maximize2 size={20} color={C.mint} />
            <Text style={styles.featureValue}>250</Text>
            <Text style={styles.featureLabel}>Sqm</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            A stunning luxury apartment located in the heart of Lekki Phase 1. 
            Features include modern finishes, a spacious living area, fitted kitchen, 
            24/7 power supply, ample parking, and excellent security. 
            Perfect for families or professionals looking for a premium living experience.
          </Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {['Swimming Pool', '24/7 Power', 'Gym', 'Parking', 'Security', 'Elevator'].map((amenity, i) => (
              <View key={i} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Investment Info */}
        <View style={styles.investSection}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.investCard}>
            <Text style={styles.investTitle}>Investment Opportunity</Text>
            <Text style={styles.investSub}>Estimated annual return: 12-15%</Text>
            <Text style={styles.investSub}>Minimum investment: ₦5,000,000</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactBtn}>
          <Phone size={20} color={C.violet} />
          <Text style={styles.contactText}>Contact Agent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.investBtn} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.investGradient}>
            <Text style={styles.investBtnText}>Invest Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  imageContainer: { height: 280, position: 'relative' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageText: { fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  imageOverlay: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  imageActions: { flexDirection: 'row', gap: 8 },
  imgAction: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  titleSection: { marginBottom: 20 },
  propertyTitle: { fontSize: 22, fontWeight: '800', color: C.primary, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  location: { fontSize: 14, color: C.textSub },
  price: { fontSize: 24, fontWeight: '800', color: C.violet },
  featuresRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  featureItem: { flex: 1, backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4 },
  featureValue: { fontSize: 18, fontWeight: '800', color: C.text },
  featureLabel: { fontSize: 11, color: C.textSub },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 12 },
  description: { fontSize: 14, color: C.textSub, lineHeight: 22 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityTag: { backgroundColor: C.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  amenityText: { fontSize: 13, fontWeight: '500', color: C.text },
  investSection: { marginBottom: 24 },
  investCard: { borderRadius: 20, padding: 24, gap: 8 },
  investTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  investSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  footer: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, gap: 12, borderTopWidth: 1, borderTopColor: C.border },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: C.violet, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14 },
  contactText: { fontSize: 14, fontWeight: '600', color: C.violet },
  investBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  investGradient: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  investBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
