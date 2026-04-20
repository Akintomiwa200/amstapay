// import { useRouter } from "expo-router";
// import React, { useEffect } from "react";
// import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
// import { useAuth } from "../context/AuthContext"; // adjust path if needed

// export default function IndexScreen() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         router.replace("/dashboard"); // user logged in -> go to dashboard
//       } else {
//         router.replace("/onboarding"); // not logged in -> go to onboarding
//       }
//     }
//   }, [loading, user, router]);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/splash.jpeg")} // adjust path
//         style={styles.image}
//         resizeMode="contain"
//       />
//       {loading && <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 20 }} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   image: {
//     width: 250,
//     height: 250,
//   },
// });





import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";

const { height } = Dimensions.get("window");

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [loading, user, router]);

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center">

      {/* Center Content */}
      <View className="items-center -mt-10">
        <Image
          source={require("../assets/images/splash.jpeg")}
          className="w-40 h-40 mb-5"
          resizeMode="contain"
        />

        <Text className="text-xl text-purple-900 text-center font-semibold">
          AmstaPay
        </Text>

        <Text className="text-sm text-gray-600 text-center mt-2 px-6">
          Scan. Pay. Transact seamlessly with Web3-powered banking.
        </Text>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#F97316"
            className="mt-6"
          />
        )}
      </View>

      {/* Bottom Gradient */}
      <LinearGradient
        colors={["#22f0c3", "#2db3ff", "#8b5cf6", "#ff3cac"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: height * 0.25,
        }}
      />
    </View>
  );
}