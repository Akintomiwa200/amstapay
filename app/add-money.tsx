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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity 
  style={styles.backButton}
  onPress={() => router.back()}
>
  <ArrowLeft size={24} color="#000000" />
</TouchableOpacity>

          <Text style={styles.headerTitle}>Add Money</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.walletIconContainer}>
              <Wallet size={48} color="#FFD700" />
              <View style={styles.plusIcon}>
                <Plus size={20} color="#000000" />
              </View>
            </View>
            
            <Text style={styles.title}>Add Money to Wallet</Text>
            <Text style={styles.subtitle}>
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
                  style={styles.optionCard}
                  onPress={() => handleNavigate(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.optionIconContainer}>
                      <Icon size={32} color="#000000" />
                    </View>
                    <View style={styles.optionBadge}>
                      <Text style={styles.badgeText}>{option.badge}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>

                  <View style={styles.optionFooter}>
                    <View style={styles.arrowContainer}>
                      <Text style={styles.selectText}>Select</Text>
                      <View style={styles.arrow}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <CreditCard size={24} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Secure & Fast</Text>
                <Text style={styles.infoDescription}>
                  All transactions are encrypted and processed instantly
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Smartphone size={24} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>24/7 Available</Text>
                <Text style={styles.infoDescription}>
                  Add money to your wallet anytime, anywhere
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Note */}
          <View style={styles.bottomNote}>
            <Text style={styles.noteText}>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
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
    backgroundColor: '#000000',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  plusIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
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
    backgroundColor: '#FFD700',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  optionBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  optionContent: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 13,
    color: '#888888',
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
    color: '#000000',
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    width: 28,
    height: 28,
    backgroundColor: '#FFD700',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  arrowText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  bottomNote: {
    backgroundColor: '#FFFBF0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
  },
});