import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-black items-center justify-center px-8">
      {/* Main Logo - Large AP with gradient */}
      <View className="items-center mb-6">
        <LinearGradient
          colors={["#FFFFFF", "#FFE4D1", "#FFA559"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
        >
          <Text 
            className="text-black font-black"
            style={{
              fontSize: 200,
              lineHeight: 200,
              textShadowColor: 'rgba(0,0,0,0.3)',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4,
            }}
          >
            AP
          </Text>
        </LinearGradient>
      </View>

      {/* Brand name and QR code container */}
      <View className="items-center mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-white text-4xl font-bold mr-3">AmstaPay</Text>
          <View 
            className="bg-white rounded-lg p-2"
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* QR Code placeholder - replace with actual QR if needed */}
            <View className="w-6 h-6 bg-black rounded-sm">
              <View className="absolute inset-1">
                <View className="flex-row justify-between">
                  <View className="w-1 h-1 bg-white rounded-full" />
                  <View className="w-1 h-1 bg-white rounded-full" />
                </View>
                <View className="flex-row justify-between mt-1">
                  <View className="w-1 h-1 bg-white rounded-full" />
                  <View className="w-1 h-1 bg-white rounded-full" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Tagline */}
      <Text className="text-gray-300 text-lg text-center font-medium tracking-wide">
        No Cash. No Fear. Just Snap & Go!
      </Text>
    </View>
  );
}