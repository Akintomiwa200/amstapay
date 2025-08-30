import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image, Alert, Modal, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

// Install these dependencies: 
// expo install expo-image-picker @react-native-picker/picker

// For real implementations, you would need these additional services:
// For BVN verification: Nigeria's NIBSS API (requires licensing)
// For bank account verification: Paystack or Flutterwave SDK
// For NIN verification: NIMC's verification service (requires licensing)

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");
  const router = useRouter();

  // Add missing state variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Agent form state
  const [agentData, setAgentData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    password: "", // Add password field
    residentialAddress: "",
    
    // Identity Verification
    idType: "",
    bvnOrNin: "",
    idDocument: null,
    passportPhoto: null,
    signature: null,
    
    // Business Information
    businessName: "",
    businessAddress: "",
    businessType: "",
    utilityBill: null,
    businessPhoto: null,
    
    // Financial Details
    bankName: "",
    accountName: "",
    accountNumber: "",
    
    // Guarantor Information (add missing fields)
    guarantorName: "",
    guarantorRelationship: "",
    guarantorPhone: "",
    guarantorAddress: "",
    
    // Security
    pin: "",
    confirmPin: "",
    securityQuestions: ["", "", ""],
    
    // Agreements
    termsAgreed: false,
    infoAccurate: false,
    verificationConsent: false,
  });

  // State for verification
  const [verifyingId, setVerifyingId] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [idDetails, setIdDetails] = useState(null);

  // Nigerian banks list
  const nigerianBanks = [
    "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank", 
    "First Bank of Nigeria", "First City Monument Bank", "Globus Bank", 
    "Guaranty Trust Bank", "Heritage Bank", "Keystone Bank", "Polaris Bank", 
    "Providus Bank", "Stanbic IBTC Bank", "Standard Chartered Bank", 
    "Sterling Bank", "Titan Trust Bank", "Union Bank of Nigeria", 
    "United Bank for Africa", "Unity Bank", "Wema Bank", "Zenith Bank"
  ];

  // Security questions
  const securityQuestionsList = [
    "What was your childhood nickname?",
    "What is the name of your favorite childhood friend?",
    "What street did you live on in third grade?",
    "What was the name of your first pet?",
    "What was your favorite food as a child?",
    "What was the make and model of your first car?",
    "What is your mother's maiden name?",
    "What is the name of your favorite teacher?",
    "What is your favorite movie?",
    "In what city did your parents meet?"
  ];

  // Environment variable for API base URL
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  // DISABLED FOR NOW - Verify BVN using NIBSS API (will be implemented later)
  // const verifyBvn = async (bvn) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/verify/bvn`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ bvn: bvn })
  //     });
  //     
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data;
  //     }
  //   } catch (error) {
  //     console.error("BVN verification error:", error);
  //     throw new Error("BVN verification service is temporarily unavailable");
  //   }
  // };

  // DISABLED FOR NOW - Verify NIN using NIMC API (will be implemented later)
  // const verifyNin = async (nin) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/verify/nin`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ nin: nin })
  //     });
  //     
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data;
  //     }
  //   } catch (error) {
  //     console.error("NIN verification error:", error);
  //     throw new Error("NIN verification service is temporarily unavailable");
  //   }
  // };

  // DISABLED FOR NOW - Verify bank account using Paystack API (will be implemented later)
  // const verifyBankAccount = async (bankCode, accountNumber) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/verify/bank-account`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         bank_code: bankCode,
  //         account_number: accountNumber 
  //       })
  //     });
  //     
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data;
  //     }
  //   } catch (error) {
  //     console.error("Bank verification error:", error);
  //     throw new Error("Bank verification service is temporarily unavailable");
  //   }
  // };

  // Get bank code from bank name
  const getBankCode = (bankName) => {
    // In a real implementation, you would have a mapping of bank names to codes
    const bankCodes = {
      "Access Bank": "044",
      "Guaranty Trust Bank": "058",
      "First Bank of Nigeria": "011",
      "United Bank for Africa": "033",
      "Zenith Bank": "057",
      "Fidelity Bank": "070",
      "Ecobank Nigeria": "050",
      "First City Monument Bank": "214",
      "Heritage Bank": "030",
      "Keystone Bank": "082",
      "Polaris Bank": "076",
      "Stanbic IBTC Bank": "221",
      "Standard Chartered Bank": "068",
      "Sterling Bank": "232",
      "Union Bank of Nigeria": "032",
      "Unity Bank": "215",
      "Wema Bank": "035",
      // Add more banks as needed
    };
    
    return bankCodes[bankName] || "999";
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setAgentData({
      ...agentData,
      [field]: value
    });
  };

  // DISABLED FOR NOW - ID verification (will be implemented later)
  const verifyId = async () => {
    Alert.alert("Info", "ID verification is temporarily disabled. You can proceed with registration.");
    return;
    
    // This will be re-enabled when backend verification APIs are ready
    // if (!agentData.idType || !agentData.bvnOrNin) {
    //   Alert.alert("Error", "Please select ID type and enter your ID number");
    //   return;
    // }

    // setVerifyingId(true);
    // setVerificationError("");
    
    // try {
    //   let verificationData;
    //   
    //   if (agentData.idType === "bvn") {
    //     verificationData = await verifyBvn(agentData.bvnOrNin);
    //   } else if (agentData.idType === "nin") {
    //     verificationData = await verifyNin(agentData.bvnOrNin);
    //   }
    //   
    //   if (verificationData.status === "success") {
    //     setIdDetails(verificationData.data);
    //     
    //     // Auto-fill form with verified details
    //     handleInputChange("fullName", `${verificationData.data.firstName} ${verificationData.data.middleName} ${verificationData.data.lastName}`);
    //     handleInputChange("dateOfBirth", verificationData.data.dateOfBirth);
    //     handleInputChange("gender", verificationData.data.gender);
    //     handleInputChange("phoneNumber", verificationData.data.phoneNumber);
    //     handleInputChange("residentialAddress", verificationData.data.residentialAddress);
    //     
    //     setIdVerified(true);
    //     Alert.alert("Success", "Your identity has been verified successfully");
    //   } else {
    //     setVerificationError("The ID verification failed. Please check your details and try again.");
    //     Alert.alert("Verification Failed", "The ID verification failed. Please check your details and try again.");
    //   }
    // } catch (error) {
    //   setVerificationError(error.message || "Verification service is temporarily unavailable");
    //   Alert.alert("Error", error.message || "Verification service is temporarily unavailable");
    // } finally {
    //   setVerifyingId(false);
    // }
  };

  // DISABLED FOR NOW - Bank account verification (will be implemented later)
  const verifyBankAccountWithService = async () => {
    Alert.alert("Info", "Bank verification is temporarily disabled. You can proceed with registration.");
    return;

    // This will be re-enabled when backend verification APIs are ready
    // if (!agentData.bankName || !agentData.accountNumber) {
    //   Alert.alert("Error", "Please select a bank and enter account number");
    //   return;
    // }

    // setVerifyingAccount(true);
    
    // try {
    //   const bankCode = getBankCode(agentData.bankName);
    //   if (!bankCode || bankCode === "999") {
    //     throw new Error("Could not identify bank code. Please try another bank.");
    //   }
    //   
    //   const verificationData = await verifyBankAccount(bankCode, agentData.accountNumber);
    //   
    //   if (verificationData.status) {
    //     handleInputChange("accountName", verificationData.data.account_name);
    //     setAccountVerified(true);
    //     Alert.alert("Success", "Bank account verified successfully");
    //   } else {
    //     throw new Error(verificationData.message || "Could not verify bank account");
    //   }
    // } catch (error) {
    //   Alert.alert("Error", error.message || "Could not verify bank account. Please check your details");
    // } finally {
    //   setVerifyingAccount(false);
    // }
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!agentData.fullName || !agentData.email || !agentData.phoneNumber || !accountType) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!agentData.termsAgreed || !agentData.infoAccurate || !agentData.verificationConsent) {
      Alert.alert("Error", "Please agree to all terms and conditions");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const submissionData = {
        fullName: agentData.fullName,
        email: agentData.email,
        phoneNumber: agentData.phoneNumber,
        password: agentData.password || "defaultPassword123", // Add default password if not set
        accountType: accountType,
        dateOfBirth: agentData.dateOfBirth,
        gender: agentData.gender,
        residentialAddress: agentData.residentialAddress,
        idType: agentData.idType,
        bvnOrNin: agentData.bvnOrNin,
        businessName: agentData.businessName,
        businessAddress: agentData.businessAddress,
        businessType: agentData.businessType,
        bankName: agentData.bankName,
        accountName: agentData.accountName,
        accountNumber: agentData.accountNumber,
        guarantorName: agentData.guarantorName,
        guarantorRelationship: agentData.guarantorRelationship,
        guarantorPhone: agentData.guarantorPhone,
        guarantorAddress: agentData.guarantorAddress,
        pin: agentData.pin,
        termsAgreed: agentData.termsAgreed,
        infoAccurate: agentData.infoAccurate,
        verificationConsent: agentData.verificationConsent,
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting to:', `${API_BASE_URL}/auth/signup`);
      console.log('Data:', JSON.stringify(submissionData, null, 2));
      
      // Submit to backend
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        setVerificationSent(true);
        Alert.alert("Success", "Registration successful! Please check your email for verification code.");
      } else {
        throw new Error(responseData.message || responseData.error || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert("Error", error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return accountType !== "";
      case 2:
        return agentData.fullName && agentData.dateOfBirth && agentData.gender && 
               agentData.phoneNumber && agentData.email && agentData.residentialAddress &&
               agentData.bvnOrNin && agentData.password; // Removed ID verification requirement
      case 3:
        return agentData.businessName && agentData.businessAddress && agentData.businessType;
      case 4:
        return agentData.bankName && agentData.accountNumber && 
               agentData.guarantorName && agentData.guarantorPhone &&
               agentData.pin && agentData.pin === agentData.confirmPin && agentData.pin.length === 4;
      case 5:
        return agentData.termsAgreed && agentData.infoAccurate && agentData.verificationConsent;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <AccountTypeSelection 
                 accountType={accountType} 
                 setAccountType={setAccountType} 
               />;
      case 2:
        return <PersonalInfo 
                 data={agentData} 
                 handleInputChange={handleInputChange}
                 verifyingId={verifyingId}
                 idVerified={idVerified}
                 verifyId={verifyId}
                 verificationError={verificationError}
               />;
      case 3:
        return <BusinessInfo 
                 data={agentData} 
                 handleInputChange={handleInputChange} 
               />;
      case 4:
        return <FinancialInfo 
                 data={agentData} 
                 handleInputChange={handleInputChange}
                 nigerianBanks={nigerianBanks}
                 verifyingAccount={verifyingAccount}
                 verifyBankAccount={verifyBankAccountWithService}
                 accountVerified={accountVerified}
                 securityQuestionsList={securityQuestionsList}
               />;
      case 5:
        return <Agreements 
                 data={agentData} 
                 handleInputChange={handleInputChange} 
               />;
      default:
        return <AccountTypeSelection 
                 accountType={accountType} 
                 setAccountType={setAccountType} 
               />;
    }
  };

  if (verificationSent) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6">
        <Text className="text-2xl font-bold text-green-600 mb-4">Verification Email Sent!</Text>
        <Text className="text-lg text-gray-700 text-center mb-6">
          A 6-digit verification code has been sent to your email address. 
          Please check your inbox and enter the code to complete your registration.
                </Text>
              <TouchableOpacity
          className="bg-orange-600 py-4 px-8 rounded-lg"
          onPress={() => router.push({ pathname: "/verify", params: { email: agentData.email } })}
        >
          <Text className="text-white font-medium text-center">
            Enter Verification Code
          </Text>
        </TouchableOpacity>


      </View>
    );
  }

  return (
    <View className="flex-1 bg-white justify-center">
      {/* Header with logo */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Create Account</Text>
        <View className="w-8" />
      </View>
      
      {/* Progress Bar */}
      <View className="flex-row px-6 pb-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <View 
            key={step}
            className={`flex-1 h-1 mx-1 rounded-full ${
              step <= currentStep ? "bg-orange-600" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
      
      <ScrollView 
        className="flex-1 px-6 pt-2" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Form Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <View className="flex-row justify-between mt-8 mb-10">
          <TouchableOpacity
            className={`py-4 px-6 rounded-lg ${currentStep === 1 ? "opacity-0" : "bg-gray-100"}`}
            onPress={handlePrevStep}
            disabled={currentStep === 1}
          >
            <Text className="text-gray-700 font-medium">Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`py-4 px-8 rounded-lg ${isStepValid() ? "bg-orange-600" : "bg-gray-300"}`}
            onPress={handleNextStep}
            disabled={!isStepValid() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium">
                {currentStep === 5 ? "Submit" : "Continue"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Implementation Note Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-5/6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Implementation Note</Text>
            <Text className="text-gray-700 mb-4">
              In a production environment, this would integrate with:
            </Text>
            <Text className="text-gray-700 mb-2">• Nigeria's NIBSS API for BVN verification</Text>
            <Text className="text-gray-700 mb-2">• NIMC's verification service for NIN</Text>
            <Text className="text-gray-700 mb-4">• Paystack or Flutterwave for bank account verification</Text>
            <Text className="text-gray-700 mb-4">
              For demonstration purposes, we're using mock verification services.
            </Text>
            <TouchableOpacity
              className="bg-orange-600 py-3 rounded-lg mt-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-medium text-center">I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Step 1 Component
function AccountTypeSelection({ accountType, setAccountType }) {
  const accountTypes = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "business", label: "Business", icon: "🏢" },
    { id: "enterprise", label: "Enterprise", icon: "🏭" },
    { id: "company", label: "Company", icon: "🏛️" },
    { id: "agent", label: "Agent", icon: "🤝", highlighted: true },
  ];

  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        Select account type
      </Text>
      <Text className="text-gray-500 text-sm mb-6">
        Choose the type of account you want to create
      </Text>
      
      <View className="space-y-3">
        {accountTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`p-4 rounded-xl border ${
              accountType === type.id 
                ? "border-orange-600 bg-orange-50" 
                : "border-gray-200 bg-white"
            } ${type.highlighted ? "border-green-500" : ""} flex-row items-center`}
            onPress={() => setAccountType(type.id)}
          >
            <Text className="text-2xl mr-3">{type.icon}</Text>
            <Text className={`font-medium flex-1 ${
              accountType === type.id ? "text-orange-600" : "text-gray-700"
            }`}>
              {type.label}
            </Text>
            {accountType === type.id && (
              <Text className="text-orange-600">✓</Text>
            )}
            {type.highlighted && !(accountType === type.id) && (
              <Text className="text-green-500 text-xs bg-green-100 px-2 py-1 rounded-full">
                Recommended
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Step 2 Component
function PersonalInfo({ data, handleInputChange, verifyingId, idVerified, verifyId, verificationError }) {
  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Personal Information</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Enter your personal details as they appear on your ID
      </Text>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Full Name *</Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#9CA3AF"
          value={data.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Email Address *</Text>
        <TextInput
          placeholder="Enter email address"
          placeholderTextColor="#9CA3AF"
          value={data.email}
          onChangeText={(text) => handleInputChange("email", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Password *</Text>
        <TextInput
          placeholder="Enter password (min 6 characters)"
          placeholderTextColor="#9CA3AF"
          value={data.password}
          onChangeText={(text) => handleInputChange("password", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          secureTextEntry
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Date of Birth *</Text>
        <TextInput
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#9CA3AF"
          value={data.dateOfBirth}
          onChangeText={(text) => handleInputChange("dateOfBirth", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Gender *</Text>
        <View className="flex-row space-x-3">
          {["Male", "Female", "Other"].map((gender) => (
            <TouchableOpacity
              key={gender}
              className={`flex-1 px-4 py-3 rounded-lg ${
                data.gender === gender ? "bg-orange-600" : "bg-gray-100"
              }`}
              onPress={() => handleInputChange("gender", gender)}
            >
              <Text className={`text-center font-medium ${
                data.gender === gender ? "text-white" : "text-gray-700"
              }`}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Phone Number (WhatsApp-enabled) *</Text>
        <TextInput
          placeholder="Enter phone number"
          placeholderTextColor="#9CA3AF"
          value={data.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          keyboardType="phone-pad"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Residential Address *</Text>
        <TextInput
          placeholder="Enter full address"
          placeholderTextColor="#9CA3AF"
          value={data.residentialAddress}
          onChangeText={(text) => handleInputChange("residentialAddress", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          multiline
        />
      </View>

      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">ID Type *</Text>
        <View className="flex-row space-x-3">
          {["BVN", "NIN"].map((type) => (
            <TouchableOpacity
              key={type}
              className={`flex-1 px-4 py-3 rounded-lg ${
                data.idType === type.toLowerCase() ? "bg-orange-600" : "bg-gray-100"
              }`}
              onPress={() => handleInputChange("idType", type.toLowerCase())}
            >
              <Text className={`text-center font-medium ${
                data.idType === type.toLowerCase() ? "text-white" : "text-gray-700"
              }`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">BVN or NIN Number *</Text>
        <View className="flex-row space-x-3">
          <TextInput
            placeholder="Enter BVN or NIN"
            placeholderTextColor="#9CA3AF"
            value={data.bvnOrNin}
            onChangeText={(text) => handleInputChange("bvnOrNin", text)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            keyboardType="numeric"
          />
          <TouchableOpacity
            className="px-4 py-3 rounded-lg bg-gray-400"
            disabled={true}
          >
            <Text className="text-white font-medium">Verify Later</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-blue-600 text-sm mt-2">
          ℹ️ ID verification is temporarily disabled. You can proceed with registration.
        </Text>
      </View>
    </View>
  );
}

// Step 3 Component
function BusinessInfo({ data, handleInputChange }) {
  const businessTypes = ["Kiosk", "Store", "Office", "Other"];
  
  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Business Information</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Tell us about your business
      </Text>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Shop/Business Name *</Text>
        <TextInput
          placeholder="Enter business name"
          placeholderTextColor="#9CA3AF"
          value={data.businessName}
          onChangeText={(text) => handleInputChange("businessName", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Shop/Business Address *</Text>
        <TextInput
          placeholder="Enter business address with landmark"
          placeholderTextColor="#9CA3AF"
          value={data.businessAddress}
          onChangeText={(text) => handleInputChange("businessAddress", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          multiline
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Type of Business *</Text>
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {businessTypes.map((type) => (
            <TouchableOpacity
              key={type}
              className={`px-4 py-2 rounded-lg ${
                data.businessType === type ? "bg-orange-600" : "bg-gray-100"
              }`}
              onPress={() => handleInputChange("businessType", type)}
            >
              <Text className={data.businessType === type ? "text-white" : "text-gray-700"}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Upload Documents (Optional)</Text>
        <Text className="text-gray-500 text-xs mb-4">
          Government ID, Utility Bill, Passport Photo, etc.
        </Text>
        
        <View className="flex-row justify-between">
          {["ID Document", "Utility Bill", "Passport Photo"].map((doc) => (
            <TouchableOpacity
              key={doc}
              className="items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-3"
              style={{ width: "30%" }}
            >
              <Text className="text-2xl text-gray-400">+</Text>
              <Text className="text-xs text-gray-500 mt-1 text-center">{doc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Step 4 Component
function FinancialInfo({ 
  data, 
  handleInputChange, 
  nigerianBanks, 
  verifyingAccount, 
  verifyBankAccount, 
  accountVerified,
  securityQuestionsList 
}) {
  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Financial Details</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Provide your bank account information for settlements
      </Text>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Preferred Settlement Bank *</Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={data.bankName}
            onValueChange={(value) => handleInputChange("bankName", value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select your bank" value="" />
            {nigerianBanks.map((bank) => (
              <Picker.Item key={bank} label={bank} value={bank} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Account Number *</Text>
        <View className="flex-row space-x-3">
          <TextInput
            placeholder="Enter account number"
            placeholderTextColor="#9CA3AF"
            value={data.accountNumber}
            onChangeText={(text) => handleInputChange("accountNumber", text)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            keyboardType="numeric"
            maxLength={10}
          />
          <TouchableOpacity
            className="px-4 py-3 rounded-lg bg-gray-400"
            disabled={true}
          >
            <Text className="text-white font-medium">Verify Later</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-blue-600 text-sm mt-2">
          ℹ️ Bank verification is temporarily disabled. You can proceed with registration.
        </Text>
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Account Name *</Text>
        <TextInput
          placeholder="Enter account holder name (as it appears on bank statement)"
          placeholderTextColor="#9CA3AF"
          value={data.accountName}
          onChangeText={(text) => handleInputChange("accountName", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
      </View>
      
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Security PIN</Text>
        <Text className="text-gray-500 text-sm mb-4">
          Create a 4-digit PIN for transaction security
        </Text>
        
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="text-gray-700 text-sm mb-2 font-medium">PIN *</Text>
            <TextInput
              placeholder="Enter 4-digit PIN"
              placeholderTextColor="#9CA3AF"
              value={data.pin}
              onChangeText={(text) => handleInputChange("pin", text)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 text-sm mb-2 font-medium">Confirm PIN *</Text>
            <TextInput
              placeholder="Confirm PIN"
              placeholderTextColor="#9CA3AF"
              value={data.confirmPin}
              onChangeText={(text) => handleInputChange("confirmPin", text)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>
        {data.pin && data.confirmPin && data.pin !== data.confirmPin && (
          <Text className="text-red-600 text-sm mt-2">PINs do not match</Text>
        )}
      </View>
      
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Guarantor Information</Text>
        <Text className="text-gray-500 text-sm mb-4">
          Provide details of someone who can guarantee your account
        </Text>
        
        <View>
          <Text className="text-gray-700 text-sm mb-2 font-medium">Full Name *</Text>
          <TextInput
            placeholder="Enter guarantor's full name"
            placeholderTextColor="#9CA3AF"
            value={data.guarantorName}
            onChangeText={(text) => handleInputChange("guarantorName", text)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-700 text-sm mb-2 font-medium">Relationship</Text>
          <TextInput
            placeholder="e.g., Brother, Friend, Colleague"
            placeholderTextColor="#9CA3AF"
            value={data.guarantorRelationship}
            onChangeText={(text) => handleInputChange("guarantorRelationship", text)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-700 text-sm mb-2 font-medium">Phone Number *</Text>
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            value={data.guarantorPhone}
            onChangeText={(text) => handleInputChange("guarantorPhone", text)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            keyboardType="phone-pad"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-700 text-sm mb-2 font-medium">Address</Text>
          <TextInput
            placeholder="Enter address"
            placeholderTextColor="#9CA3AF"
            value={data.guarantorAddress}
            onChangeText={(text) => handleInputChange("guarantorAddress", text)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            multiline
            style={{ minHeight: 80 }}
          />
        </View>
      </View>
    </View>
  );
}

// Step 5 Component
function Agreements({ data, handleInputChange }) {
  const agreements = [
    {
      id: "infoAccurate",
      label: "I confirm that all information provided is accurate and complete."
    },
    {
      id: "termsAgreed",
      label: "I agree to AmaPay's Agent Terms & Conditions and Privacy Policy."
    },
    {
      id: "verificationConsent",
      label: "I consent to AmaPay verifying my information with third-party databases (BVN, NIN, Bank records)."
    }
  ];
  
  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Declaration & Agreement</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Please read and agree to the following terms to complete your registration
      </Text>
      
      <View className="space-y-4">
        {agreements.map((agreement) => (
          <TouchableOpacity
            key={agreement.id}
            className="flex-row items-start"
            onPress={() => handleInputChange(agreement.id, !data[agreement.id])}
          >
            <View className={`w-6 h-6 rounded-md border-2 mr-3 mt-1 items-center justify-center ${
              data[agreement.id] ? "bg-orange-600 border-orange-600" : "border-gray-400"
            }`}>
              {data[agreement.id] && <Text className="text-white text-base">✓</Text>}
            </View>
            <Text className="text-gray-700 flex-1 text-sm leading-5">{agreement.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View className="mt-6 p-4 bg-orange-50 rounded-xl">
        <Text className="text-orange-800 font-medium mb-2">📋 Next Steps</Text>
        <Text className="text-orange-700 text-sm mb-2">
          After submission:
        </Text>
        <Text className="text-orange-700 text-sm mb-1">• Email verification code will be sent</Text>
        <Text className="text-orange-700 text-sm mb-1">• Document review within 24-48 hours</Text>
        <Text className="text-orange-700 text-sm">• SMS/Email updates on verification status</Text>
      </View>

      <View className="mt-4 p-4 bg-blue-50 rounded-xl">
        <Text className="text-blue-800 font-medium mb-2">🔒 Data Security</Text>
        <Text className="text-blue-700 text-sm">
          Your personal and financial information is encrypted and protected according to 
          industry standards. We do not share your data with unauthorized third parties.
        </Text>
      </View>

      <View className="mt-4 p-4 bg-yellow-50 rounded-xl">
        <Text className="text-yellow-800 font-medium mb-2">⚠️ Verification Notice</Text>
        <Text className="text-yellow-700 text-sm">
          ID and bank account verification features are temporarily disabled for development. 
          These will be enabled when the verification APIs are integrated.
        </Text>
      </View>
    </View>
  );
}