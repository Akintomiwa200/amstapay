// app/(qr)/scan-send.tsx - Snap & Send with real-time OCR + file cleanup
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
    cleanupImageFile,
    extractAccountData,
    type AccountType,
    type ExtractedAccountData,
} from '@/lib/ocr';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Building2, Camera, CheckCircle, ChevronLeft, RefreshCw, Send, User, Wallet } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ScanSendScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { transferToWallet } = useAuth();
  const params = useLocalSearchParams<{
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    type?: AccountType;
  }>();

  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedAccountData | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('unknown');
  const [confidence, setConfidence] = useState(0);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevImageRef = useRef<string | null>(null);

  // Handle incoming params from old snap-account redirect
  useEffect(() => {
    if (params.accountNumber) {
      setAccountNumber(params.accountNumber);
      setAccountName(params.accountName || '');
      setBankName(params.bankName || '');
      setAccountType((params.type as AccountType) || 'unknown');
      setConfidence(0.95);
    }
  }, [params]);

  // Cleanup previous image when image changes or on unmount
  useEffect(() => {
    if (prevImageRef.current && prevImageRef.current !== image) {
      cleanupImageFile(prevImageRef.current);
    }
    prevImageRef.current = image;
  }, [image]);

  useEffect(() => {
    return () => {
      if (prevImageRef.current) {
        cleanupImageFile(prevImageRef.current);
      }
    };
  }, []);

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
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        // Clean up previous image before setting new one
        if (image) {
          await cleanupImageFile(image);
        }
        setImage(imageUri);
        setExtracted(null);
        setAccountNumber('');
        setAccountName('');
        setBankName('');
        setAccountType('unknown');
        setConfidence(0);
        setAmount('');
        setError(null);
        // Real-time auto-extract
        await runExtraction(imageUri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to capture image. Please try again.');
    }
  };

  const runExtraction = async (imageUri: string) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await extractAccountData(imageUri);
      setExtracted(result);
      setAccountNumber(result.accountNumber);
      setAccountName(result.accountName);
      setBankName(result.bankName);
      setAccountType(result.type);
      setConfidence(result.confidence);
      if (result.amount) {
        setAmount(result.amount);
      }

      // Auto-cleanup image after successful extraction to save storage
      await cleanupImageFile(imageUri);
      setImage(null);
    } catch (err) {
      // OCR failed - this is expected if the library is not available
      // Just show the image for reference and allow manual entry
      console.warn('OCR not available, using manual entry:', err);
      setError(null); // Don't show error, just allow manual entry
      setAccountNumber('');
      setAccountName('');
      setBankName('');
      setAccountType('unknown');
      setConfidence(0);
    } finally {
      setProcessing(false);
    }
  };

  const handleRetake = () => {
    if (image) {
      cleanupImageFile(image);
    }
    setImage(null);
    setExtracted(null);
    setAccountNumber('');
    setAccountName('');
    setBankName('');
    setAccountType('unknown');
    setConfidence(0);
    setAmount('');
    setError(null);
  };

  const handleSendMoney = async () => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!accountNumber) {
      Alert.alert('Error', 'Please snap or enter an account number first');
      return;
    }

    try {
      setSending(true);
      const response = await transferToWallet!(numericAmount, accountNumber);

      const transactionId =
        (response as any)?.transaction?._id ||
        (response as any)?.data?.transaction?._id ||
        (response as any)?.transactionId ||
        (response as any)?.data?.transactionId;

      if (transactionId) {
        router.replace({
          pathname: '/receipt/[transactionId]',
          params: { transactionId },
        });
        return;
      }

      Alert.alert('Success', 'N' + numericAmount.toLocaleString() + ' sent successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process transaction';
      Alert.alert('Payment Failed', message);
    } finally {
      setSending(false);
    }
  };

  const numericAmount = Number(amount);
  const canSend = accountNumber && Number.isFinite(numericAmount) && numericAmount > 0 && !sending;

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
        {/* Capture Section */}
        <View style={styles.captureSection}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.capturedImage} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} disabled={processing || sending}>
                <RefreshCw size={16} color={c.primary} />
                <Text style={[styles.retakeText, { color: c.primary }]}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: c.surfaceContainer }]}>
              <Camera size={48} color={c.textSub} />
              <Text style={[styles.placeholderText, { color: c.textSub }]}>Snap a cheque, bank slip, or wallet</Text>
              <Text style={[styles.placeholderSubtext, { color: c.textSub }]}>Capture for reference (manual entry required)</Text>
            </View>
          )}

          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={c.primary} />
              <Text style={[styles.processingText, { color: c.primary }]}>Processing image...</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cameraButton} onPress={() => handleSnapPhoto(true)} disabled={processing || sending}>
              <LinearGradient colors={[c.primary, c.secondary]} style={styles.buttonGradient}>
                <Camera size={20} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.galleryButton, { borderColor: c.primary }]} onPress={() => handleSnapPhoto(false)} disabled={processing || sending}>
              <Text style={[styles.galleryButtonText, { color: c.primary }]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extracted Result Card */}
        {accountNumber ? (
          <View
            style={[
              styles.resultCard,
              { borderColor: accountType === 'crypto' ? '#FFD700' : accountType === 'nigerian' ? '#008751' : c.success },
            ]}
          >
            <View style={styles.resultHeader}>
              {accountType === 'crypto' ? (
                <Wallet size={20} color={c.primary} />
              ) : accountType === 'nigerian' ? (
                <Text style={styles.flagEmoji}>NG</Text>
              ) : (
                <Building2 size={20} color={c.secondary} />
              )}
              <Text style={[styles.resultType, { color: c.primary }]}>
                {accountType === 'crypto'
                  ? 'Crypto Wallet'
                  : accountType === 'nigerian'
                  ? 'Nigerian Bank'
                  : accountType === 'international'
                  ? 'International'
                  : 'Unknown'}
              </Text>
              {confidence >= 0.9 && <CheckCircle size={16} color={c.success} />}
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

        {/* Manual Inputs */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Account Number</Text>
          <TextInput
            style={[styles.textInput, { borderColor: c.border, color: c.text }]}
            placeholder="Enter or snap account number"
            placeholderTextColor={c.textSub}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="default"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Bank Name</Text>
          <TextInput
            style={[styles.textInput, { borderColor: c.border, color: c.text }]}
            placeholder="Enter bank name"
            placeholderTextColor={c.textSub}
            value={bankName}
            onChangeText={setBankName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Amount (N)</Text>
          <TextInput
            style={[styles.amountInput, { borderColor: c.border, color: c.text }]}
            placeholder="0.00"
            placeholderTextColor={c.textSub}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Note (Optional)</Text>
          <TextInput
            style={[styles.noteInput, { borderColor: c.border, color: c.text }]}
            placeholder="What's this for?"
            placeholderTextColor={c.textSub}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, (!canSend) && styles.buttonDisabled]}
          onPress={handleSendMoney}
          disabled={!canSend}
        >
          <LinearGradient
            colors={!canSend ? ['#ccc', '#ccc'] : [c.primary, c.secondary]}
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

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: { color: '#e74c3c', fontSize: 13, flex: 1 },
  errorSubtext: { fontSize: 11, marginTop: 4, flex: 1 },

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
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  flagEmoji: { fontSize: 16, fontWeight: '700' },
  resultType: { fontSize: 14, fontWeight: '600', flex: 1 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  resultLabel: { fontSize: 12 },
  resultValue: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  resultConfidence: { fontSize: 12, marginTop: 8 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  textInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 15, borderWidth: 1 },
  amountInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 24, fontWeight: '700', textAlign: 'center', borderWidth: 1 },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, borderWidth: 1, minHeight: 80 },

  sendButton: { borderRadius: 14, overflow: 'hidden', marginTop: 12, marginBottom: 20 },
  buttonDisabled: { opacity: 0.5 },
});
