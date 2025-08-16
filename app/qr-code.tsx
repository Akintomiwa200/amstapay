import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
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
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeScreen() {
    const navigation = useRouter();
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('1234567890');
    const [qrData, setQrData] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentTransactionId, setCurrentTransactionId] = useState('');
    const [qrRef, setQrRef] = useState<any>(null);

    // Generate a random transaction ID
    const generateTransactionId = async () => {
        const randomBytes = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            Math.random().toString() + Date.now().toString()
        );
        return `TXN_${randomBytes.substring(0, 8)}`;
    };

    // Generate QR data when amount changes
    useEffect(() => {
        const generateNewQR = async () => {
            const newTransactionId = await generateTransactionId();
            setCurrentTransactionId(newTransactionId);
            generateQRData(newTransactionId);
        };
        
        generateNewQR();
    }, [amount]);

    const generateQRData = (transactionId: string) => {
        if (!amount) {
            setQrData('');
            return;
        }

        const paymentData = {
            type: 'payment',
            account: accountNumber,
            amount: amount,
            currency: 'NGN',
            description: 'Add money to wallet',
            timestamp: Date.now(),
            transactionId: transactionId,
            reference: `TXN${Date.now().toString().slice(-8)}`
        };
        
        setQrData(JSON.stringify(paymentData));
    };

    const handleAmountChange = (value: string) => {
        // Only allow numbers and decimal point
        const numericValue = value.replace(/[^0-9.]/g, '');
        
        // Ensure only two decimal places
        const parts = numericValue.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1].slice(0, 2);
            setAmount(parts.join('.'));
        } else {
            setAmount(numericValue);
        }
    };

    const regenerateQR = async () => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount first');
            return;
        }

        setIsGenerating(true);
        const newTransactionId = await generateTransactionId();
        setCurrentTransactionId(newTransactionId);
        
        setTimeout(() => {
            generateQRData(newTransactionId);
            setIsGenerating(false);
        }, 500);
    };

    const copyToClipboard = async () => {
        if (!qrData) {
            Alert.alert('Error', 'No payment details to copy');
            return;
        }
        
        try {
            // Using expo-clipboard would be better here
            // For now using the basic approach
            const clipboardString = `Account: ${accountNumber}\nAmount: ₦${amount}\nTransaction ID: ${currentTransactionId}`;
            await navigator.clipboard.writeText(clipboardString);
            Alert.alert('Copied!', 'Payment details copied to clipboard');
        } catch (error) {
            Alert.alert('Error', 'Failed to copy to clipboard');
        }
    };

 

    const shareQRCode = async () => {
        if (!qrData) {
            Alert.alert('Error', 'Please generate a QR code first');
            return;
        }

        try {
            await Share.share({
                message: `Add money to my account: ${accountNumber}\nAmount: ₦${amount || '0'}\nTransaction ID: ${currentTransactionId}`,
                title: 'Payment Request',
            });
        } catch (error) {
            Alert.alert('Error', 'Unable to share payment details');
        }
    };

    const saveQRCode = async () => {
        if (!qrRef || !qrData) {
            Alert.alert('Error', 'No QR code to save');
            return;
        }

        try {
            // Request permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Permission to access media library is required');
                return;
            }

            // Generate QR code as base64
            qrRef?.toDataURL(async (data: string) => {
                const fileUri = FileSystem.cacheDirectory + `qr_code_${currentTransactionId}.png`;
                
                try {
                    await FileSystem.writeAsStringAsync(fileUri, data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    const asset = await MediaLibrary.createAssetAsync(fileUri);
                    await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
                    
                    Alert.alert('Success', 'QR code saved to gallery');
                } catch (error) {
                    console.error(error);
                    Alert.alert('Error', 'Failed to save QR code');
                }
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save QR code');
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
                            keyboardType="decimal-pad"
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
                                    {qrData ? (
                                        <>
                                            <QRCode
                                                value={qrData}
                                                size={200}
                                                color="#000000"
                                                backgroundColor="#FFFFFF"
                                                getRef={(ref) => setQrRef(ref)}
                                            />
                                            <Text style={styles.qrAmount}>
                                                {amount ? `₦${amount}` : 'Enter amount'}
                                            </Text>
                                            <Text style={styles.transactionId}>
                                                {currentTransactionId}
                                            </Text>
                                        </>
                                    ) : (
                                        <View style={styles.placeholderQR}>
                                            <Text style={styles.placeholderText}>
                                                Enter amount to generate QR code
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* QR Actions */}
                        <View style={styles.qrActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={regenerateQR}
                                disabled={isGenerating || !amount}
                            >
                                <RefreshCw size={20} color={!amount ? "#9CA3AF" : "#0D47A1"} />
                                <Text style={[styles.actionText, !amount && styles.disabledText]}>
                                    Refresh
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={copyToClipboard}
                                disabled={!accountNumber}
                            >
                                <Copy size={20} color={!accountNumber ? "#9CA3AF" : "#0D47A1"} />
                                <Text style={[styles.actionText, !accountNumber && styles.disabledText]}>
                                    Copy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={shareQRCode}
                                disabled={!qrData}
                            >
                                <Share2 size={20} color={!qrData ? "#9CA3AF" : "#0D47A1"} />
                                <Text style={[styles.actionText, !qrData && styles.disabledText]}>
                                    Share
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={saveQRCode}
                                disabled={!qrData}
                            >
                                <Download size={20} color={!qrData ? "#9CA3AF" : "#0D47A1"} />
                                <Text style={[styles.actionText, !qrData && styles.disabledText]}>
                                    Save
                                </Text>
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
    qrAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0D47A1',
        marginTop: 12,
    },
    transactionId: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
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
    placeholderQR: {
        width: 200,
        height: 200,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    placeholderText: {
        color: '#6B7280',
        textAlign: 'center',
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
    disabledText: {
        color: '#9CA3AF',
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