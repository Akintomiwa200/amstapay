import { useRouter } from 'expo-router'; // Use router for navigation   
import {
    ArrowLeft,
    Copy,
    DollarSign,
    Download,
    RefreshCw,
    Share2,
    Wallet
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';


export default function QRCodeScreen() {
    const navigation = useRouter(); // Use router for navigation    
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [qrData, setQrData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR data when component mounts or amount changes
  useEffect(() => {
    generateQRData();
  }, [amount]);

  const generateQRData = () => {
    // Create payment data for QR code
    const paymentData = {
      type: 'payment',
      account: accountNumber,
      amount: amount || '0',
      currency: 'NGN',
      description: 'Add money to wallet',
      timestamp: Date.now(),
      reference: `TXN${Date.now().toString().slice(-8)}`
    };
    
    setQrData(JSON.stringify(paymentData));
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };
  

  const regenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateQRData();
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    // In a real app, you'd use Clipboard from @react-native-clipboard/clipboard
    Alert.alert('Copied!', 'Payment details copied to clipboard');
  };

  const shareQRCode = async () => {
    try {
      await Share.share({
        message: `Add money to my account: ${accountNumber}\nAmount: ₦${amount || '0'}`,
        title: 'Payment QR Code',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share QR code');
    }
  };

  const presetAmounts = ['1000', '2000', '5000', '10000'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.back()}
          >
            <ArrowLeft size={24} color="#0D47A1" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Money</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Account Info */}
        <View style={styles.accountSection}>
          <View style={styles.accountCard}>
            <Wallet size={24} color="#0D47A1" />
            <Text style={styles.accountLabel}>Account Number</Text>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <DollarSign size={20} color="#6B7280" />
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.currency}>NGN</Text>
          </View>

          {/* Preset Amounts */}
          <View style={styles.presetAmounts}>
            {presetAmounts.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  amount === preset && styles.presetButtonActive
                ]}
                onPress={() => setAmount(preset)}
              >
                <Text style={[
                  styles.presetText,
                  amount === preset && styles.presetTextActive
                ]}>
                  ₦{preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>QR Code</Text>
          <Text style={styles.description}>
            Share this QR code to receive payments
          </Text>

          <View style={styles.qrContainer}>
            <View style={styles.qrCodeWrapper}>
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <RefreshCw size={32} color="#0D47A1" />
                  <Text style={styles.loadingText}>Generating...</Text>
                </View>
              ) : (
                <View style={styles.qrCodeDisplay}>
                  {/* QR Code Pattern Simulation */}
                  <View style={styles.qrPattern}>
                    {[...Array(15)].map((_, row) => (
                      <View key={row} style={styles.qrRow}>
                        {[...Array(15)].map((_, col) => (
                          <View
                            key={col}
                            style={[
                              styles.qrPixel,
                              (row + col) % 2 === 0 && styles.qrPixelFilled
                            ]}
                          />
                        ))}
                      </View>
                    ))}
                  </View>
                  <Text style={styles.qrAmount}>
                    {amount ? `₦${amount}` : 'Enter amount'}
                  </Text>
                </View>
              )}
            </View>

            {/* QR Actions */}
            <View style={styles.qrActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={regenerateQR}
                disabled={isGenerating}
              >
                <RefreshCw size={20} color="#0D47A1" />
                <Text style={styles.actionText}>Refresh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={copyToClipboard}
              >
                <Copy size={20} color="#0D47A1" />
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareQRCode}
              >
                <Share2 size={20} color="#0D47A1" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Alert.alert('Download', 'QR code saved to gallery')}
              >
                <Download size={20} color="#0D47A1" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoStep}>1.</Text>
            <Text style={styles.infoText}>Enter the amount you want to receive</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoStep}>2.</Text>
            <Text style={styles.infoText}>Share the QR code with the sender</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoStep}>3.</Text>
            <Text style={styles.infoText}>They scan and complete the payment</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoStep}>4.</Text>
            <Text style={styles.infoText}>Money is added to your account instantly</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D47A1',
  },
  placeholder: {
    width: 40,
  },
  accountSection: {
    padding: 16,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
    marginTop: 4,
  },
  amountSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    marginLeft: 8,
    color: '#111827',
  },
  currency: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  presetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  presetButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    marginHorizontal: 4,
  },
  presetButtonActive: {
    backgroundColor: '#0D47A1',
    borderColor: '#0D47A1',
  },
  presetText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  qrSection: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCodeDisplay: {
    alignItems: 'center',
  },
  qrPattern: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrPixel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 0.5,
  },
  qrPixelFilled: {
    backgroundColor: '#000000',
  },
  qrAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
    marginTop: 12,
  },
  loadingContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#0D47A1',
    marginTop: 4,
    fontWeight: '500',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoStep: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D47A1',
    marginRight: 12,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
});