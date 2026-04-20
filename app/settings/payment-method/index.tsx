// app/settings/payment-methods.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, Plus, Trash2, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function PaymentMethods() {
  const router = useRouter();

  const cards = [
    { id: 1, type: 'Visa', last4: '1234', expiry: '12/26', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '5678', expiry: '08/25', isDefault: false },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <TouchableOpacity>
            <Plus size={22} color={C.violet} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <LinearGradient
              colors={[C.primary, C.violet]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <CreditCard size={24} color="#fff" />
                {card.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Star size={12} color={C.primary} />
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                <Text style={styles.cardType}>{card.type}</Text>
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.removeBtn}>
              <Trash2 size={18} color={C.error} />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addCardBtn}>
          <Plus size={20} color={C.violet} />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  card: { marginBottom: 20 },
  cardGradient: { borderRadius: 20, padding: 20, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  defaultBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  defaultText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  cardNumber: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 30, letterSpacing: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardExpiry: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  cardType: { fontSize: 14, fontWeight: '600', color: '#fff' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  removeText: { fontSize: 14, color: C.error, fontWeight: '500' },
  addCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.primaryLight, paddingVertical: 16, borderRadius: 14, marginTop: 12, marginBottom: 40 },
  addCardText: { fontSize: 16, fontWeight: '600', color: C.violet },
});