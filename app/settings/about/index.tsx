// app/settings/about.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Info, Shield, Star, ExternalLink, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function AboutScreen() {
  const router = useRouter();

  const infoItems = [
    { icon: Info, label: 'Version', value: '1.0.0' },
    { icon: Shield, label: 'Build Number', value: '100' },
    { icon: Star, label: 'License', value: 'Proprietary' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[C.mint, C.blue, C.violet, C.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoCircle}
          >
            <Text style={styles.logoText}>A</Text>
          </LinearGradient>
          <Text style={styles.appName}>AmstaPay</Text>
          <Text style={styles.tagline}>Your Trusted Financial Partner</Text>
        </View>

        {/* Info Items */}
        <View style={styles.infoSection}>
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <View key={index} style={styles.infoItem}>
                <Icon size={20} color={C.violet} />
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            );
          })}
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            AmstaPay is a secure and innovative financial platform that empowers users 
            to send, receive, and manage money seamlessly. With advanced security features 
            and a user-friendly interface, we're making financial services accessible to everyone.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.linksSection}>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://amstapay.com/terms')}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <ExternalLink size={16} color={C.violet} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://amstapay.com/privacy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <ExternalLink size={16} color={C.violet} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Heart size={14} color={C.error} />
          <Text style={styles.copyright}>
            © 2024 AmstaPay. All rights reserved.
          </Text>
        </View>
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
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  appName: { fontSize: 24, fontWeight: '800', color: C.primary, marginBottom: 4 },
  tagline: { fontSize: 13, color: C.textSub },
  infoSection: { backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, marginBottom: 24 },
  infoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel: { flex: 1, marginLeft: 12, fontSize: 14, color: C.text },
  infoValue: { fontSize: 14, fontWeight: '500', color: C.primary },
  descriptionSection: { marginBottom: 24 },
  description: { fontSize: 14, color: C.text, lineHeight: 22, textAlign: 'center' },
  linksSection: { marginBottom: 32 },
  linkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.primaryLight, padding: 16, borderRadius: 14, marginBottom: 12 },
  linkText: { fontSize: 15, fontWeight: '500', color: C.text },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 40 },
  copyright: { fontSize: 12, color: C.textSub },
});