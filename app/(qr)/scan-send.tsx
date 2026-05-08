// app/scan-send.tsx
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ChevronLeft, Send, RefreshCw, Building2, User, Wallet } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { useTheme } from '@/context/ThemeContext';

export default function ScanSendScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { transferToWallet } = useAuth();

  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<'crypto' | 'nigerian' | 'international' | 'unknown'>('unknown');
  const [confidence, setConfidence] = useState(0);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const numericAmount = useMemo(() => Number(amount), [amount]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required.');
        }
      }
    })();
  }, []);

  const handleSnapPhoto = async (useCamera: boolean = true) => {
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
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        setAccountNumber('');
        setAccountName('');
        setBankName('');
        setAccountType('unknown');
        setConfidence(0);
        setAmount('');
        extractDataFromImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to capture image.');
    }
  };

  const extractDataFromImage = async (imageUri: string) => {
    setProcessing(true);
    try {
      const recognizedLines: string[] = await TextRecognition.recognize(imageUri);
      const recognizedText = recognizedLines.join('\n');
      console.log('OCR Text:', recognizedText);

      let extractedAccount = '';
      let extractedType: 'crypto' | 'nigerian' | 'international' | 'unknown' = 'unknown';

      // Check crypto first
      const cryptoMatch = recognizedText.match(/\b(0x[a-fA-F0-9]{40})\b/);
      if (cryptoMatch) {
        extractedAccount = cryptoMatch[1];
        extractedType = 'crypto';
        setAccountType('crypto');
        setBankName('Ethereum Wallet');
        setAccountNumber(extractedAccount);
        setConfidence(0.98);
        setProcessing(false);
        Alert.alert('Crypto Detected', 'Ethereum address: ' + extractedAccount);
        return;
      }

      // Extract 10-digit account number
      const accountMatches = recognizedText.match(/\b\d{10}\b/g);
      if (accountMatches && accountMatches.length > 0) {
        extractedAccount = accountMatches[0];
        extractedType = 'nigerian';
      } else {
        // Try flexible pattern
        const flexibleMatch = recognizedText.match(/(\d[\d\s\-]{8,}\d)/g);
        if (flexibleMatch) {
          const cleaned = flexibleMatch[0].replace(/[\s\-]/g, '');
          if (cleaned.length === 10) {
            extractedAccount = cleaned;
            extractedType = 'nigerian';
          } else if (cleaned.length > 10 && cleaned.length <= 18) {
            extractedAccount = cleaned;
            extractedType = 'international';
          }
        }
      }

      if (!extractedAccount) {
        throw new Error('No valid account number found');
      }

      setAccountNumber(extractedAccount);
      setAccountType(extractedType);
      setConfidence(0.95);

      // Extract bank name from text
      const bankWords = ['bank', 'trust', 'financial', 'gtb', 'zenith', 'uba', 'access', 'fidelity', 'opay', 'palmpay'];
      const lowerText = recognizedText.toLowerCase();
      for (const word of bankWords) {
        if (lowerText.includes(word)) {
          // Extract nearby text as bank name
          const idx = lowerText.indexOf(word);
          const snippet = recognizedText.substring(Math.max(0, idx - 20), idx + 30);
          const nameMatch = snippet.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
          if (nameMatch) {
            setBankName(nameMatch[1]);
            break;
          }
        }
      }

      // Extract account name
      const namePatterns = [
        /(?:name|acct name|account name|holder)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m,
      ];

      for (const pattern of namePatterns) {
        const match = recognizedText.match(pattern);
        if (match && match[1]) {
          setAccountName(match[1].trim());
          break;
        }
      }

      // Extract amount
      const amountMatch = recognizedText.match(/₦\s*([\d,]+(?:\.\d{2})?)/);
      if (amountMatch && amountMatch[1]) {
        setAmount(amountMatch[1].replace(/,/g, ''));
      }

      Alert.alert('Detection Complete',
        'Account: ' + extractedAccount + '\nBank: ' + (bankName || 'N/A') + '\nName: ' + (accountName || 'N/A'));

    } catch (error) {
      console.error('Extraction failed:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to extract details');
    } finally {
      setProcessing(false);
    }
  };

  const handleSendMoney = async () => {
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!accountNumber) {
      Alert.alert('Error', 'Please snap an account number first');
      return;
    }

    try {
      setSending(true);
      const response = await transferToWallet(numericAmount, accountNumber);

      const transactionId =
        response?.transaction?._id ||
        response?.data?.transaction?._id ||
        response?.transactionId ||
        response?.data?.transactionId;

      if (transactionId) {
        router.replace({
          pathname: '/receipt/[transactionId]',
          params: { transactionId },
        });
        return;
      }

      Alert.alert('Success', '₦' + numericAmount.toLocaleString() + ' sent successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process transaction';
      Alert.alert('Payment Failed', message);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.primaryLight }]}>
          <ChevronLeft size={24} color={c.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.primary }]}>Snap & Send</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.captureSection}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.capturedImage} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => handleSnapPhoto(true)}
                disabled={processing || sending}
              >
                <RefreshCw size={16} color={c.primary} />
                <Text style={[styles.retakeText, { color: c.primary }]}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: c.surfaceContainer }]}>
              <Camera size={48} color={c.textSub} />
              <Text style={[styles.placeholderText, { color: c.textSub }]}>Snap a cheque, bank slip, or wallet</Text>
              <Text style={[styles.placeholderSubtext, { color: c.textSub }]}>Auto-detects account, bank, name & amount</Text>
            </View>
          )}

          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={c.primary} />
              <Text style={[styles.processingText, { color: c.primary }]}>Extracting details...</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => handleSnapPhoto(true)}
              disabled={processing || sending}
            >
              <LinearGradient colors={[c.primary, c.secondary]} style={styles.buttonGradient}>
                <Camera size={20} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.galleryButton, { borderColor: c.primary }]}
              onPress={() => handleSnapPhoto(false)}
              disabled={processing || sending}
            >
              <Text style={[styles.galleryButtonText, { color: c.primary }]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {accountNumber ? (
          <View style={[
            styles.resultCard,
            accountType === 'crypto' && styles.resultCardCrypto,
            accountType === 'nigerian' && styles.resultCardNigerian,
            { borderColor: accountType === 'crypto' ? '#FFD700' : accountType === 'nigerian' ? '#008751' : c.success },
          ]}>
            <View style={styles.resultHeader}>
              {accountType === 'crypto' ? (
                <Wallet size={20} color={c.primary} />
              ) : accountType === 'nigerian' ? (
                <Text style={styles.flagEmoji}>🇳🇬</Text>
              ) : (
                <Building2 size={20} color={c.secondary} />
              )}
              <Text style={[styles.resultType, { color: c.primary }]}>
                {accountType === 'crypto' ? 'Crypto Wallet' :
                  accountType === 'nigerian' ? 'Nigerian Bank' :
                    accountType === 'international' ? 'International' : 'Unknown'}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: c.textSub }]}>Account:</Text>
              <Text style={[styles.resultValue, { color: c.primary }]}>{accountNumber}</Text>
            </View>

            {bankName ? (
              <View style={styles.resultRow}>
                <Text style={[styles.resultLabel, { color: c.textSub }]}>Bank/Wallet:</Text>
                <Text style={[styles.resultValue, { color: c.primary }]}>{bankName}</Text>
              </View>
            ) : null}

            {accountName ? (
              <View style={styles.resultRow}>
                <User size={14} color={c.textSub} />
                <Text style={[styles.resultLabel, { color: c.textSub }]}>Name:</Text>
                <Text style={[styles.resultValue, { color: c.primary }]}>{accountName}</Text>
              </View>
            ) : null}

            <Text style={[styles.resultConfidence, { color: c.success }]}>
              Confidence: {(confidence * 100).toFixed(1)}%
            </Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Amount (₦)</Text>
          <TextInput
            style={[styles.amountInput, { borderColor: c.border }]}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Note (Optional)</Text>
          <TextInput
            style={[styles.noteInput, { borderColor: c.border }]}
            placeholder="What's this for?"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, (!accountNumber || !amount || sending) && styles.buttonDisabled]}
          onPress={handleSendMoney}
          disabled={!accountNumber || !amount || sending}
        >
          <LinearGradient
            colors={(!accountNumber || !amount || sending) ? ['#ccc', '#ccc'] : [c.primary, c.secondary]}
            style={styles.buttonGradient}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Send size={20} color="#fff" />
                <Text style={styles.buttonText}>Send Money</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },

  captureSection: { marginBottom: 24 },
  imageContainer: { marginBottom: 16, alignItems: 'center' },
  capturedImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  retakeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  retakeText: { fontSize: 14, fontWeight: '600' },

  placeholderContainer: {
    height: 220,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 20,
  },
  placeholderText: { marginTop: 12, fontSize: 16, textAlign: 'center', fontWeight: '600' },
  placeholderSubtext: { marginTop: 4, fontSize: 12, textAlign: 'center' },

  processingOverlay: {
    alignItems: 'center',
    padding: 16,
  },
  processingText: { marginTop: 8, fontSize: 14, fontWeight: '600' },

  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cameraButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  galleryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  galleryButtonText: { fontSize: 14, fontWeight: '600' },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  resultCardCrypto: {},
  resultCardNigerian: {},
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  flagEmoji: { fontSize: 20 },
  resultType: { fontSize: 14, fontWeight: '600' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  resultLabel: { fontSize: 12 },
  resultValue: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  resultConfidence: { fontSize: 12, marginTop: 8 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amountInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 24, fontWeight: '700', textAlign: 'center', borderWidth: 1 },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, borderWidth: 1, minHeight: 80 },

  sendButton: { borderRadius: 14, overflow: 'hidden', marginTop: 12, marginBottom: 20 },
  buttonDisabled: { opacity: 0.5 },
});
