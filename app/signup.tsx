



import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";

// Import step components
import PersonalInfo from "../components/signup/PersonalInfo";
import BusinessInfo from "../components/signup/BusinessInfo";
import FinancialInfo from "../components/signup/FinancialInfo";
import GuarantorInfo from "../components/signup/GuarantorInfo";
import Agreements from "../components/signup/Agreements";
import AccountTypeSelection from "../components/signup/AccountTypeSelection";
import Security from "../components/signup/Security";

// API base
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function SignupScreen() {
  const router = useRouter();

  const [accountType, setAccountType] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    // Personal
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    password: "",
    residentialAddress: "",
    // ID
    idType: "",
    bvnOrNin: "",
    idDocument: null,
    utilityBill: null,
    passportPhoto: null,
    // Business
    businessName: "",
    businessAddress: "",
    businessType: "",
    // Financial
    bankName: "",
    accountName: "",
    accountNumber: "",
    // Guarantor
    guarantorName: "",
    guarantorRelationship: "",
    guarantorPhone: "",
    guarantorAddress: "",
    // Security
    pin: "",
    confirmPin: "",
    selectedQuestions: ["", ""], 
    securityQuestions: ["", ""],
    // Agreements
    termsAgreed: false,
    infoAccurate: false,
    verificationConsent: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Steps by type
  const stepsByAccountType = {
    personal: ["AccountTypeSelection", "PersonalInfo", "FinancialInfo", "Security", "Agreements"],
    agent: [
      "AccountTypeSelection",
      "PersonalInfo",
      "FinancialInfo",
      "GuarantorInfo",
      "Security",
      "Agreements",
    ],
    business: [
      "AccountTypeSelection",
      "PersonalInfo",
      "BusinessInfo",
      "FinancialInfo",
      "Security",
      "Agreements",
    ],
    enterprise: [
      "AccountTypeSelection",
      "PersonalInfo",
      "BusinessInfo",
      "FinancialInfo",
      "Security",
      "Agreements",
    ],
    company: [
      "AccountTypeSelection",
      "PersonalInfo",
      "BusinessInfo",
      "FinancialInfo",
      "Security",
      "Agreements",
    ],
  };

  const steps = stepsByAccountType[accountType] || [];
  const currentStep = steps[currentStepIndex];

  // Validate current step
  const isStepValid = () => {
    switch (currentStep) {
      case "AccountTypeSelection":
        return accountType !== "";
      case "PersonalInfo":
        return (
          formData.fullName &&
          formData.dateOfBirth &&
          formData.gender &&
          formData.phoneNumber &&
          formData.email &&
          formData.residentialAddress &&
          formData.bvnOrNin &&
          formData.password
        );
      case "BusinessInfo":
        return (
          !["business", "enterprise", "company"].includes(accountType) ||
          (formData.businessName && formData.businessAddress && formData.businessType)
        );
      case "FinancialInfo":
        return formData.bankName && formData.accountNumber && formData.accountName;
      case "GuarantorInfo":
        return (
          accountType !== "agent" ||
          (formData.guarantorName && formData.guarantorPhone)
        );
      case "Security":
        return (
          formData.pin &&
          formData.confirmPin &&
          formData.pin === formData.confirmPin &&
          formData.pin.length === 4 &&
          formData.securityQuestions.every((q) => q.trim() !== "")
        );
      case "Agreements":
        return formData.termsAgreed && formData.infoAccurate && formData.verificationConsent;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    try {
      if (!isStepValid()) {
        Alert.alert("Error", "Please complete all required fields in this step");
        return;
      }
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } catch (err) {
      console.error("Navigation error:", err);
      Alert.alert("Error", "Failed to proceed to the next step");
    }
  };

  const handlePrevStep = () => {
    try {
      if (currentStepIndex > 0) {
        setCurrentStepIndex((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Navigation error:", err);
      Alert.alert("Error", "Failed to go back");
    }
  };

 // Submit to backend
const handleSubmit = async () => {
  // Required field checks
  const requiredFields = [
    "fullName",
    "email",
    "phoneNumber",
    "termsAgreed",
    "infoAccurate",
    "verificationConsent",
    "password",
    "pin",
    "confirmPin",
  ];

  if (["business", "enterprise", "company"].includes(accountType)) {
    requiredFields.push("businessName", "businessAddress", "businessType");
  }

  if (accountType === "agent") {
    requiredFields.push("guarantorName", "guarantorPhone");
  }

  // Check for missing fields in formData
  let missingFields = requiredFields.filter((field) => !formData[field]);

  // Check accountType separately (since it's outside formData)
  if (!accountType) {
    missingFields.push("accountType");
  }

  if (missingFields.length > 0) {
    Alert.alert(
      "Error",
      `Please fill in the following fields:\n\n${missingFields.join(", ")}`
    );
    return;
  }

  // Additional validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    Alert.alert("Error", "Invalid email format");
    return;
  }

  if (formData.password.length < 6) {
    Alert.alert("Error", "Password must be at least 6 characters");
    return;
  }

  if (formData.pin !== formData.confirmPin || formData.pin.length !== 4) {
    Alert.alert("Error", "PINs must match and be 4 digits");
    return;
  }

  setIsSubmitting(true);
  try {
    const payload = {
      ...formData,
      accountType,
      idDocument: formData.idDocument ? formData.idDocument.base64 : null,
      utilityBill: formData.utilityBill ? formData.utilityBill.base64 : null,
      passportPhoto: formData.passportPhoto ? formData.passportPhoto.base64 : null,
      timestamp: new Date().toISOString(),
    };

    console.log("Submitting to:", `${API_BASE_URL}/auth/signup`);
    console.log("Data:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      setVerificationSent(true);
      Alert.alert(
        "Success",
        "Registration successful! Check your email for verification code."
      );
    } else {
      const errorMessage =
        {
          400: "Invalid input data",
          401: "Unauthorized request",
          409: "Account already exists",
          500: "Server error, please try again later",
        }[response.status] || data.message || data.error || "Signup failed";
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("Signup error:", err);
    Alert.alert("Error", err.message || "Registration failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const renderStep = () => {
    switch (currentStep) {
      case "AccountTypeSelection":
        return <AccountTypeSelection accountType={accountType} setAccountType={setAccountType} />;
      case "PersonalInfo":
        return <PersonalInfo data={formData} handleInputChange={handleInputChange} />;
      case "BusinessInfo":
        return <BusinessInfo data={formData} handleInputChange={handleInputChange} />;
      case "FinancialInfo":
        return <FinancialInfo data={formData} handleInputChange={handleInputChange} />;
      case "GuarantorInfo":
        return <GuarantorInfo data={formData} handleInputChange={handleInputChange} />;
      case "Security":
        return <Security data={formData} handleInputChange={handleInputChange} />;
      case "Agreements":
        return <Agreements data={formData} handleInputChange={handleInputChange} />;
      default:
        return (
          <AccountTypeSelection accountType={accountType} setAccountType={setAccountType} />
        );
    }
  };

  // Success screen
  if (verificationSent) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6">
        <Text className="text-2xl font-bold text-green-600 mb-4">Verification Sent!</Text>
        <Text className="text-lg text-gray-700 text-center mb-6">
          A 6-digit verification code has been sent to your email. Enter it to activate your
          account.
        </Text>
        <TouchableOpacity
          className="bg-orange-600 py-4 px-8 rounded-lg"
          onPress={() => router.push({ pathname: "/verify", params: { email: formData.email } })}
        >
          <Text className="text-white font-medium text-center">Enter Code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Create Account</Text>
        <View className="w-8" />
      </View>

      {/* Progress bar */}
      <View className="flex-row px-6 pb-4">
        {steps.map((step, idx) => (
          <View
            key={step}
            className={`flex-1 h-1 mx-1 rounded-full ${
              idx <= currentStepIndex ? "bg-orange-600" : "bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Form content */}
      <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 30 }}>
        {renderStep()}

        {/* Nav buttons */}
        {steps.length > 0 && (
          <View className="flex-row justify-between mt-8 mb-10">
            <TouchableOpacity
              className={`py-4 px-6 rounded-lg ${
                currentStepIndex === 0 ? "opacity-0" : "bg-gray-100"
              }`}
              onPress={handlePrevStep}
              disabled={currentStepIndex === 0}
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
                  {currentStepIndex === steps.length - 1 ? "Submit" : "Continue"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal for notes */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-5/6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Implementation Note</Text>
            <Text className="text-gray-700 mb-2">• NIBSS API for BVN verification</Text>
            <Text className="text-gray-700 mb-2">• NIMC for NIN verification</Text>
            <Text className="text-gray-700 mb-4">• Paystack/Flutterwave for bank verification</Text>
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