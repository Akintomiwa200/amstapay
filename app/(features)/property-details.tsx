// app/property-details.tsx - Property Details Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MapPin, BedDouble, Bath, Maximize2, Heart, Share2, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        <LinearGradient colors={[c.violet, c.primary]} style={styles.imagePlaceholder}>
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
          <Text style={[styles.propertyTitle, { color: c.primary }]}>Luxury 3 Bedroom Apartment</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={c.violet} />
            <Text style={[styles.location, { color: c.textSub }]}>Lekki Phase 1, Lagos</Text>
          </View>
          <Text style={[styles.price, { color: c.violet }]}>₦45,000,000</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={[styles.featureItem, { backgroundColor: c.primaryLight }]}>
            <BedDouble size={20} color={c.violet} />
            <Text style={[styles.featureValue, { color: c.text }]}>3</Text>
            <Text style={[styles.featureLabel, { color: c.textSub }]}>Bedrooms</Text>
          </View>
          <View style={[styles.featureItem, { backgroundColor: c.primaryLight }]}>
            <Bath size={20} color={c.blue} />
            <Text style={[styles.featureValue, { color: c.text }]}>3</Text>
            <Text style={[styles.featureLabel, { color: c.textSub }]}>Bathrooms</Text>
          </View>
          <View style={[styles.featureItem, { backgroundColor: c.primaryLight }]}>
            <Maximize2 size={20} color={c.mint} />
            <Text style={[styles.featureValue, { color: c.text }]}>250</Text>
            <Text style={[styles.featureLabel, { color: c.textSub }]}>Sqm</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Description</Text>
          <Text style={[styles.description, { color: c.textSub }]}>
            A stunning luxury apartment located in the heart of Lekki Phase 1. 
            Features include modern finishes, a spacious living area, fitted kitchen, 
            24/7 power supply, ample parking, and excellent security. 
            Perfect for families or professionals looking for a premium living experience.
          </Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {['Swimming Pool', '24/7 Power', 'Gym', 'Parking', 'Security', 'Elevator'].map((amenity, i) => (
              <View key={i} style={[styles.amenityTag, { backgroundColor: c.primaryLight }]}>
                <Text style={[styles.amenityText, { color: c.text }]}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Investment Info */}
        <View style={styles.investSection}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.investCard}>
            <Text style={styles.investTitle}>Investment Opportunity</Text>
            <Text style={styles.investSub}>Estimated annual return: 12-15%</Text>
            <Text style={styles.investSub}>Minimum investment: ₦5,000,000</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        <TouchableOpacity style={[styles.contactBtn, { borderColor: c.violet }]}>
          <Phone size={20} color={c.violet} />
          <Text style={[styles.contactText, { color: c.violet }]}>Contact Agent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.investBtn} activeOpacity={0.85}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.investGradient}>
            <Text style={styles.investBtnText}>Invest Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { height: 280, position: 'relative' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageText: { fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  imageOverlay: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  imageActions: { flexDirection: 'row', gap: 8 },
  imgAction: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  titleSection: { marginBottom: 20 },
  propertyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  location: { fontSize: 14 },
  price: { fontSize: 24, fontWeight: '800' },
  featuresRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  featureItem: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4 },
  featureValue: { fontSize: 18, fontWeight: '800' },
  featureLabel: { fontSize: 11 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 14, lineHeight: 22 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityTag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  amenityText: { fontSize: 13, fontWeight: '500' },
  investSection: { marginBottom: 24 },
  investCard: { borderRadius: 20, padding: 24, gap: 8 },
  investTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  investSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  footer: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, gap: 12, borderTopWidth: 1 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14 },
  contactText: { fontSize: 14, fontWeight: '600' },
  investBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  investGradient: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  investBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
