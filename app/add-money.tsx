import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  QrCode,
  Building2,
  ArrowLeft,
  Wallet,
  Plus,
  CreditCard,
  Smartphone
} from 'lucide-react-native';

// Color palette
const COLORS = {
  primary: '#F97316',      // Orange accent
  primaryDark: '#EA580C',  // Darker orange
  background: '#FFFFFF',   // White background
  surface: '#F8F8F8',      // Light gray for surfaces
  text: '#000000',         // Black text
  textSecondary: '#666666', // Gray text
  textTertiary: '#888888',  // Lighter gray text
  border: '#F0F0F0',       // Light border
  accent: '#FFD700',       // Yellow accent
  warning: '#FFFBF0',      // Light yellow for warnings
  warningBorder: '#FFD700', // Yellow border
};

export default function AddMoneyScreen() {
  const router = useRouter();

  const handleNavigate = (method: string) => {
    if (method === 'qr') {
      router.push('/qr-code');
    } else if (method === 'bank') {
      router.push('/bank-transfer');
    }
  };

  const addMoneyOptions = [
    {
      id: 'qr',
      title: 'QR Code Payment',
      subtitle: 'Generate QR code for instant payments',
      icon: QrCode,
      badge: 'Instant',
      description: 'Share QR code with sender for quick transfers'
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      subtitle: 'Transfer from your bank account',
      icon: Building2,
      badge: '1-5 mins',
      description: 'Use mobile banking or visit your bank'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: COLORS.background, borderBottomColor: COLORS.border }]}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: COLORS.surface }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: COLORS.text }]}>Add Money</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={[styles.walletIconContainer, { backgroundColor: COLORS.text, borderColor: COLORS.primary }]}>
              <Wallet size={48} color={COLORS.primary} />
              <View style={[styles.plusIcon, { backgroundColor: COLORS.primary, borderColor: COLORS.background }]}>
                <Plus size={20} color={COLORS.text} />
              </View>
            </View>
            
            <Text style={[styles.title, { color: COLORS.text }]}>Add Money to Wallet</Text>
            <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
              Choose your preferred method to fund your AmstaPay wallet securely
            </Text>
          </View>

          {/* Options Container */}
          <View style={styles.optionsContainer}>
            {addMoneyOptions.map((option) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionCard, { 
                    backgroundColor: COLORS.background, 
                    borderColor: COLORS.primary,
                    shadowColor: COLORS.text 
                  }]}
                  onPress={() => handleNavigate(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionHeader}>
                    <View style={[styles.optionIconContainer, { backgroundColor: COLORS.primary, borderColor: COLORS.text }]}>
                      <Icon size={32} color={COLORS.text} />
                    </View>
                    <View style={[styles.optionBadge, { backgroundColor: COLORS.text }]}>
                      <Text style={[styles.badgeText, { color: COLORS.accent }]}>{option.badge}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionTitle, { color: COLORS.text }]}>{option.title}</Text>
                    <Text style={[styles.optionSubtitle, { color: COLORS.textSecondary }]}>{option.subtitle}</Text>
                    <Text style={[styles.optionDescription, { color: COLORS.textTertiary }]}>{option.description}</Text>
                  </View>

                  <View style={styles.optionFooter}>
                    <View style={styles.arrowContainer}>
                      <Text style={[styles.selectText, { color: COLORS.text }]}>Select</Text>
                      <View style={[styles.arrow, { backgroundColor: COLORS.primary, borderColor: COLORS.text }]}>
                        <Text style={[styles.arrowText, { color: COLORS.text }]}>→</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Info */}
          <View style={styles.infoSection}>
            <View style={[styles.infoCard, { 
              backgroundColor: COLORS.surface, 
              borderLeftColor: COLORS.primary 
            }]}>
              <CreditCard size={24} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: COLORS.text }]}>Secure & Fast</Text>
                <Text style={[styles.infoDescription, { color: COLORS.textSecondary }]}>
                  All transactions are encrypted and processed instantly
                </Text>
              </View>
            </View>

            <View style={[styles.infoCard, { 
              backgroundColor: COLORS.surface, 
              borderLeftColor: COLORS.primary 
            }]}>
              <Smartphone size={24} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: COLORS.text }]}>24/7 Available</Text>
                <Text style={[styles.infoDescription, { color: COLORS.textSecondary }]}>
                  Add money to your wallet anytime, anywhere
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Note */}
          <View style={[styles.bottomNote, { 
            backgroundColor: COLORS.warning, 
            borderColor: COLORS.warningBorder 
          }]}>
            <Text style={[styles.noteText, { color: COLORS.text }]}>
              💡 Tip: Use QR code for instant transfers, Bank transfer for larger amounts
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
    minHeight: '80%',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  walletIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
    borderWidth: 4,
  },
  plusIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  optionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  optionContent: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  optionFooter: {
    alignItems: 'flex-end',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomNote: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});