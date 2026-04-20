// app/settings/terms/index.tsx - Terms of Service Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function TermsScreen() {
  const router = useRouter();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using the AmstaPay application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    },
    {
      title: '2. Account Registration',
      content: 'To use AmstaPay, you must register for an account and provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
    },
    {
      title: '3. Services',
      content: 'AmstaPay provides digital payment services including but not limited to money transfers, bill payments, mobile top-ups, and investment features. All services are subject to availability and may be modified or discontinued at any time.',
    },
    {
      title: '4. Transaction Limits',
      content: 'Transaction limits may apply based on your account type and verification level. We reserve the right to modify these limits at any time. You agree to comply with all applicable transaction limits.',
    },
    {
      title: '5. Fees and Charges',
      content: 'Certain services may incur fees. All applicable fees will be disclosed before you complete a transaction. We reserve the right to change our fee structure with prior notice.',
    },
    {
      title: '6. Security',
      content: 'You agree to keep your login credentials, PIN, and any other security information confidential. Report any unauthorized access to your account immediately. AmstaPay will never ask for your password or PIN via email or phone.',
    },
    {
      title: '7. Prohibited Activities',
      content: 'You may not use AmstaPay for any illegal activities, fraudulent transactions, money laundering, terrorist financing, or any activity that violates applicable laws and regulations.',
    },
    {
      title: '8. Intellectual Property',
      content: 'All content, features, and functionality of the AmstaPay application are owned by AmstaPay and are protected by copyright, trademark, and other intellectual property laws.',
    },
    {
      title: '9. Limitation of Liability',
      content: 'AmstaPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
    },
    {
      title: '10. Changes to Terms',
      content: 'We reserve the right to modify these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the modified terms.',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: March 2024</Text>

        {sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms of Service, please contact us at support@amstapay.com
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  lastUpdated: { fontSize: 13, color: C.textSub, marginBottom: 20, fontStyle: 'italic' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 8 },
  sectionContent: { fontSize: 14, color: C.textSub, lineHeight: 22 },
  contactSection: { backgroundColor: C.primaryLight, borderRadius: 16, padding: 20, marginTop: 8, marginBottom: 40 },
  contactTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 8 },
  contactText: { fontSize: 14, color: C.textSub, lineHeight: 22 },
});
