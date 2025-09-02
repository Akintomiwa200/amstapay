import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Update this path


const { width, height } = Dimensions.get("window");

interface ParsedQRData {
  type: string;
  data?: string;
  amount?: string;
  recipient?: string;
  reference?: string;
  merchantId?: string;
  name?: string;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const { sendViaQR, receiveViaQR, user } = useAuth();

  const parseQRData = (data: string): ParsedQRData => {
    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch {
      if (
        data.includes("pay") ||
        data.includes("transaction") ||
        data.includes("amount")
      ) {
        return { type: "payment_url", data };
      }
      return { type: "text", data };
    }
  };

  const handleQRPayment = async (parsedData: ParsedQRData) => {
    if (!parsedData.amount) {
      Alert.alert("Error", "Payment amount not specified in QR code");
      resetScanner();
      return;
    }

    try {
      setProcessing(true);
      await sendViaQR(parsedData, parseFloat(parsedData.amount));
      
      Alert.alert(
        "Payment Successful",
        `Successfully sent ₦${parsedData.amount} to ${parsedData.recipient || "recipient"}`,
        [
          {
            text: "OK",
            onPress: () => {
              resetScanner();
              router.back(); // Go back to previous screen
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Payment Failed",
        error.message || "Failed to process payment",
        [
          { text: "Cancel", onPress: resetScanner },
          { text: "Try Again", onPress: resetScanner },
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleMerchantPayment = (parsedData: ParsedQRData) => {
    // Navigate to merchant payment screen for amount input
    router.push({
      pathname: "/merchant-payment",
      params: {
        merchantId: parsedData.merchantId || "",
        merchantName: parsedData.name || "",
        type: "merchant_payment",
      },
    });
  };

  const handleReceiveQR = async (parsedData: ParsedQRData) => {
    try {
      setProcessing(true);
      await receiveViaQR(parsedData);
      
      Alert.alert(
        "Payment Received",
        "Successfully processed incoming payment",
        [
          {
            text: "OK",
            onPress: () => {
              resetScanner();
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to process received payment",
        [{ text: "OK", onPress: resetScanner }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned || processing) return;

    setScanned(true);
    const parsedData = parseQRData(data);

    // Check if user is authenticated
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please log in to process QR payments",
        [
          { text: "Cancel", onPress: resetScanner },
          {
            text: "Login",
            onPress: () => {
              router.push("/login");
            },
          },
        ]
      );
      return;
    }

    // Handle different QR types
    if (parsedData.type === "payment" || parsedData.amount) {
      Alert.alert(
        "Payment QR Code Detected",
        `Recipient: ${parsedData.recipient || "Unknown"}\nAmount: ₦${
          parsedData.amount || "Not specified"
        }`,
        [
          { text: "Cancel", onPress: resetScanner },
          {
            text: "Send Payment",
            onPress: () => handleQRPayment(parsedData),
          },
        ]
      );
    } else if (parsedData.type === "receive") {
      Alert.alert(
        "Receive Payment QR",
        "This QR code is for receiving a payment. Process it?",
        [
          { text: "Cancel", onPress: resetScanner },
          {
            text: "Process",
            onPress: () => handleReceiveQR(parsedData),
          },
        ]
      );
    } else if (parsedData.type === "merchant") {
      Alert.alert(
        "Merchant QR Code",
        `Merchant: ${parsedData.name || "Unknown Merchant"}`,
        [
          { text: "Cancel", onPress: resetScanner },
          {
            text: "Pay Merchant",
            onPress: () => handleMerchantPayment(parsedData),
          },
        ]
      );
    } else if (parsedData.data?.startsWith("http")) {
      Alert.alert(
        "URL Detected",
        `Do you want to open this payment link?\n${parsedData.data}`,
        [
          { text: "Cancel", onPress: resetScanner },
          {
            text: "Open",
            onPress: () => {
              router.push({
                pathname: "/web-payment",
                params: { url: parsedData.data || "" },
              });
            },
          },
        ]
      );
    } else {
      Alert.alert("QR Code Scanned", `Data: ${parsedData.data || ""}`, [
        { text: "Cancel", onPress: resetScanner },
        {
          text: "Process",
          onPress: () => {
            router.push({
              pathname: "/process-qr",
              params: { data: parsedData.data || "" },
            });
          },
        },
      ]);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setProcessing(false);
  };

  const toggleFlash = () => {
    setFlashOn((prev) => !prev);
  };

  const goBack = () => {
    router.back();
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text style={styles.info}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={64} color="#ff4444" />
          <Text style={styles.info}>Camera permission denied</Text>
          <Text style={styles.subInfo}>
            Please enable camera access in your device settings to scan QR codes
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={requestPermission}
          >
            <Text style={styles.retryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
          <Ionicons
            name={flashOn ? "flash" : "flash-off"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Logged in as: {user.fullName || user.name || user.email}
          </Text>
        </View>
      )}

      {/* Scanner */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.scanner}
          facing="back"
          flash={flashOn ? "on" : "off"}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Scanning Frame */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Position the QR code within the frame to scan
          </Text>
          <Text style={styles.subInstructions}>
            Make sure the code is clearly visible and well-lit
          </Text>
          {processing && (
            <Text style={styles.processingText}>Processing payment...</Text>
          )}
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {scanned && !processing && (
          <TouchableOpacity style={styles.rescanButton} onPress={resetScanner}>
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.rescanButtonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
        
        {processing && (
          <View style={styles.processingContainer}>
            <Ionicons name="hourglass-outline" size={20} color="white" />
            <Text style={styles.processingButtonText}>Processing...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  backButton: { padding: 5 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  flashButton: { padding: 5 },
  userInfo: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userInfoText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  scannerContainer: { flex: 1, position: "relative" },
  scanner: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#00ff00",
    borderWidth: 3,
  },
  topLeft: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0 },
  instructionsContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  subInstructions: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
  },
  processingText: {
    color: "#00ff00",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  bottomControls: { 
    paddingHorizontal: 20, 
    paddingVertical: 30, 
    alignItems: "center" 
  },
  rescanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aa44",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rescanButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600", 
    marginLeft: 8 
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  processingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  info: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "500", 
    textAlign: "center", 
    marginTop: 20 
  },
  subInfo: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#00aa44",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 30,
  },
  retryButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});