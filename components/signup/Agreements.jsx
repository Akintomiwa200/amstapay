// components/signup/Agreements.js
import React from "react";
import { View, Text, Switch } from "react-native";

export default function Agreements({ data, handleInputChange }) {
  return (
    <View className="space-y-6 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Agreements</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Please agree to the terms to continue
      </Text>

      {/* Terms & Conditions */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-gray-700 font-medium">
            I agree to AmaPay's Agent Terms & Conditions and Privacy Policy.
          </Text>
        </View>
        <Switch
          value={data.termsAgreed}
          onValueChange={(value) => handleInputChange("termsAgreed", value)}
        />
      </View>

      {/* Information Accuracy */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-gray-700 font-medium">
            I confirm that all information provided is accurate and complete.
          </Text>
        </View>
        <Switch
          value={data.infoAccurate}
          onValueChange={(value) => handleInputChange("infoAccurate", value)}
        />
      </View>

      {/* Verification Consent */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-gray-700 font-medium">
            I consent to AmaPay verifying my information with third-party
            databases (BVN, NIN, Bank records).
          </Text>
        </View>
        <Switch
          value={data.verificationConsent}
          onValueChange={(value) => handleInputChange("verificationConsent", value)}
        />
      </View>

      <View className="mt-6 p-4 bg-orange-50 rounded-xl">
        <Text className="text-orange-800 font-medium mb-2">📋 Next Steps</Text>
        <Text className="text-orange-700 text-sm mb-2">After submission:</Text>
        <Text className="text-orange-700 text-sm mb-1">
          • Email verification code will be sent
        </Text>
        <Text className="text-orange-700 text-sm mb-1">
          • Document review within 24-48 hours
        </Text>
        <Text className="text-orange-700 text-sm">
          • SMS/Email updates on verification status
        </Text>
      </View>

      <View className="mt-4 p-4 bg-blue-50 rounded-xl">
        <Text className="text-blue-800 font-medium mb-2">🔒 Data Security</Text>
        <Text className="text-blue-700 text-sm">
          Your personal and financial information is encrypted and protected
          according to industry standards. We do not share your data with
          unauthorized third parties.
        </Text>
      </View>

      <View className="mt-4 p-4 bg-yellow-50 rounded-xl">
        <Text className="text-yellow-800 font-medium mb-2">
          ⚠️ Verification Notice
        </Text>
        <Text className="text-yellow-700 text-sm">
          ID and bank account verification features are temporarily disabled for
          development. These will be enabled when the verification APIs are
          integrated.
        </Text>
      </View>
    </View>
  );
}
