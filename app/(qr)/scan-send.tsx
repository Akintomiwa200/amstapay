// app/(qr)/scan-send.tsx - Snap & Send: OCR extract → verify → transfer → real-time status
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useTheme } from '@/context/ThemeContext';
import { extractTransactionId } from '@/lib/billPayment';
import { apiClient } from '@/lib/api';
import {
  cleanupImageFile,
  extractAccountData,
  type AccountType,
  type ExtractedAccountData,
} from '@/lib/ocr';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Building2, Camera, CheckCircle, ChevronLeft, RefreshCw, Send, User, Wallet, AlertCircle,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const { socket } = useSocket();
  const params = useLocalSearchParams<{
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    bankCode?: string;
    type?: AccountType;
    amount?: string;
    mode?: string;
  }>();

  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedAccountData | null>(null);
  const [rawText, setRawText] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('unknown');
  const [confidence, setConfidence] = useState(0);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevImageRef = useRef<string | null>(null);

  const applyExtraction = useCallback((result: ExtractedAccountData) => {
    setExtracted(result);
    setRawText(result.rawText || '');
    if (result.accountNumber) setAccountNumber(result.accountNumber);
    if (result.accountName) setAccountName(result.accountName);
    if (result.bankName) setBankName(result.bankName);
    if (result.bankCode) setBankCode(result.bankCode);
    setAccountType(result.type);
    setConfidence(result.confidence);
    if (result.amount) setAmount(result.amount);
  }, []);

  const verifyAccount = useCallback(async (acct: string, code?: string, bank?: string) => {
    if (!acct || acct.length !== 10) return;
    setVerifying(true);
    try {
      if (code) {
        const response = await apiClient.post('/bank/verify', { bankCode: code, accountNumber: acct });
        const name = (response as { accountName?: string }).accountName;
        if (name) setAccountName(name);
      } else {
        const response = await apiClient.post('/accounts/verify', { accountNumber: acct, bankName: bank });
        const data = response as { accountName?: string; account_name?: string; bankName?: string; bank_name?: string };
        if (data.accountName || data.account_name) setAccountName(data.accountName || data.account_name || '');
        if ((data.bankName || data.bank_name) && !bankName) setBankName(data.bankName || data.bank_name || '');
      }
    } catch {
      // verification optional — user can still send to AmstaPay account numbers
    } finally {
      setVerifying(false);
    }
  }, [bankName]);

  useEffect(() => {
    if (params.accountNumber) {
      setAccountNumber(params.accountNumber);
      setAccountName(params.accountName || '');
      setBankName(params.bankName || '');
      setBankCode(params.bankCode || '');
      setAccountType((params.type as AccountType) || 'unknown');
      if (params.amount) setAmount(params.amount);
      setConfidence(0.95);
    }
  }, [params]);

  useEffect(() => {
    if (accountNumber.length === 10) {
      const timer = setTimeout(() => verifyAccount(accountNumber, bankCode || undefined, bankName || undefined), 400);
      return () => clearTimeout(timer);
    }
  }, [accountNumber, bankCode, bankName, verifyAccount]);

  useEffect(() => {
    if (prevImageRef.current && prevImageRef.current !== image) {
      cleanupImageFile(prevImageRef.current);
    }
    prevImageRef.current = image;
  }, [image]);

  useEffect(() => () => {
    if (prevImageRef.current) cleanupImageFile(prevImageRef.current);
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'web') return true;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to snap account details.');
      return false;
    }
    return true;
  };

  const runExtraction = async (imageUri: string) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await extractAccountData(imageUri);
      applyExtraction(result);
      if (result.accountNumber) {
        await verifyAccount(result.accountNumber, result.bankCode, result.bankName);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not read the image';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSnapPhoto = async (useCamera = true) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.85,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.85,
          });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (image) await cleanupImageFile(image);
        setImage(imageUri);
        setExtracted(null);
        setRawText('');
        setAccountNumber('');
        setAccountName('');
        setBankName('');
        setBankCode('');
        setAccountType('unknown');
        setConfidence(0);
        setError(null);
        await runExtraction(imageUri);
      }
    } catch {
      setError('Failed to capture image. Please try again.');
    }
  };

  const handleRetake = async () => {
    if (image) await cleanupImageFile(image);
    setImage(null);
    setExtracted(null);
    setRawText('');
    setAccountNumber('');
    setAccountName('');
    setBankName('');
    setBankCode('');
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
      Alert.alert('Error', 'Snap or enter an account number first');
      return;
    }

    try {
      setSending(true);
      const description = [
        'Snap & Send',
        bankName ? `Bank: ${bankName}` : '',
        accountName ? `To: ${accountName}` : '',
        note ? `Note: ${note}` : '',
      ].filter(Boolean).join(' · ');

      const response = await transferToWallet!(numericAmount, accountNumber, {
        description,
        bankName: bankName || undefined,
        bankCode: bankCode || undefined,
      });

      const transactionId = extractTransactionId(response);

      if (image) await cleanupImageFile(image);

      if (transactionId) {
        router.replace({
          pathname: '/waiting-transaction',
          params: {
            transactionId,
            accountName: accountName || 'Recipient',
            accountNumber,
            bank: bankName || 'AmstaPay',
            amount: `₦${numericAmount.toLocaleString()}`,
          },
        });
        return;
      }

      router.replace({
        pathname: '/transaction-success',
        params: {
          accountName: accountName || 'Recipient',
          accountNumber,
          bank: bankName || 'AmstaPay',
          amount: `₦${numericAmount.toLocaleString()}`,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        },
      });
    } catch (err) {
      Alert.alert('Payment Failed', err instanceof Error ? err.message : 'Unable to process transaction');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const onWallet = () => {
      // balance updates handled globally
    };
    socket.on('wallet:update', onWallet);
    return () => { socket.off('wallet:update', onWallet); };
  }, [socket]);

  const numericAmount = Number(amount);
  const canSend = !!accountNumber && Number.isFinite(numericAmount) && numericAmount > 0 && !sending && !processing;

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
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} disabled={processing || sending}>
                <RefreshCw size={16} color={c.primary} />
                <Text style={[styles.retakeText, { color: c.primary }]}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: c.surfaceContainer || c.primaryLight }]}>
              <Camera size={48} color={c.textSub} />
              <Text style={[styles.placeholderText, { color: c.textSub }]}>Snap a bank slip, cheque, or bill</Text>
              <Text style={[styles.placeholderSubtext, { color: c.textSub }]}>
                We read account number, bank, name, and amount automatically
              </Text>
            </View>
          )}

          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={c.primary} />
              <Text style={[styles.processingText, { color: c.primary }]}>Reading text from image…</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#e74c3c" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cameraButton} onPress={() => handleSnapPhoto(true)} disabled={processing || sending}>
              <LinearGradient colors={[c.primary, c.secondary || c.violet]} style={styles.buttonGradient}>
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

        {rawText ? (
          <View style={[styles.rawTextCard, { borderColor: c.border }]}>
            <Text style={[styles.rawTextLabel, { color: c.textSub }]}>Detected text</Text>
            <Text style={[styles.rawTextValue, { color: c.text }]} numberOfLines={4}>{rawText}</Text>
            {extracted?.source ? (
              <Text style={[styles.sourceTag, { color: c.violet }]}>
                via {extracted.source === 'server' ? 'cloud OCR' : 'on-device OCR'}
              </Text>
            ) : null}
          </View>
        ) : null}

        {accountNumber ? (
          <View style={[styles.resultCard, { borderColor: c.success }]}>
            <View style={styles.resultHeader}>
              {accountType === 'crypto' ? <Wallet size={20} color={c.primary} /> : <Building2 size={20} color={c.secondary || c.violet} />}
              <Text style={[styles.resultType, { color: c.primary }]}>
                {accountType === 'crypto' ? 'Crypto Wallet' : accountType === 'nigerian' ? 'Nigerian Bank' : 'Account'}
              </Text>
              {verifying ? <ActivityIndicator size="small" color={c.primary} /> : confidence >= 0.8 ? <CheckCircle size={16} color={c.success} /> : null}
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: c.textSub }]}>Account:</Text>
              <Text style={[styles.resultValue, { color: c.primary }]}>{accountNumber}</Text>
            </View>
            {bankName ? (
              <View style={styles.resultRow}>
                <Text style={[styles.resultLabel, { color: c.textSub }]}>Bank:</Text>
                <Text style={[styles.resultValue, { color: c.primary }]}>{bankName}</Text>
              </View>
            ) : null}
            {accountName ? (
              <View style={styles.resultRow}>
                <User size={14} color={c.textSub} />
                <Text style={[styles.resultValue, { color: c.primary }]}>{accountName}</Text>
              </View>
            ) : null}
            {confidence > 0 ? (
              <Text style={[styles.resultConfidence, { color: c.success }]}>
                OCR confidence: {(confidence * 100).toFixed(0)}%
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Account Number</Text>
          <TextInput
            style={[styles.textInput, { borderColor: c.border, color: c.text }]}
            placeholder="Enter or snap account number"
            placeholderTextColor={c.textSub}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: c.primary }]}>Account Name</Text>
          <TextInput
            style={[styles.textInput, { borderColor: c.border, color: c.text }]}
            placeholder="Verified account name"
            placeholderTextColor={c.textSub}
            value={accountName}
            onChangeText={setAccountName}
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
          <Text style={[styles.inputLabel, { color: c.primary }]}>Amount (₦)</Text>
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
          style={[styles.sendButton, !canSend && styles.buttonDisabled]}
          onPress={handleSendMoney}
          disabled={!canSend}
        >
          <LinearGradient
            colors={!canSend ? ['#ccc', '#ccc'] : [c.primary, c.secondary || c.violet]}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  captureSection: { marginBottom: 24 },
  imageContainer: { marginBottom: 16, alignItems: 'center' },
  capturedImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12 },
  retakeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  retakeText: { fontSize: 14, fontWeight: '600' },
  placeholderContainer: { height: 220, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16, padding: 20 },
  placeholderText: { marginTop: 12, fontSize: 16, textAlign: 'center', fontWeight: '600' },
  placeholderSubtext: { marginTop: 4, fontSize: 12, textAlign: 'center' },
  processingOverlay: { alignItems: 'center', padding: 16 },
  processingText: { marginTop: 8, fontSize: 14, fontWeight: '600' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: 10, marginBottom: 12 },
  errorText: { color: '#e74c3c', fontSize: 13, flex: 1 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cameraButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  galleryButton: { flex: 1, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  galleryButtonText: { fontSize: 14, fontWeight: '600' },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  rawTextCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1 },
  rawTextLabel: { fontSize: 12, marginBottom: 6 },
  rawTextValue: { fontSize: 13, lineHeight: 18 },
  sourceTag: { fontSize: 11, marginTop: 8, fontWeight: '600' },
  resultCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultType: { fontSize: 14, fontWeight: '600', flex: 1 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  resultLabel: { fontSize: 12 },
  resultValue: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  resultConfidence: { fontSize: 12, marginTop: 8 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  textInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 15, borderWidth: 1 },
  amountInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 24, fontWeight: '700', textAlign: 'center', borderWidth: 1 },
  noteInput: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 14, borderWidth: 1, minHeight: 80 },
  sendButton: { borderRadius: 14, overflow: 'hidden', marginTop: 12, marginBottom: 20 },
  buttonDisabled: { opacity: 0.5 },
});
