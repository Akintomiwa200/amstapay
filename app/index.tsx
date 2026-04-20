import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

// AmstaPay Logo - Modern geometric design
function AmstaPayLogo({ size = 200 }: { size?: number }) {
  const logoSize = size;
  const center = logoSize / 2;
  
  return (
    <Svg width={logoSize} height={logoSize} viewBox="0 0 200 200">
      <Defs>
        <SvgGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#22f0c3" />
          <Stop offset="33%" stopColor="#2db3ff" />
          <Stop offset="66%" stopColor="#8b5cf6" />
          <Stop offset="100%" stopColor="#ff3cac" />
        </SvgGradient>
        <SvgGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#2D0057" />
          <Stop offset="100%" stopColor="#1a0035" />
        </SvgGradient>
      </Defs>

      {/* Outer circle with gradient */}
      <Circle cx={center} cy={center} r="90" fill="url(#logoGradient)" />
      
      {/* Inner circle */}
      <Circle cx={center} cy={center} r="75" fill="url(#innerGradient)" />
      
      {/* Abstract "A" shape */}
      <Path
        d={`M${center - 35} ${center + 45} L${center} ${center - 45} L${center + 35} ${center + 45}`}
        stroke="url(#logoGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Cross bar of "A" */}
      <Path
        d={`M${center - 22} ${center + 10} L${center + 22} ${center + 10}`}
        stroke="url(#logoGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Decorative dot above */}
      <Circle cx={center} cy={center - 55} r="4" fill="#22f0c3" />
      
      {/* Decorative stars */}
      <Circle cx={center - 60} cy={center + 20} r="3" fill="#2db3ff" opacity="0.6" />
      <Circle cx={center + 55} cy={center + 15} r="2" fill="#8b5cf6" opacity="0.5" />
      <Circle cx={center - 45} cy={center - 30} r="2.5" fill="#ff3cac" opacity="0.4" />
      <Circle cx={center + 50} cy={center - 25} r="3" fill="#22f0c3" opacity="0.5" />
    </Svg>
  );
}

// Diagonal stripe pattern with better blending
function DiagonalStripes() {
  const stripes = [];
  const count = 6;
  const gap = width * 0.35;

  for (let i = -2; i < count; i++) {
    const x = i * gap;
    stripes.push(
      <Path
        key={i}
        d={`M${x} 0 L${x + height * 0.7} ${height} L${x + gap * 0.6 + height * 0.7} ${height} L${x + gap * 0.6} 0 Z`}
        fill="rgba(45, 0, 87, 0.03)"
      />
    );
  }

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
    >
      {stripes}
    </Svg>
  );
}

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumTimePassed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minimumTimePassed && !loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [minimumTimePassed, loading, user, router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Main gradient background that covers everything with smooth transition */}
      <LinearGradient
        colors={[
          "#FFFFFF",
          "#FFFFFF",
          "#F8F8FC",
          "#F0EDF5",
          "#E8E0F0",
          "#D8CCE8",
          "#C8B8E0",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.7 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Diagonal stripes overlay */}
      <DiagonalStripes />

      {/* Main centered content */}
      <View style={styles.content}>
        {/* AmstaPay Logo */}
        <AmstaPayLogo size={180} />

        {/* Text block */}
        <View style={styles.textBlock}>
          <Text style={styles.tagline}>Welcome to</Text>
          <Text style={styles.appName}>
            Amsta<Text style={styles.appNameHighlight}>Pay</Text>
          </Text>
          <Text style={styles.sub}>
            Scan. Pay. Transact seamlessly with Web3-powered banking.
          </Text>
        </View>

        {/* Loading indicator */}
        {(loading || !minimumTimePassed) && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>

      {/* Bottom gradient that blends smoothly from the top gradient */}
      <LinearGradient
        colors={[
          "rgba(34,240,195,0)",
          "rgba(34,240,195,0.15)",
          "rgba(45,179,255,0.25)",
          "rgba(139,92,246,0.4)",
          "rgba(255,60,172,0.6)",
          "rgba(255,60,172,0.8)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  textBlock: {
    alignItems: "center",
    marginTop: 32,
  },
  tagline: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "400",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#2D0057",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  appNameHighlight: {
    background: "linear-gradient(45deg, #22f0c3, #2db3ff, #8b5cf6, #ff3cac)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
  loaderContainer: {
    marginTop: 48,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 12,
    color: "#8b5cf6",
    marginTop: 8,
    fontWeight: "500",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
});