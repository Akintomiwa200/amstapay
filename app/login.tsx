import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Use router for navigation

  const handleLogin = () => {
    // Add validation or authentication logic here if needed
    router.push("/dashboard"); // Navigate to the dashboard
  };

  return (
    <View className="flex-1 bg-white px-8 justify-center">
      {/* Logo */}
      <View className="items-center mb-12">
        <View className="bg-green-700 w-20 h-20 rounded-2xl items-center justify-center mb-3">
          <Text className="text-white text-3xl font-bold">A</Text>
        </View>
        <Text className="text-2xl font-semibold text-gray-800">AmstaPay</Text>
      </View>

      {/* Form Container */}
      <View className="mb-8">
        {/* Email or phone */}
        <View className="mb-8">
          <Text className="text-gray-600 text-sm mb-2">Email or phone</Text>
          <TextInput
            placeholder=""
            placeholderTextColor="#888"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            className="border-b border-gray-300 text-base py-3 text-gray-800"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View className="mb-8">
          <Text className="text-gray-600 text-sm mb-2">Password</Text>
          <TextInput
            placeholder=""
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="border-b border-gray-300 text-base py-3 text-gray-800"
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-green-700 py-4 rounded-lg items-center mb-6"
        onPress={handleLogin} // Trigger navigation on press
      >
        <Text className="text-white text-lg font-semibold">Log In</Text>
      </TouchableOpacity>

      {/* Link */}
      <TouchableOpacity className="items-center">
        <Text className="text-gray-500 text-sm">
          Log in with either email or phone
        </Text>
      </TouchableOpacity>
    </View>
  );
}