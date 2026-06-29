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
import { useTheme } from '@/context/ThemeContext';
import { supportService } from '@/services/support';

export default function HelpSupport() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);
      await supportService.createTicket({
        subject: 'Support request',
        category: 'general',
        message: message.trim(),
      });
      Alert.alert('Message Sent', 'Our support team will respond within 24 hours.');
      setMessage('');
      router.push('/live-chat');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.contactGrid}>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: c.primaryLight, borderColor: c.border }]} onPress={() => handleContact('email')}>
            <View style={[styles.contactIcon, { backgroundColor: c.bg }]}>
              <Mail size={24} color={c.violet} />
            </View>
            <Text style={[styles.contactTitle, { color: c.text }]}>Email Us</Text>
            <Text style={[styles.contactSubtitle, { color: c.textSub }]}>support@amstapay.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactCard, { backgroundColor: c.primaryLight, borderColor: c.border }]} onPress={() => handleContact('phone')}>
            <View style={[styles.contactIcon, { backgroundColor: c.bg }]}>
              <Phone size={24} color={c.violet} />
            </View>
            <Text style={[styles.contactTitle, { color: c.text }]}>Call Us</Text>
            <Text style={[styles.contactSubtitle, { color: c.textSub }]}>+234 800 123 4567</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactCard, { backgroundColor: c.primaryLight, borderColor: c.border }]} onPress={() => handleContact('whatsapp')}>
            <View style={[styles.contactIcon, { backgroundColor: c.bg }]}>
              <MessageCircle size={24} color={c.violet} />
            </View>
            <Text style={[styles.contactTitle, { color: c.text }]}>WhatsApp</Text>
            <Text style={[styles.contactSubtitle, { color: c.textSub }]}>Chat with us</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <View key={faq.id}>
              <TouchableOpacity
                style={[styles.faqItem, { borderBottomColor: c.border }]}
                onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              >
                <Text style={[styles.faqQuestion, { color: c.text }]}>{faq.question}</Text>
                {expandedFaq === faq.id ? (
                  <ChevronDown size={20} color={c.textSub} />
                ) : (
                  <ChevronRight size={20} color={c.textSub} />
                )}
              </TouchableOpacity>
              {expandedFaq === faq.id && (
                <Text style={[styles.faqAnswer, { color: c.textSub }]}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Send us a Message</Text>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={[styles.messageInput, { backgroundColor: c.inputBg, color: c.text, borderColor: c.border }]}
              placeholder="Type your message here..."
              placeholderTextColor={c.textSub}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: c.violet }]} onPress={handleSendMessage} disabled={sending}>
              <Send size={18} color="#fff" />
              <Text style={styles.sendText}>{sending ? 'Sending...' : 'Send'}</Text>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resourcesSection}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Resources</Text>
          <TouchableOpacity style={[styles.resourceItem, { borderBottomColor: c.border }]}>
            <FileText size={20} color={c.violet} />
            <Text style={[styles.resourceText, { color: c.text }]}>User Guide</Text>
            <ChevronRight size={18} color={c.textSub} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.resourceItem, { borderBottomColor: c.border }]}>
            <Globe size={20} color={c.violet} />
            <Text style={[styles.resourceText, { color: c.text }]}>Visit Website</Text>
            <ChevronRight size={18} color={c.textSub} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  contactGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  contactCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1 },
  contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  contactTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  contactSubtitle: { fontSize: 11 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  faqItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  faqQuestion: { fontSize: 15, fontWeight: '500', flex: 1, marginRight: 12 },
  faqAnswer: { fontSize: 13, paddingVertical: 12, paddingHorizontal: 4, lineHeight: 20 },
  messageInputContainer: { position: 'relative' },
  messageInput: { borderRadius: 16, padding: 14, fontSize: 14, borderWidth: 1, minHeight: 100, textAlignVertical: 'top' },
  sendButton: { position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  resourcesSection: { marginBottom: 40 },
  resourceItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  resourceText: { flex: 1, fontSize: 15 },
});
