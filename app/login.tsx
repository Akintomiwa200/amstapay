import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert("Error", "Please enter both fields");
      return;
    }
    try {
      setLoading(true);
      await login(emailOrPhone, password);
      router.replace("/dashboard"); // 🎉 Successful login → dashboard
    } catch (error: any) {
      Alert.alert("Login failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View className="mb-2">
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

        {/* Forgot Password Link */}
        <TouchableOpacity
          className="self-end mt-2"
          onPress={() => router.push("/forgot-password")}
        >
          <Text className="text-orange-500 text-sm font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        disabled={loading}
        className="bg-orange-500 py-4 rounded-lg items-center mb-6"
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-semibold">Log In</Text>
        )}
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
