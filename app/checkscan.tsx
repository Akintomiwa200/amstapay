// checkscan.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, QrCode, Download, Share2, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot'
import { 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Share,
  Alert
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext'; // Update this path

const CheckScan = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const router = useRouter();
  
  const { user, getWalletBalance, refreshUser } = useAuth();
const qrRef = React.useRef<QRCode>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoadingBalance(true);
      
      // Refresh user data and get wallet balance
      await refreshUser();
      const balance = await getWalletBalance();
      setWalletBalance(balance.balance);
      
    } catch (error: any) {
      console.error('Failed to load user data:', error);
      Alert.alert('Error', 'Failed to load user information');
    } finally {
      setLoadingBalance(false);
    }
  };

  const generateQRData = () => {
    if (!user) return "";
    
    return JSON.stringify({
      type: "receive_payment",
      userId: user._id,
      name: user.fullName || user.name || "Unknown User",
      accountNumber: user.phoneNumber || user.phone || "",
      bank: "AmstaPay",
      phone: user.phoneNumber || user.phone || "",
      email: user.email || "",
      timestamp: new Date().toISOString()
    });
  };

  const handleShareQR = async () => {
    if (!user) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    try {
      const userName = user.fullName || user.name || 'AmstaPay User';
      const userPhone = user.phoneNumber || user.phone || 'Not available';
      
      await Share.share({
        message: `Send money to ${userName} via QR code scanning. Phone: ${userPhone}, Bank: AmstaPay`,
        title: 'Share QR Payment Details'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

 const handleDownloadQR = async () => {
  if (!qrRef.current) return;

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to save images to your gallery');
      return;
    }

    qrRef.current.toDataURL((dataURL: string) => {
      const path = `${FileSystem.cacheDirectory}QR_${Date.now()}.png`;
      FileSystem.writeAsStringAsync(path, dataURL, { encoding: FileSystem.EncodingType.Base64 })
        .then(async () => {
          await MediaLibrary.saveToLibraryAsync(path);
          Alert.alert('Success', 'QR code saved to your gallery!');
        })
        .catch((err) => {
          console.error(err);
          Alert.alert('Error', 'Failed to save QR code');
        });
    });
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong while saving QR code');
  }
};


  const openScanner = () => {
    router.push('/scan' as any); // Navigate to your scan screen
  };

  // Show loading state while user data is being fetched
  if (!user || loadingBalance) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading your QR code...</Text>
      </View>
    );
  }

  const qrData = generateQRData();
  const userName = user.fullName || user.name || 'AmstaPay User';
  const userPhone = user.phoneNumber || user.phone || 'Not available';

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>My QR Code</Text>
          <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
            <Camera color="#F97316" size={24} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
  <User size={24} color="#F97316" />
</View>
<Text style={styles.userName}>{user.fullName || user.name}</Text>
<Text style={styles.userDetails}>{user.accountNumber || user.phoneNumber || user.phone}</Text>
<Text style={styles.userDetails}>AmstaPay</Text>

          {walletBalance !== null && (
            <Text style={styles.balanceText}>
              Balance: ₦{walletBalance.toLocaleString()}
            </Text>
          )}
        </View>

        {/* QR Code Display */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCard}>
          <View
  ref={qrCardRef}
  style={{
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  }}
>
       <QRCode
  value={qrData}
  size={250}
  color="#000000"
  backgroundColor="#FFFFFF"
  logoSize={60}
  logoMargin={10}
  logoBorderRadius={30}
  logoBackgroundColor="transparent"
  getRef={qrRef}
/>
{/* User info below QR */}
  <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 12 }}>
    {userName}
  </Text>
  <Text style={{ fontSize: 14, color: '#666' }}>
    {user.phoneNumber || user.phone}
  </Text>
  <Text style={{ fontSize: 14, color: '#666' }}>
    {user.email}
  </Text>
</View>

            
            <View style={styles.qrOverlay}>
              <View style={styles.logoContainer}>
                <QrCode size={30} color="#F97316" />
                <Text style={styles.appName}>AmstaPay</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.qrInstruction}>
            Show this QR code to receive payments instantly
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareQR}>
            <Share2 size={24} color="#F97316" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadQR}>
            <Download size={24} color="#F97316" />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#F97316" />
            <Text style={styles.processingText}>Processing transaction...</Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>Your QR code contains your payment details</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>Others can scan to send you money instantly</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>Scan others' QR codes to pay them quickly</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>All transactions are secure and encrypted</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => router.push('/wallet' as any)}
          >
            <Text style={styles.quickActionText}>View Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => router.push('/transactions' as any)}
          >
            <Text style={styles.quickActionText}>Transaction History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CheckScan;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    marginVertical: 'auto',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  scanButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
    marginTop: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontWeight: 'bold',
    color: '#F97316',
  },
  qrInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 250,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#F97316',
    fontWeight: '600',
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#F97316',
    borderRadius: 3,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});