// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { useAuth } from "../context/AuthContext";

// export default function LoginScreen() {
//   const [emailOrPhone, setEmailOrPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const router = useRouter();

//   const handleLogin = async () => {
//     if (!emailOrPhone || !password) {
//       Alert.alert("Error", "Please enter both fields");
//       return;
//     }
//     try {
//       setLoading(true);
//       await login(emailOrPhone, password);
//       router.replace("/dashboard"); // 🎉 Successful login → dashboard
//     } catch (error: any) {
//       Alert.alert("Login failed", error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-white px-8 justify-center">
//       {/* Logo */}
//       <View className="items-center mb-12">
//         <View className="bg-orange-500 w-20 h-20 rounded-2xl items-center justify-center mb-3">
//           <Text className="text-white text-3xl font-bold">A</Text>
//         </View>
//         <Text className="text-2xl font-semibold text-black">AmstaPay</Text>
//       </View>

//       {/* Form */}
//       <View className="mb-8">
//         {/* Email or phone */}
//         <View className="mb-8">
//           <Text className="text-gray-700 text-sm mb-2">Email or phone</Text>
//           <TextInput
//             placeholder="Enter email or phone"
//             placeholderTextColor="#999"
//             value={emailOrPhone}
//             onChangeText={setEmailOrPhone}
//             className="border-b border-gray-300 text-base py-3 text-black"
//             autoCapitalize="none"
//           />
//         </View>

//         {/* Password */}
//         <View className="mb-2">
//           <Text className="text-gray-700 text-sm mb-2">Password</Text>
//           <TextInput
//             placeholder="Enter password"
//             placeholderTextColor="#999"
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//             className="border-b border-gray-300 text-base py-3 text-black"
//           />
//         </View>

//         {/* Forgot Password Link */}
//         <TouchableOpacity
//           className="self-end mt-2"
//           onPress={() => router.push("/forgot-password")}
//         >
//           <Text className="text-orange-500 text-sm font-medium">
//             Forgot Password?
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Login Button */}
//       <TouchableOpacity
//         disabled={loading}
//         className="bg-orange-500 py-4 rounded-lg items-center mb-6"
//         onPress={handleLogin}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-white text-lg font-semibold">Log In</Text>
//         )}
//       </TouchableOpacity>

//       {/* Signup Link */}
//       <TouchableOpacity
//         className="items-center mt-16"
//         onPress={() => router.push("/signup")}
//       >
//         <Text className="text-black text-sm">
//           Don’t have an account?{" "}
//           <Text className="text-orange-500 font-semibold">Sign up</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }




import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Basic validation
    if (!emailOrPhone.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email/phone and password");
      return;
    }

    // Email validation (basic)
    const isEmail = emailOrPhone.includes("@");
    const isPhone = /^\d+$/.test(emailOrPhone.replace(/[\s\-\(\)]/g, ""));

    if (!isEmail && !isPhone) {
      Alert.alert("Error", "Please enter a valid email or phone number");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting login with:", emailOrPhone); // Debug log
      
      await login(emailOrPhone.trim(), password);
      
      console.log("Login successful, navigating to dashboard"); // Debug log
      router.replace("/dashboard"); // Updated path - make sure this matches your file structure
      
    } catch (error) {
      console.error("Login error:", error); // Debug log
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (errorMessage.toLowerCase().includes("invalid")) {
        errorMessage = "Invalid credentials. Please check your email/phone and password.";
      }
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Check if forgot password route exists
    try {
      router.push("/forgot-password");
    } catch (error) {
      Alert.alert("Info", "Forgot password feature coming soon!");
    }
  };

  const handleSignup = () => {
    try {
      router.push("/signup");
    } catch (error) {
      Alert.alert("Error", "Unable to navigate to signup page");
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white" 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-8 justify-center py-8">
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
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                editable={!loading}
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
                textContentType="password"
                autoComplete="password"
                editable={!loading}
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              className="self-end mt-2"
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text className="text-orange-500 text-sm font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            disabled={loading || !emailOrPhone.trim() || !password.trim()}
            className={`py-4 rounded-lg items-center mb-6 ${
              loading || !emailOrPhone.trim() || !password.trim()
                ? "bg-orange-300"
                : "bg-orange-500"
            }`}
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
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className="text-black text-sm">
              Don't have an account?{" "}
              <Text className="text-orange-500 font-semibold">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}