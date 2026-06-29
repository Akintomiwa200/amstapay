import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MapPin, BedDouble, Bath, Maximize2, Share2, Phone } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { realEstateService, type PropertyListing } from '@/services/realestate';
import { parseData } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await realEstateService.getById(id);
      setProperty(parseData<PropertyListing>(res));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <ActivityIndicator color={c.violet} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.textSub }}>Property not found</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: c.violet, marginTop: 12 }}>Go back</Text></TouchableOpacity>
      </View>
    );
  }

  const imageUri = property.image || property.images?.[0];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <LinearGradient colors={[c.violet, c.primary]} style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Property</Text>
          </LinearGradient>
        )}
        <View style={styles.imageOverlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: c.text }]}>{property.title}</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color={c.textSub} />
          <Text style={[styles.location, { color: c.textSub }]}>{property.location}</Text>
        </View>
        <Text style={[styles.price, { color: c.violet }]}>
          {formatMoney(property.price, property.currency || currency)}
        </Text>

        <View style={styles.featuresRow}>
          {property.bedrooms != null && (
            <View style={styles.feature}><BedDouble size={18} color={c.violet} /><Text style={{ color: c.text }}>{property.bedrooms} Beds</Text></View>
          )}
          {property.bathrooms != null && (
            <View style={styles.feature}><Bath size={18} color={c.violet} /><Text style={{ color: c.text }}>{property.bathrooms} Baths</Text></View>
          )}
          <View style={styles.feature}><Maximize2 size={18} color={c.violet} /><Text style={{ color: c.text }}>Listed</Text></View>
        </View>

        {property.description ? (
          <Text style={[styles.desc, { color: c.textSub }]}>{property.description}</Text>
        ) : null}

        {(property.features || []).map((f) => (
          <Text key={f} style={[styles.bullet, { color: c.text }]}>• {f}</Text>
        ))}

        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: c.violet }]} onPress={() => Linking.openURL('tel:+2348000000000')}>
          <Phone size={18} color="#fff" />
          <Text style={styles.contactText}>Contact Agent</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageContainer: { height: 260 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  imageOverlay: { position: 'absolute', top: 50, left: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  location: { fontSize: 14 },
  price: { fontSize: 26, fontWeight: '800', marginBottom: 16 },
  featuresRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  desc: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  bullet: { fontSize: 14, marginBottom: 4 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, marginTop: 20 },
  contactText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
