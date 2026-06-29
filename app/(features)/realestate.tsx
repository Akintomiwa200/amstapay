import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Home } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { usePersonalization } from '@/context/PersonalizationContext';
import { realEstateService, type PropertyListing } from '@/services/realestate';
import { parseList } from '@/lib/parse';
import { formatMoney } from '@/lib/format';

export default function RealEstateScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { currency } = usePersonalization();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await realEstateService.getListings();
      setProperties(parseList<PropertyListing>(res));
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={[styles.header, { backgroundColor: c.primaryLight }]}>
        <Text style={[styles.headerTitle, { color: c.primary }]}>Real Estate</Text>
        <Text style={[styles.subtitle, { color: c.textSub }]}>Find your dream property</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 32 }} />
        ) : properties.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSub }]}>No listings available right now.</Text>
        ) : (
          properties.map((property) => (
            <TouchableOpacity
              key={property._id}
              style={[styles.propertyCard, { backgroundColor: c.bg, borderColor: c.border }]}
              onPress={() => router.push({ pathname: '/property-details', params: { id: property._id } })}
            >
              {property.image || property.images?.[0] ? (
                <Image source={{ uri: property.image || property.images?.[0] }} style={styles.propertyImage} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: c.primaryLight }]}>
                  <Home size={32} color={c.violet} />
                </View>
              )}
              <View style={styles.propertyDetails}>
                <Text style={[styles.propertyTitle, { color: c.text }]}>{property.title}</Text>
                <Text style={[styles.propertyLocation, { color: c.textSub }]}>{property.location}</Text>
                <Text style={[styles.propertyPrice, { color: c.violet }]}>
                  {formatMoney(property.price, property.currency || currency)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4 },
  content: { padding: 16 },
  empty: { textAlign: 'center', marginTop: 32 },
  propertyCard: { borderRadius: 16, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  propertyImage: { width: '100%', height: 160 },
  imagePlaceholder: { width: '100%', height: 160, alignItems: 'center', justifyContent: 'center' },
  propertyDetails: { padding: 14 },
  propertyTitle: { fontSize: 16, fontWeight: '700' },
  propertyLocation: { fontSize: 13, marginTop: 4 },
  propertyPrice: { fontSize: 18, fontWeight: '800', marginTop: 8 },
});
