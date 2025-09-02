
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function FinancialInfo({ data, handleInputChange }) {
  const [errors, setErrors] = useState({});

  // List of Nigerian banks including microfinance banks
  const nigerianBanks = [
    "Access Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Globus Bank",
    "Guaranty Trust Bank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Titan Trust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    // Microfinance banks
    "Accion Microfinance Bank",
    "Fortis Microfinance Bank",
    "LAPO Microfinance Bank",
    "Mainstreet Microfinance Bank",
    "VFD Microfinance Bank",
  ];

  // Validate input fields in real-time
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (["bankName", "accountNumber"].includes(field)) {
      newErrors[field] = value.trim() ? "" : `${field} is required`;
    }
    if (field === "accountNumber" && value.trim() && !/^\d{10}$/.test(value)) {
      newErrors[field] = "Account number must be 10 digits";
    }
    setErrors(newErrors);
  };

  // Handle input changes with validation
  const handleChange = (field, value) => {
    handleInputChange(field, value);
    validateField(field, value);

    // Auto-populate accountName based on fullName for now
    if (field === "accountNumber" && value.trim().length === 10) {
      handleInputChange("accountName", data.fullName || "Account Holder");
      // FUTURE IMPLEMENTATION: Paystack bank account verification
      /*
      const verifyBankAccount = async (bankName, accountNumber) => {
        try {
          const bankCode = getBankCode(bankName); // Map bank name to bank code
          const response = await fetch("https://api.paystack.co/bank/resolve", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              account_number: accountNumber,
              bank_code: bankCode,
            }),
          });
          const result = await response.json();
          if (result.status) {
            handleInputChange("accountName", result.data.account_name);
            Alert.alert("Success", "Bank account verified successfully");
          } else {
            throw new Error(result.message || "Could not verify bank account");
          }
        } catch (error) {
          console.error("Bank verification error:", error);
          Alert.alert("Error", "Bank verification failed. Please check your details.");
        }
      };
      verifyBankAccount(data.bankName, value);
      */
    }
  };

  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Financial Information</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Provide your financial details for transactions
      </Text>

      {/* Bank Name */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Preferred Settlement Bank *</Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={data.bankName}
            onValueChange={(value) => handleChange("bankName", value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select your bank" value="" />
            {nigerianBanks.map((bank) => (
              <Picker.Item key={bank} label={bank} value={bank} />
            ))}
          </Picker>
        </View>
        {errors.bankName && <Text className="text-red-500 text-sm mt-1">{errors.bankName}</Text>}
      </View>

      {/* Account Number */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Account Number *</Text>
        <TextInput
          placeholder="Enter 10-digit account number"
          placeholderTextColor="#9CA3AF"
          value={data.accountNumber}
          onChangeText={(text) => handleChange("accountNumber", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.accountNumber && (
          <Text className="text-red-500 text-sm mt-1">{errors.accountNumber}</Text>
        )}
      </View>

      {/* Account Name */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Account Name *</Text>
        <TextInput
          placeholder="Account holder name"
          placeholderTextColor="#9CA3AF"
          value={data.accountName}
          editable={false} // Read-only for now
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-100"
        />
        <Text className="text-blue-600 text-sm mt-2">
          ℹ️ Bank verification is temporarily disabled. Account name is auto-filled from your details.
        </Text>
      </View>
    </View>
  );
}
