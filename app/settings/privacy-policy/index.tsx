// app/settings/privacy-policy.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Shield, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield size={48} color={C.violet} />
        </View>

        <Text style={styles.lastUpdated}>Last Updated: January 1, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect information you provide directly to us, such as when you create an account, 
            verify your identity, make transactions, or contact us for support. This includes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Personal information (name, email, phone number)</Text>
            <Text style={styles.bullet}>• Financial information (bank accounts, transaction history)</Text>
            <Text style={styles.bullet}>• Verification documents (BVN, NIN, government ID)</Text>
            <Text style={styles.bullet}>• Device information and usage data</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use the information we collect to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Process your transactions and payments</Text>
            <Text style={styles.bullet}>• Verify your identity and prevent fraud</Text>
            <Text style={styles.bullet}>• Communicate with you about your account</Text>
            <Text style={styles.bullet}>• Improve our services and develop new features</Text>
            <Text style={styles.bullet}>• Comply with legal and regulatory requirements</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. 
            This includes encryption, secure servers, and regular security audits.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
          <Text style={styles.sectionText}>
            We do not sell your personal information. We may share your information with:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Service providers who assist with our operations</Text>
            <Text style={styles.bullet}>• Financial institutions for transaction processing</Text>
            <Text style={styles.bullet}>• Regulatory authorities when required by law</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Access your personal information</Text>
            <Text style={styles.bullet}>• Correct inaccurate information</Text>
            <Text style={styles.bullet}>• Request deletion of your data</Text>
            <Text style={styles.bullet}>• Opt-out of marketing communications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have questions about this Privacy Policy, please contact us at:
          </Text>
          <View style={styles.contactBox}>
            <Text style={styles.contactText}>Email: privacy@amstapay.com</Text>
            <Text style={styles.contactText}>Phone: +234 800 123 4567</Text>
            <Text style={styles.contactText}>Address: Lagos, Nigeria</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <FileText size={14} color={C.textSub} />
          <Text style={styles.footerText}>Version 1.0 | Effective January 2024</Text>
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
  iconContainer: { alignItems: 'center', marginBottom: 20 },
  lastUpdated: { textAlign: 'center', fontSize: 12, color: C.textSub, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 12 },
  sectionText: { fontSize: 14, color: C.text, lineHeight: 22, marginBottom: 12 },
  bulletList: { marginLeft: 12, gap: 8 },
  bullet: { fontSize: 14, color: C.textSub, lineHeight: 20 },
  contactBox: { backgroundColor: C.primaryLight, padding: 16, borderRadius: 12, marginTop: 12 },
  contactText: { fontSize: 14, color: C.text, marginBottom: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 24, marginBottom: 40 },
  footerText: { fontSize: 12, color: C.textSub },
});