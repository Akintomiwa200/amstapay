import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';

const InviteScreen = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'AMSTA2024';
  const referralLink = `https://amstapay.com/invite?ref=${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on AmstaPay! Use my referral code ${referralCode} to get ₦500 bonus. Download app: ${referralLink}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const copyToClipboard = () => {
    // In a real app, you would use Clipboard from react-native
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <Text style={styles.subtitle}>Earn ₦500 for each friend who joins</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Referral Code */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Referral Code</Text>
          <View style={styles.referralBox}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Share Invitation</Text>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share via Message/Email</Text>
          </TouchableOpacity>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, styles.whatsappButton]}>
              <Text style={styles.socialButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.telegramButton]}>
              <Text style={styles.socialButtonText}>Telegram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Referrals</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Total Invites</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₦2,500</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  formContainer: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  referralBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFEDD5', padding: 12, borderRadius: 8 },
  referralCode: { fontSize: 16, fontWeight: 'bold', color: '#F97316' },
  copyButton: { backgroundColor: '#F97316', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  copyButtonText: { color: '#FFFFFF', fontWeight: '500' },
  shareButton: { backgroundColor: '#F97316', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  shareButtonText: { color: '#FFFFFF', fontWeight: '600' },
  socialButtons: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  whatsappButton: { backgroundColor: '#25D366' },
  telegramButton: { backgroundColor: '#0088CC' },
  socialButtonText: { color: '#FFFFFF', fontWeight: '500' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#F97316', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280' },
});

export default InviteScreen;