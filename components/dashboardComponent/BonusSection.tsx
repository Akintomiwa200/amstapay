// components/dashboardComponent/BonusSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, ChevronRight, Target, Sparkles } from 'lucide-react-native';
import { C } from './colors';

const BonusSection: React.FC = () => (
  <View style={styles.container}>
    <LinearGradient
      colors={[C.primaryLight, C.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.row}>
          <Sparkles size={18} color={C.violet} />
          <Text style={styles.title}>Earn Your Bonus</Text>
        </View>
        <TouchableOpacity>
          <ChevronRight size={18} color={C.textSub} />
        </TouchableOpacity>
      </View>

      <View style={styles.innerBox}>
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Target size={22} color={C.violet} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.innerTitle}>Betting Bonus</Text>
            <Text style={styles.innerText}>
              Fund your betting account with ₦100 or more and earn up to ₦10 cashback instantly!
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={[C.mint, C.blue, C.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Claim Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 24 },
  card: { borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontWeight: '700', color: C.primary, fontSize: 16 },
  innerBox: { backgroundColor: C.bg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  contentRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: C.primaryLight,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: { flex: 1 },
  innerTitle: { fontWeight: '700', color: C.text, fontSize: 14, marginBottom: 4 },
  innerText: { fontSize: 12, color: C.textSub, lineHeight: 16 },
  button: { borderRadius: 30, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default BonusSection;