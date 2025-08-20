import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // TODO: Add validation/authentication
    router.push("/dashboard");
  };

  return (
    <View className="flex-1 bg-white px-8 justify-center">
      {/* Logo */}
      <View className="items-center mb-12">
        <View className="bg-orange-500 w-20 h-20 rounded-2xl items-center justify-center mb-3">
          <Text className="text-white text-3xl font-bold">A</Text>
        </View>
        <Text className="text-2xl font-semibold text-black">AmstaPay</Text>
      </View>

      {/* Form */}
      <View className="mb-8">
        {/* Email or phone */}
        <View className="mb-8">
          <Text className="text-gray-700 text-sm mb-2">Email or phone</Text>
          <TextInput
            placeholder="Enter email or phone"
            placeholderTextColor="#999"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            className="border-b border-gray-300 text-base py-3 text-black"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View className="mb-8">
          <Text className="text-gray-700 text-sm mb-2">Password</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="border-b border-gray-300 text-base py-3 text-black"
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-orange-500 py-4 rounded-lg items-center mb-6"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-semibold">Log In</Text>
      </TouchableOpacity>

     

      {/* Signup Link */}
      <TouchableOpacity
        className="items-center mt-16"
        onPress={() => router.push("/signup")}
      >
        <Text className="text-black text-sm">
          Don’t have an account?{" "}
          <Text className="text-orange-500 font-semibold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
