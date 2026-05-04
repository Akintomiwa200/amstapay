// app/snap-account.tsx - Snap Account Number with OCR + Bank Detection
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ChevronLeft, Scan, RefreshCw, Building2, Wallet, User, Globe } from 'lucide-react-native';
import { C } from '@/components/dashboardComponent/colors';
import * as ImagePicker from 'expo-image-picker';
import { TextRecognition } from 'react-native-text-recognition';

// Nigerian Banks Database
const NIGERIAN_BANKS = [
  { name: 'Access Bank', codes: ['044', 'access'] },
  { name: 'Guaranty Trust Bank', codes: ['058', 'gtb', 'gtbank'] },
  { name: 'Zenith Bank', codes: ['057', 'zenith'] },
  { name: 'First Bank', codes: ['011', 'firstbank', 'fbn'] },
  { name: 'United Bank for Africa', codes: ['033', 'uba'] },
  { name: 'Fidelity Bank', codes: ['070', 'fidelity'] },
  { name: 'Union Bank', codes: ['032', 'union'] },
  { name: 'Sterling Bank', codes: ['232', 'sterling'] },
  { name: 'Stanbic IBTC', codes: ['221', 'stanbic'] },
  { name: 'Ecobank', codes: ['050', 'ecobank'] },
  { name: 'First City Monument Bank', codes: ['214', 'fcmb'] },
  { name: 'Heritage Bank', codes: ['030', 'heritage'] },
  { name: 'Keystone Bank', codes: ['082', 'keystone'] },
  { name: 'Polaris Bank', codes: ['076', 'polaris'] },
  { name: 'Providus Bank', codes: ['101', 'providus'] },
  { name: 'StanChart', codes: ['068', 'standard chartered'] },
  { name: 'Wema Bank', codes: ['035', 'wema', 'alat'] },
  { name: 'Unity Bank', codes: ['215', 'unity'] },
  { name: 'OPay', codes: ['999992', 'opay'] },
  { name: 'PalmPay', codes: ['999991', 'palmpay'] },
  { name: 'Moniepoint', codes: ['999993', 'moniepoint'] },
  { name: 'Kuda Bank', codes: ['090', 'kuda'] },
];

// International Bank Keywords
const INTERNATIONAL_BANKS = [
  'Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'HSBC',
  'Barclays', 'Lloyds', 'Santander', 'Deutsche Bank', 'BNP Paribas',
  'Standard Chartered', 'UBS', 'Credit Suisse', 'Goldman Sachs',
  'JP Morgan', 'ICICI', 'HDFC', 'SBI', 'Axis Bank',
];

export default function SnapAccountScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    accountNumber: string;
    accountName: string;
    bankName: string;
    confidence: number;
    type: 'nigerian' | 'international' | 'crypto' | 'unknown';
  }>({
    accountNumber: '',
    accountName: '',
    bankName: '',
    confidence: 0,
    type: 'unknown',
  });

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to snap account numbers.');
        return false;
      }
    }
    return true;
  };

  const handleSnapPhoto = async (useCamera: boolean = true) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = useCamera 
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setExtractedData({
          accountNumber: '',
          accountName: '',
          bankName: '',
          confidence: 0,
          type: 'unknown',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const detectBankName = (text: string): { name: string; type: 'nigerian' | 'international' | 'unknown' } => {
    const lowerText = text.toLowerCase();

    // Check Nigerian banks first
    for (const bank of NIGERIAN_BANKS) {
      for (const code of bank.codes) {
        if (lowerText.includes(code)) {
          return { name: bank.name, type: 'nigerian' };
        }
      }
    }

    // Check international banks
    for (const bank of INTERNATIONAL_BANKS) {
      if (lowerText.includes(bank.toLowerCase())) {
        return { name: bank, type: 'international' };
      }
    }

    // Try to extract bank name using common patterns
    const bankPatterns = [
      /(?:bank|banking|trust|financial)\s*[:\-]?\s*([a-z\s]{3,30})/i,
      /(?:b(?:an)?k\.?)\s*[:\-]?\s*([a-z\s]{3,30})/i,
    ];

    for (const pattern of bankPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return { name: match[1].trim(), type: 'international' };
      }
    }

    return { name: '', type: 'unknown' };
  };

  const detectAccountName = (text: string): string => {
    // Common patterns for account holder name
    const namePatterns = [
      /(?:name|acct\s*name|account\s*name|holder)\s*[:\-]?\s*([a-z\s]{3,50})/i,
      /(?:to\s*[:\-]?\s*)([a-z\s]{3,50})/i,
      /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m, // Simple "First Last" at start of line
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return '';
  };

  const detectCryptoAddress = (text: string): { address: string; type: string } => {
    // Ethereum: 0x + 40 hex chars
    const ethMatch = text.match(/\b(0x[a-fA-F0-9]{40})\b/);
    if (ethMatch) return { address: ethMatch[1], type: 'Ethereum' };

    // Bitcoin: starts with 1, 3, or bc1
    const btcMatch = text.match(/\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/);
    if (btcMatch) return { address: btcMatch[1], type: 'Bitcoin' };

    // Solana: base58 string, typically 32-44 chars
    const solMatch = text.match(/\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/);
    if (solMatch && text.includes('solana')) {
      return { address: solMatch[1], type: 'Solana' };
    }

    return { address: '', type: '' };
  };

  const extractAccountData = async (imageUri: string): Promise<{
    accountNumber: string;
    accountName: string;
    bankName: string;
    confidence: number;
    type: 'nigerian' | 'international' | 'crypto' | 'unknown';
  }> => {
    try {
      // Use react-native-text-recognition for OCR
      const recognizedText = await TextRecognition.recognize(imageUri, 'latin');
      
      console.log('Recognized text:', recognizedText);

      // Check for crypto wallet first
      const cryptoResult = detectCryptoAddress(recognizedText);
      if (cryptoResult.address) {
        return {
          accountNumber: cryptoResult.address,
          accountName: '',
          bankName: cryptoResult.type + ' Wallet',
          confidence: 0.98,
          type: 'crypto',
        };
      }

      // Detect bank name
      const bankResult = detectBankName(recognizedText);
      
      // Detect account name
      const accountName = detectAccountName(recognizedText);

      // Extract 10-digit account number (Nigerian format)
      const accountRegex = /\b\d{10}\b/g;
      const matches = recognizedText.match(accountRegex);
      
      if (matches && matches.length > 0) {
        return {
          accountNumber: matches[0],
          accountName,
          bankName: bankResult.name,
          confidence: 0.95,
          type: bankResult.type,
        };
      }
      
      // Try to find numbers with spaces/dashes
      const flexibleRegex = /(\d[\d\s\-]{8,}\d)/g;
      const flexibleMatches = recognizedText.match(flexibleRegex);
      
      if (flexibleMatches) {
        const cleaned = flexibleMatches[0].replace(/[\s\-]/g, '');
        if (cleaned.length === 10) {
          return {
            accountNumber: cleaned,
            accountName,
            bankName: bankResult.name,
            confidence: 0.85,
            type: bankResult.type,
          };
        }
        // International account (longer numbers)
        if (cleaned.length > 10 && cleaned.length <= 18) {
          return {
            accountNumber: cleaned,
            accountName,
            bankName: bankResult.name || 'International Bank',
            confidence: 0.80,
            type: 'international',
          };
        }
      }
      
      return {
        accountNumber: '',
        accountName: '',
        bankName: '',
        confidence: 0,
        type: 'unknown',
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract account information from image');
    }
  };

  const handleExtractAccount = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please snap or select an image first.');
      return;
    }

    setProcessing(true);
    try {
      const result = await extractAccountData(image);
      
      setExtractedData(result);
      
      if (result.accountNumber && result.confidence > 0.7) {
        const typeIcon = result.type === 'crypto' ? '🪙' : result.type === 'nigerian' ? '🇳🇬' : '🌍';
        
        Alert.alert(
          'Account Found! ' + typeIcon,
          `Type: ${result.type.toUpperCase()}\nAccount: ${result.accountNumber}\nBank: ${result.bankName || 'N/A'}\nName: ${result.accountName || 'N/A'}\nConfidence: ${(result.confidence * 100).toFixed(1)}%`,
          [
            { text: 'Re-scan', onPress: () => setExtractedData(prev => ({ ...prev, accountNumber: '' })) },
            { text: 'Use This', onPress: () => {
              router.push({
                pathname: '/scan-send',
                params: { 
                  accountNumber: result.accountNumber,
                  accountName: result.accountName,
                  bankName: result.bankName,
                  type: result.type,
                }
              });
            }}
          ]
        );
      } else {
        Alert.alert(
          'No Account Found',
          'Could not detect a valid account number. Try retaking the photo with better lighting.',
          [
            { text: 'Try Again', onPress: () => handleExtractAccount() },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Snap Account</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.instructionCard}>
          <Scan size={24} color={C.primary} />
          <Text style={styles.instructionTitle}>Snap Account Details</Text>
          <Text style={styles.instructionText}>
            Take a photo of a cheque, bank slip, or crypto wallet. Auto-detects Nigerian & international banks + crypto wallets.
          </Text>
        </View>

        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.capturedImage} />
            <TouchableOpacity 
              style={styles.retakeButton} 
              onPress={() => handleSnapPhoto(true)}
            >
              <RefreshCw size={16} color={C.primary} />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Camera size={48} color={C.textSub} />
            <Text style={styles.placeholderText}>No image captured yet</Text>
          </View>
        )}

        {extractedData.accountNumber ? (
          <View style={[
            styles.resultCard,
            extractedData.type === 'crypto' && styles.resultCardCrypto,
            extractedData.type === 'nigerian' && styles.resultCardNigerian,
          ]}>
            <View style={styles.resultHeader}>
              {extractedData.type === 'crypto' ? (
                <Wallet size={20} color={C.primary} />
              ) : extractedData.type === 'nigerian' ? (
                <Globe size={20} color="#008751" />
              ) : (
                <Building2 size={20} color={C.secondary} />
              )}
              <Text style={styles.resultType}>
                {extractedData.type === 'crypto' ? '🪙 Crypto Wallet' : 
                 extractedData.type === 'nigerian' ? '🇳🇬 Nigerian Bank' : 
                 extractedData.type === 'international' ? '🌍 International' : 'Unknown'}
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Account Number:</Text>
              <Text style={styles.resultValue}>{extractedData.accountNumber}</Text>
            </View>
            
            {extractedData.bankName ? (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Bank/Wallet:</Text>
                <Text style={styles.resultValue}>{extractedData.bankName}</Text>
              </View>
            ) : null}
            
            {extractedData.accountName ? (
              <View style={styles.resultRow}>
                <User size={14} color={C.textSub} />
                <Text style={styles.resultLabel}>Account Name:</Text>
                <Text style={styles.resultValue}>{extractedData.accountName}</Text>
              </View>
            ) : null}
            
            <Text style={styles.resultConfidence}>
              Confidence: {(extractedData.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={() => handleSnapPhoto(true)}
            disabled={processing}
          >
            <LinearGradient
              colors={[C.primary, C.secondary]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Camera size={20} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.galleryButton} 
            onPress={() => handleSnapPhoto(false)}
            disabled={processing}
          >
            <Text style={styles.galleryButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.extractButton, (!image || processing) && styles.buttonDisabled]} 
          onPress={handleExtractAccount}
          disabled={!image || processing}
        >
          <LinearGradient
            colors={(!image || processing) ? ['#ccc', '#ccc'] : [C.secondaryContainer, C.secondary]}
            style={styles.buttonGradient}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Scan size={20} color="#fff" />
                <Text style={styles.buttonText}>Extract Details</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.supportedList}>
          <Text style={styles.supportedTitle}>Supported:</Text>
          <Text style={styles.supportedText}>✓ Nigerian Banks (Access, GTB, Zenith, First Bank, UBA, etc.)</Text>
          <Text style={styles.supportedText}>✓ International Banks (Chase, HSBC, Barclays, etc.)</Text>
          <Text style={styles.supportedText}>✓ Crypto Wallets (Ethereum, Bitcoin, Solana)</Text>
          <Text style={styles.supportedText}>✓ Auto-detects account name & bank</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  content: { padding: 20, paddingBottom: 40 },
  instructionCard: {
    backgroundColor: C.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  instructionTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginTop: 12, marginBottom: 8 },
  instructionText: { fontSize: 14, color: C.textSub, textAlign: 'center', lineHeight: 20 },
  imageContainer: { marginBottom: 20, alignItems: 'center' },
  capturedImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  retakeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  retakeText: { fontSize: 14, color: C.primary, fontWeight: '600' },
  placeholderContainer: {
    height: 200,
    backgroundColor: C.surfaceContainer,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: { marginTop: 12, fontSize: 14, color: C.textSub },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.success,
  },
  resultCardCrypto: { borderColor: '#FFD700' },
  resultCardNigerian: { borderColor: '#008751' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultType: { fontSize: 14, fontWeight: '600', color: C.primary },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  resultLabel: { fontSize: 12, color: C.textSub },
  resultValue: { fontSize: 16, fontWeight: '700', color: C.primary, letterSpacing: 1 },
  resultConfidence: { fontSize: 12, color: C.success, marginTop: 8 },
  buttonContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  cameraButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  galleryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  galleryButtonText: { fontSize: 14, fontWeight: '600', color: C.primary },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  extractButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  buttonDisabled: { opacity: 0.5 },
  supportedList: { backgroundColor: C.surfaceContainer, borderRadius: 12, padding: 16 },
  supportedTitle: { fontSize: 14, fontWeight: '700', color: C.primary, marginBottom: 8 },
  supportedText: { fontSize: 12, color: C.textSub, marginBottom: 4, lineHeight: 18 },
});
