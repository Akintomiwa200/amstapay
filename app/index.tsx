import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard"); // user logged in -> go to dashboard
      } else {
        router.replace("/onboarding"); // not logged in -> go to onboarding
      }
    }
  }, [loading, user, router]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.jpeg")} // adjust path
        style={styles.image}
        resizeMode="contain"
      />
      {loading && <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
});
