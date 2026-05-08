// checkscan.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, QrCode, Download, Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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

const CheckScan = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  
  // Mock user data that would be embedded in the QR code
  const [userData, setUserData] = useState({
    userId: "USER-123456",
    name: "John Doe",
    accountNumber: "1234567890",
    bank: "AmstaPay",
    phone: "+2348012345678"
  });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setHasPermission(true);
    }, 1000);

    // UNCOMMENT FOR AUTO NAVIGATION TESTING
    // Auto navigate to waiting screen after 3 seconds for testing
    // const autoNavigateTimer = setTimeout(() => {
    //   handleSimulatedScan();
    // }, 3000);
    // return () => clearTimeout(autoNavigateTimer);
  }, []);

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: `Send money to ${userData.name} via QR code. Account: ${userData.accountNumber}, Bank: ${userData.bank}`,
        title: 'Share QR Payment Details'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  // SIMULATED SCANNING LOGIC (for testing without actual device)
  const handleSimulatedScan = () => {
    setScanned(true);
    setIsProcessing(true);
    
    // Simulate processing the QR code data
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate to the waiting screen with transaction data
      router.push({
        pathname: '/waiting-transaction',
        params: {
          accountName: userData.name,
          accountNumber: userData.accountNumber,
          bank: userData.bank,
          amount: "₦5,000.00"
        }
      } as any);
    }, 2000);
  };

  // ACTUAL SCANNING LOGIC (commented out for testing)
  /*
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsProcessing(true);
    
    try {
      // Parse the QR code data
      const scannedData = JSON.parse(data);
      
      // Validate the QR code data
      if (scannedData.type === "payment" && scannedData.accountNumber) {
        // Process the payment after a short delay
        setTimeout(() => {
          setIsProcessing(false);
          router.push({
            pathname: '/waiting-transaction',
            params: {
              accountName: scannedData.name,
              accountNumber: scannedData.accountNumber,
              bank: scannedData.bank,
              amount: "₦5,000.00" // This would typically come from an amount input
            }
          } as any);
        }, 2000);
      } else {
        Alert.alert('Error', 'Invalid QR code format');
        setIsProcessing(false);
        setScanned(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not read QR code data');
      setIsProcessing(false);
      setScanned(false);
    }
  };
  */

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading your QR code...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // QR code data string (could be JSON encoded)
  const qrData = JSON.stringify({
    type: "payment",
    userId: userData.userId,
    accountNumber: userData.accountNumber,
    bank: userData.bank,
    name: userData.name,
    timestamp: new Date().toISOString()
  });

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>My QR Code</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userDetails}>{userData.accountNumber} </Text>
        </View>

        {/* QR Code Display */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCard}>
            <QRCode
              value={qrData}
              size={250}
              color="#000000"
              backgroundColor="#FFFFFF"
              logoSize={60}
              logoMargin={10}
              logoBorderRadius={30}
              logoBackgroundColor="transparent"
            />
            
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
          
          <TouchableOpacity style={styles.actionButton}>
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
            <Text style={styles.infoText}>You can also scan others' QR codes to pay them</Text>
          </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSpacer: {
    width: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 18,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 18,
    color: '#666',
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
    marginBottom: 40,
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
  scannerSection: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  scannerPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    marginBottom: 16,
  },
  qrFrame: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: '#F97316',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  simulateButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  simulateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginTop: 20,
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
  button: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
