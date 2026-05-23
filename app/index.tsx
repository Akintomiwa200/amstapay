import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  const progressAnim = useState(new Animated.Value(0))[0];

  const c = theme.colors;

  useEffect(() => {
    const timer = setTimeout(() => setMinimumTimePassed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minimumTimePassed && !loading) {
      router.replace(user ? "/dashboard" : "/onboarding");
    }
  }, [minimumTimePassed, loading, user]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "33%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={[c.primary, c.primaryDark]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={[styles.bgLayer1, { backgroundColor: `${c.primary}33` }]} />
      <View style={[styles.bgLayer2, { backgroundColor: `${c.violet}1A` }]} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0w5qFByl1pS_hZYiQE4W3GrJCqCcndfj0EcQ3HX3XFeU-hO7mWib4pbar7Fo7Rr3t-wBRSHESP1aLzfwqwAwSpRm43C8gjtl1y-SBov8hqS36AIVR6SSr6khPbLO1jG5xCVyuom7Qu1sSruYIiysQKsgEFC3cOIJkhxYTu6v0IDaEPfSlvSHvJb0JqoMgEBkDLrn1uu82Cj2sljC7Kfz47f-nbr4F0y5Unx0pywlNhg5I0R_spqUF7_0Bdf26gGuziB4cStA6kJQ" }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.appName}>BluPay</Text>

        <Text style={styles.tagline}>SECURE DIGITAL FINANCE</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: `${c.surface}1A` }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressWidth, backgroundColor: c.mint, shadowColor: c.mint },
            ]}
          />
        </View>
      </View>

      <Text style={[styles.bottomText, { color: `${c.surface}66` }]}>
        Trusted by millions worldwide
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  bgLayer1: {
    position: "absolute",
    top: "-20%",
    left: "-10%",
    width: "60%",
    height: "60%",
    borderRadius: width * 0.3,
    opacity: 0.2,
  },
  bgLayer2: {
    position: "absolute",
    bottom: "-20%",
    right: "-10%",
    width: "60%",
    height: "60%",
    borderRadius: width * 0.3,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  logoContainer: {
    width: 96,
    height: 96,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: "600",
  },
  progressContainer: {
    position: "absolute",
    bottom: 64,
    width: 192,
    alignSelf: "center",
  },
  progressBar: {
    width: "100%",
    height: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  bottomText: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    fontSize: 11,
    fontWeight: "500",
  },
});
