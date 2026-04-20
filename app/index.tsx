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
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");

// AmstaPay Logo - Modern geometric design

function AmstaPayLogo({ size = 200 }: { size?: number }) {
  const { theme, isDarkMode } = useTheme();

  const center = 100; // keep SVG consistent
  const scale = size / 200;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        {/* Brand gradient */}
        <SvgGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.mint} />
          <Stop offset="50%" stopColor={theme.colors.blue} />
          <Stop offset="100%" stopColor={theme.colors.violet} />
        </SvgGradient>
      </Defs>

      {/* Outer ring */}
      <Circle
        cx={center}
        cy={center}
        r="92"
        fill="none"
        stroke="url(#brandGradient)"
        strokeWidth="8"
      />

      {/* Inner background */}
      <Circle
        cx={center}
        cy={center}
        r="80"
        fill={theme.colors.surface}
      />

      {/* Main "A" shape */}
      <Path
        d="M70 140 L100 60 L130 140"
        stroke={theme.colors.primary}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Cross bar */}
      <Path
        d="M82 110 L118 110"
        stroke={theme.colors.primary}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Accent glow line (subtle fintech touch) */}
      <Path
        d="M60 150 Q100 170 140 150"
        stroke="url(#brandGradient)"
        strokeWidth="4"
        opacity="0.6"
        strokeLinecap="round"
      />
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
  const { theme, isDarkMode } = useTheme();

  const [minimumTimePassed, setMinimumTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumTimePassed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minimumTimePassed && !loading) {
      router.replace(user ? "/dashboard" : "/onboarding");
    }
  }, [minimumTimePassed, loading, user]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      {/* Top Gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? [
                theme.colors.background,
                theme.colors.surface,
                theme.colors.surfaceAlt,
              ]
            : [
                "#FFFFFF",
                "#F8F8FC",
                "#E8E0F0",
              ]
        }
        style={StyleSheet.absoluteFillObject}
      />

      <DiagonalStripes />

      <View style={styles.content}>
        <AmstaPayLogo size={180} />

        <View style={styles.textBlock}>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Welcome to
          </Text>

          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            AmstaPay
          </Text>

          <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>
            Scan. Pay. Transact seamlessly with Web3-powered banking.
          </Text>
        </View>

        {(loading || !minimumTimePassed) && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.violet}
            />
            <Text style={[styles.loadingText, { color: theme.colors.violet }]}>
              Loading...
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Gradient */}
      <LinearGradient
        colors={theme.colors.gradientAccent.map((c, i) =>
          i === 0 ? "transparent" : c
        )}
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