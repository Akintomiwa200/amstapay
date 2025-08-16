import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Share
} from 'react-native';
import {
  ArrowLeft,
  Copy,
  Share2,
  Building2,
  CreditCard,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react-native';
import {useRouter} from 'expo-router';  


interface BankDetailRowProps {
    icon: React.ComponentType<{ size?: number; color?: string; style?: any }>; 
    label: string;
    value: string;
    fieldName: string;
    onCopy?: (value: string, fieldName: string) => void;
  }
  

const router = useRouter()

export default function BankTransferScreen() {
    const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = {
    bankName: 'AmstaPay Bank',
    accountNumber: '1234567890',
    accountName: 'AmstaPay Wallet',
    
  };



  const copyToClipboard = async (text: string, fieldName: string): Promise<void> => {
    // Clipboard.setString(text);
  
    setCopiedField(fieldName); // ✅ Now allowed
    Alert.alert('Copied!', `${fieldName} copied to clipboard`);
  
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };
  
  
  const shareDetails = async () => {
    const message = `AmstaPay Bank Details:
  Bank Name: ${bankDetails.bankName}
  Account Number: ${bankDetails.accountNumber}
  Account Name: ${bankDetails.accountName}`; // ✅ Close the template literal here
  
    try {
      await Share.share({
        message: message,
        title: 'AmstaPay Bank Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share bank details');
    }
  };
  

  const BankDetailRow: React.FC<BankDetailRowProps> = ({ icon: Icon, label, value, fieldName }) => (
    <View style={styles.bankDetailRow}>
      <View style={styles.bankDetailContent}>
        <Icon size={20} color="#0D47A1" style={styles.bankDetailIcon} />
        <View style={styles.bankDetailTextContainer}>
          <Text style={styles.bankDetailLabel}>{label}</Text>
          <Text style={styles.bankDetailValue}>{value}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.copyButton,
          copiedField === fieldName && styles.copyButtonSuccess
        ]}
        onPress={() => copyToClipboard(value, fieldName)}
      >
        {copiedField === fieldName ? (
          <CheckCircle size={18} color="#10B981" />
        ) : (
          <Copy size={18} color="#6B7280" />
        )}
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#0D47A1" />
          </TouchableOpacity>
          <Text style={styles.title}>Bank Transfer</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={shareDetails}
          >
            <Share2 size={20} color="#0D47A1" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.introSection}>
            <View style={styles.introIconContainer}>
              <Building2 size={32} color="#0D47A1" />
            </View>
            <Text style={styles.introTitle}>Add Money via Bank Transfer</Text>
            <Text style={styles.description}>
              Transfer money to the bank account below to fund your AmstaPay wallet. 
              Your account will be credited within minutes.
            </Text>
          </View>

          {/* Bank Details Card */}
          <View style={styles.bankDetailsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Bank Account Details</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Instant</Text>
              </View>
            </View>

            <BankDetailRow
              icon={Building2}
              label="Bank Name"
              value={bankDetails.bankName}
              fieldName="Bank Name"
            />

            <BankDetailRow
              icon={CreditCard}
              label="Account Number"
              value={bankDetails.accountNumber}
              fieldName="Account Number"
            />

            <BankDetailRow
              icon={User}
              label="Account Name"
              value={bankDetails.accountName}
              fieldName="Account Name"
            />

           
          </View>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Transfer</Text>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Copy Bank Details</Text>
                <Text style={styles.stepDescription}>
                  Tap the copy button next to each detail above
                </Text>
              </View>
            </View>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Open Your Banking App</Text>
                <Text style={styles.stepDescription}>
                  Use your mobile banking app or visit your bank
                </Text>
              </View>
            </View>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Make the Transfer</Text>
                <Text style={styles.stepDescription}>
                  Paste the details and send your desired amount
                </Text>
              </View>
            </View>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Credited</Text>
                <Text style={styles.stepDescription}>
                  Your AmstaPay wallet will be funded within 5 minutes
                </Text>
              </View>
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <AlertCircle size={20} color="#F59E0B" />
              <Text style={styles.notesTitle}>Important Notes</Text>
            </View>
            
            <Text style={styles.noteText}>
              • Transfers typically take 1-5 minutes to reflect in your wallet
            </Text>
            <Text style={styles.noteText}>
              • Ensure you transfer from an account in your name
            </Text>
            <Text style={styles.noteText}>
              • Keep your transfer receipt for reference
            </Text>
            <Text style={styles.noteText}>
              • Contact support if your transfer takes longer than 10 minutes
            </Text>
          </View>

          {/* Processing Time Info */}
          <View style={styles.timeCard}>
            <Clock size={24} color="#0D47A1" />
            <View style={styles.timeInfo}>
              <Text style={styles.timeTitle}>Processing Time</Text>
              <Text style={styles.timeDescription}>
                Instant to 5 minutes • Available 24/7
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => Alert.alert('Contact Support', 'How can we help you?')}
            >
              <Text style={styles.primaryButtonText}>Need Help?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => Alert.alert('Transaction History', 'View your recent transfers')}
            >
              <Text style={styles.secondaryButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D47A1',
  },
  content: {
    padding: 16,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  introIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#EBF8FF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  bankDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  bankDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  bankDetailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankDetailIcon: {
    marginRight: 12,
  },
  bankDetailTextContainer: {
    flex: 1,
  },
  bankDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  bankDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  copyButtonSuccess: {
    backgroundColor: '#D1FAE5',
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#0D47A1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  notesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 8,
    lineHeight: 20,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  timeInfo: {
    marginLeft: 16,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  timeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0D47A1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  secondaryButtonText: {
    color: '#0D47A1',
    fontSize: 16,
    fontWeight: '600',
  },
});