// app/scan-send.tsx - New Web3 Scan & Send Screen
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, QrCode, ChevronLeft, Send, Scan, FileText } from 'lucide-react-native';
import { C } from '@/components/dashboardComponent/colors';

export default function ScanSendScreen() {
  const router = useRouter();
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScanQR = () => {
    // In production: open QR scanner
    Alert.alert('QR Scanner', 'Camera will open to scan recipient QR code');
  };

  const handleSnapAccount = () => {
    // In production: use OCR to capture account number from image
    Alert.alert('Snap Account', 'Camera will open to capture account number from cheque or card');
  };

  const handleSendMoney = async () => {
    if (!accountNumber || accountNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid account number');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    Alert.alert('Success', `₦${amount} sent successfully!`, [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan & Send</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, scanMode === 'qr' && styles.toggleActive]}
            onPress={() => setScanMode('qr')}
          >
            <QrCode size={18} color={scanMode === 'qr' ? '#fff' : C.primary} />
            <Text style={[styles.toggleText, scanMode === 'qr' && styles.toggleTextActive]}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, scanMode === 'manual' && styles.toggleActive]}
            onPress={() => setScanMode('manual')}
          >
            <FileText size={18} color={scanMode === 'manual' ? '#fff' : C.primary} />
            <Text style={[styles.toggleText, scanMode === 'manual' && styles.toggleTextActive]}>Manual Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Scan Area */}
        {scanMode === 'qr' ? (
          <View style={styles.scanArea}>
            <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
              <LinearGradient
                colors={[C.mint, C.blue, C.violet]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.scanButtonGradient}
              >
                <Camera size={40} color="#fff" />
                <Text style={styles.scanButtonText}>Tap to Scan QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.snapButton} onPress={handleSnapAccount}>
              <Scan size={24} color={C.violet} />
              <Text style={styles.snapButtonText}>Snap Account Number</Text>
              <Text style={styles.snapButtonSubtext}>Take a photo of cheque or account number</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.manualArea}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient Name</Text>
              <View style={styles.namePreview}>
                <Text style={styles.nameText}>John Doe</Text>
                <TouchableOpacity>
                  <Text style={styles.verifyText}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount (₦)</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Note Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's this for?"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney} disabled={loading}>
          <LinearGradient
            colors={[C.mint, C.blue, C.violet, C.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Send size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send Money</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
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
  toggleContainer: { flexDirection: 'row', backgroundColor: C.primaryLight, borderRadius: 40, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 36 },
  toggleActive: { backgroundColor: C.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: C.primary },
  toggleTextActive: { color: '#fff' },
  scanArea: { marginBottom: 24 },
  scanButton: { borderRadius: 20, overflow: 'hidden' },
  scanButtonGradient: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  scanButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { marginHorizontal: 12, color: C.textSub, fontSize: 12 },
  snapButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16, backgroundColor: C.primaryLight, borderRadius: 16 },
  snapButtonText: { fontSize: 16, fontWeight: '600', color: C.violet },
  snapButtonSubtext: { fontSize: 11, color: C.textSub },
  manualArea: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  input: { backgroundColor: C.inputBg, borderRadius: 14, padding: 14, fontSize: 16, borderWidth: 1, borderColor: C.border },
  amountInput: { backgroundColor: C.inputBg, borderRadius: 14, padding: 14, fontSize: 24, fontWeight: '700', textAlign: 'center', borderWidth: 1, borderColor: C.border },
  noteInput: { backgroundColor: C.inputBg, borderRadius: 14, padding: 14, fontSize: 14, borderWidth: 1, borderColor: C.border, minHeight: 80 },
  namePreview: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  nameText: { fontSize: 16, color: C.text },
  verifyText: { fontSize: 12, color: C.violet, fontWeight: '600' },
  sendButton: { borderRadius: 14, overflow: 'hidden', marginTop: 12 },
  sendButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  sendButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});