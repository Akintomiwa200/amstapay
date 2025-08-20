import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VerificationPending() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="items-center mt-10 mb-8">
          <View className="bg-orange-500 w-20 h-20 rounded-2xl items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">A</Text>
          </View>
          <Text className="text-2xl font-semibold text-black">AmstaPay</Text>
        </View>

        {/* Main Content */}
        <View className="items-center mb-10">
          {/* Illustration */}
          <View className="mb-6">
            <View className="bg-orange-100 w-32 h-32 rounded-full items-center justify-center">
              <Text className="text-orange-500 text-5xl">✓</Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-black text-center mb-3">
            Application Submitted
          </Text>

          {/* Status */}
          <View className="bg-amber-100 px-4 py-2 rounded-full mb-6">
            <Text className="text-amber-800 font-medium">Status: Pending Verification</Text>
          </View>

          {/* Message */}
          <Text className="text-gray-600 text-center text-base leading-6 mb-8">
            Thank you for submitting your agent application. Your information is now being verified by our compliance team. This process typically takes 24-48 hours.
          </Text>

          {/* Process Steps */}
          <View className="w-full mb-8">
            <Text className="text-lg font-semibold text-black mb-4">What happens next?</Text>
            
            <View className="space-y-4">
              <View className="flex-row items-start">
                <View className="bg-orange-500 w-6 h-6 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white text-xs font-bold">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-black font-medium">BVN/NIN Verification</Text>
                  <Text className="text-gray-600 text-sm">System is verifying your identity details</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="bg-orange-500 w-6 h-6 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-black font-medium">Document Review</Text>
                  <Text className="text-gray-600 text-sm">Our team is reviewing your uploaded documents</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="bg-orange-500 w-6 h-6 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white text-xs font-bold">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-black font-medium">Final Approval</Text>
                  <Text className="text-gray-600 text-sm">Completing final checks before activation</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View className="w-full bg-blue-50 p-4 rounded-lg mb-8">
            <Text className="text-blue-800 font-medium mb-2">You'll receive notifications via:</Text>
            <View className="flex-row items-center mb-2">
              <Text className="text-blue-500 mr-2">📧</Text>
              <Text className="text-blue-700">{`Email: your.email@example.com`}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-blue-500 mr-2">📱</Text>
              <Text className="text-blue-700">{`SMS: +234 *** *** 1234`}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 pb-8 pt-4 border-t border-gray-200">
        <Text className="text-gray-500 text-center text-sm mb-4">
          Have questions? Contact support@amstapay.com
        </Text>
        
        <TouchableOpacity
          className="bg-gray-100 py-4 rounded-lg items-center"
          onPress={() => router.push("/dashboard")}
        >
          <Text className="text-gray-700 text-base font-medium">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}