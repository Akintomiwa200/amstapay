// app/settings/help-support.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronLeft, HelpCircle, Mail, Phone, MessageCircle, 
  ChevronDown, ChevronRight, Send, FileText, Globe 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function HelpSupport() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const faqs = [
    { id: 1, question: 'How do I reset my PIN?', answer: 'Go to Settings > Security > Change PIN. You will need your current PIN to set a new one.' },
    { id: 2, question: 'How long do transfers take?', answer: 'Transfers to other AmstaPay users are instant. Bank transfers take 5-10 minutes.' },
    { id: 3, question: 'What are the transaction limits?', answer: 'Daily limit is ₦500,000 for personal accounts and ₦5,000,000 for business accounts.' },
    { id: 4, question: 'How do I report a dispute?', answer: 'Contact our support team via email or phone, or raise a dispute from the transaction details page.' },
    { id: 5, question: 'Is my money safe?', answer: 'Yes, we use bank-level security and all funds are held in licensed partner banks.' },
  ];

  const handleContact = (type: string) => {
    if (type === 'email') {
      Linking.openURL('mailto:support@amstapay.com');
    } else if (type === 'phone') {
      Linking.openURL('tel:+2348001234567');
    } else if (type === 'whatsapp') {
      Linking.openURL('https://wa.me/2348001234567');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert('Message Sent', 'Our support team will respond within 24 hours.');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.contactGrid}>
          <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('email')}>
            <View style={styles.contactIcon}>
              <Mail size={24} color={C.violet} />
            </View>
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.contactSubtitle}>support@amstapay.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('phone')}>
            <View style={styles.contactIcon}>
              <Phone size={24} color={C.violet} />
            </View>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSubtitle}>+234 800 123 4567</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('whatsapp')}>
            <View style={styles.contactIcon}>
              <MessageCircle size={24} color={C.violet} />
            </View>
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactSubtitle}>Chat with us</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <View key={faq.id}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFaq === faq.id ? (
                  <ChevronDown size={20} color={C.textSub} />
                ) : (
                  <ChevronRight size={20} color={C.textSub} />
                )}
              </TouchableOpacity>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              placeholderTextColor={C.textSub}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity style={styles.resourceItem}>
            <FileText size={20} color={C.violet} />
            <Text style={styles.resourceText}>User Guide</Text>
            <ChevronRight size={18} color={C.textSub} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceItem}>
            <Globe size={20} color={C.violet} />
            <Text style={styles.resourceText}>Visit Website</Text>
            <ChevronRight size={18} color={C.textSub} />
          </TouchableOpacity>
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
  contactGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  contactCard: { flex: 1, backgroundColor: C.primaryLight, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  contactIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  contactTitle: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 4 },
  contactSubtitle: { fontSize: 11, color: C.textSub },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 16 },
  faqItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  faqQuestion: { fontSize: 15, fontWeight: '500', color: C.text, flex: 1, marginRight: 12 },
  faqAnswer: { fontSize: 13, color: C.textSub, paddingVertical: 12, paddingHorizontal: 4, lineHeight: 20 },
  messageInputContainer: { position: 'relative' },
  messageInput: { backgroundColor: C.inputBg, borderRadius: 16, padding: 14, fontSize: 14, color: C.text, borderWidth: 1, borderColor: C.border, minHeight: 100, textAlignVertical: 'top' },
  sendButton: { position: 'absolute', bottom: 12, right: 12, backgroundColor: C.violet, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  resourcesSection: { marginBottom: 40 },
  resourceItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  resourceText: { flex: 1, fontSize: 15, color: C.text },
});