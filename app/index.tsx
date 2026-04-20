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
import Svg, { Path, Circle, Ellipse, G } from "react-native-svg";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

// Premier League Lion Logo — pure SVG, no image
function PremierLeagueLion({ size = 200 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* Crown */}
      <Path
        d="M100 10 L88 35 L76 18 L80 42 L68 28 L75 52 L125 52 L132 28 L120 42 L124 18 L112 35 Z"
        fill="#2D0057"
      />
      {/* Crown base band */}
      <Path
        d="M70 50 Q100 44 130 50 L128 60 Q100 54 72 60 Z"
        fill="#2D0057"
      />

      {/* Head / mane outer shape */}
      <Path
        d="M100 58
           C 72 58, 50 70, 44 88
           C 38 106, 40 124, 48 136
           C 56 148, 68 155, 78 158
           C 84 160, 90 162, 96 164
           L 100 168
           L 104 164
           C 110 162, 116 160, 122 158
           C 132 155, 144 148, 152 136
           C 160 124, 162 106, 156 88
           C 150 70, 128 58, 100 58 Z"
        fill="#2D0057"
      />

      {/* Face — lighter area */}
      <Path
        d="M100 72
           C 85 72, 72 80, 68 92
           C 64 104, 66 118, 74 128
           C 80 136, 90 140, 100 140
           C 110 140, 120 136, 126 128
           C 134 118, 136 104, 132 92
           C 128 80, 115 72, 100 72 Z"
        fill="#3D0070"
      />

      {/* Eye */}
      <Ellipse cx="93" cy="100" rx="8" ry="6" fill="#2D0057" />
      <Ellipse cx="91" cy="99" rx="3" ry="2.5" fill="#ffffff" />

      {/* Nose */}
      <Path
        d="M97 115 Q100 112 103 115 Q101 120 97 115 Z"
        fill="#2D0057"
      />

      {/* Muzzle */}
      <Ellipse cx="100" cy="122" rx="12" ry="8" fill="#4A0090" />
      <Path d="M100 118 L100 126" stroke="#2D0057" strokeWidth="1.5" />
      <Path d="M90 122 Q100 130 110 122" stroke="#2D0057" strokeWidth="1.5" fill="none" />

      {/* Mane wisps left */}
      <Path d="M60 85 Q48 95 50 110" stroke="#2D0057" strokeWidth="7" strokeLinecap="round" fill="none" />
      <Path d="M58 100 Q44 112 48 128" stroke="#2D0057" strokeWidth="6" strokeLinecap="round" fill="none" />
      <Path d="M62 118 Q50 130 56 146" stroke="#2D0057" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Mane wisps right */}
      <Path d="M140 85 Q152 95 150 110" stroke="#2D0057" strokeWidth="7" strokeLinecap="round" fill="none" />
      <Path d="M142 100 Q156 112 152 128" stroke="#2D0057" strokeWidth="6" strokeLinecap="round" fill="none" />
      <Path d="M138 118 Q150 130 144 146" stroke="#2D0057" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Chest / body bottom */}
      <Path
        d="M78 158 Q100 168 122 158 Q118 178 100 182 Q82 178 78 158 Z"
        fill="#2D0057"
      />
    </Svg>
  );
}

// Diagonal stripe pattern using SVG
function DiagonalStripes() {
  const stripes = [];
  const count = 8;
  const gap = width * 0.28;

  for (let i = -2; i < count; i++) {
    const x = i * gap;
    stripes.push(
      <Path
        key={i}
        d={`M${x} 0 L${x + height * 0.6} ${height} L${x + gap * 0.55 + height * 0.6} ${height} L${x + gap * 0.55} 0 Z`}
        fill="rgba(0,0,0,0.04)"
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

      {/* White base */}
      <View style={StyleSheet.absoluteFillObject} />

      {/* Diagonal stripes overlay */}
      <DiagonalStripes />

      {/* Main centered content */}
      <View style={styles.content}>
        {/* Lion logo — pure SVG */}
        <PremierLeagueLion size={180} />

        {/* Text block */}
        <View style={styles.textBlock}>
          <Text style={styles.tagline}>The new home of the</Text>
          <Text style={styles.tagline}>
            <Text style={styles.taglineBold}>AmstaPay</Text>
          </Text>
          <Text style={styles.sub}>Scan. Pay. Transact seamlessly with Web3-powered banking.</Text>
        </View>

        {/* Loading indicator */}
        {(loading || !minimumTimePassed) && (
          <ActivityIndicator size="large" color="#3D0070" style={styles.loader} />
        )}
      </View>

      {/* Bottom rainbow gradient — matches Figma */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(34,240,195,0.7)",
          "rgba(45,179,255,0.85)",
          "rgba(139,92,246,0.9)",
          "rgba(255,60,172,1)",
        ]}
        start={{ x: 0.1, y: 0.5 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.bottomGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    marginTop: -20,
    zIndex: 10,
  },
  textBlock: {
    alignItems: "center",
    marginTop: 24,
  },
  tagline: {
    fontSize: 22,
    color: "#2D0057",
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "400",
    lineHeight: 32,
    letterSpacing: 0.2,
  },
  taglineBold: {
    fontWeight: "700",
  },
  sub: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    maxWidth: 280,
    lineHeight: 20,
  },
  loader: {
    marginTop: 48,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
  },
});