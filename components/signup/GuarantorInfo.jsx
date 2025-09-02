import React from "react";
import { View, Text, TextInput } from "react-native";

export default function GuarantorInfo({ data, handleInputChange }) {
  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Guarantor Information</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Provide details of your guarantor for verification
      </Text>

      {/* Guarantor Name */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Guarantor Name *</Text>
        <TextInput
          placeholder="Enter guarantor full name"
          placeholderTextColor="#9CA3AF"
          value={data.guarantorName}
          onChangeText={(text) => handleInputChange("guarantorName", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
      </View>

      {/* Guarantor Phone */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Guarantor Phone *</Text>
        <TextInput
          placeholder="Enter guarantor phone"
          placeholderTextColor="#9CA3AF"
          value={data.guarantorPhone}
          onChangeText={(text) => handleInputChange("guarantorPhone", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          keyboardType="phone-pad"
        />
      </View>

      {/* Guarantor Address */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Guarantor Address *</Text>
        <TextInput
          placeholder="Enter guarantor address"
          placeholderTextColor="#9CA3AF"
          value={data.guarantorAddress}
          onChangeText={(text) => handleInputChange("guarantorAddress", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          multiline
        />
      </View>
    </View>
  );
}
