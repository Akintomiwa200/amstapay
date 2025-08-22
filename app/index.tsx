import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.jpeg")} // adjust path if needed
        style={styles.image}
        resizeMode="contain" // keeps aspect ratio
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",   // centers horizontally
    justifyContent: "center", // centers vertically
  },
  image: {
    width: 250,   // you can tweak size
    height: 250,
  },
});
