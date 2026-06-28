import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Shield, Zap, Sparkles, Camera } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { APP_NAME } from '@/lib/constants';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: Zap, label: 'Instant transfers' },
  { icon: Camera, label: 'Snap & Pay' },
  { icon: Shield, label: 'Bank-grade security' },
  { icon: Sparkles, label: 'AmstaWealth' },
];

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading, initialized } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const featureOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(featureOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (!initialized || loading) return;
    const timer = setTimeout(() => {
      router.replace(user ? '/dashboard' : '/onboarding');
    }, 2400);
    return () => clearTimeout(timer);
  }, [initialized, loading, user]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[c.primaryDark, c.primary, c.violet]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.orb, styles.orbTop, { backgroundColor: `${c.mint}22` }]} />
      <View style={[styles.orb, styles.orbBottom, { backgroundColor: `${c.pink}18` }]} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoRing,
            {
              opacity: logoOpacity,
              transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
              borderColor: `${c.mint}55`,
              shadowColor: c.mint,
            },
          ]}
        >
          <LinearGradient
            colors={[c.mint, c.blue, c.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoInner}
          >
            <Text style={styles.logoLetter}>A</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.tagline}>Your money. Smarter. Safer. Nigerian.</Text>
        </Animated.View>

        <Animated.View style={[styles.featuresRow, { opacity: featureOpacity }]}>
          {FEATURES.map(({ icon: Icon, label }) => (
            <View key={label} style={[styles.featureChip, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              <Icon size={14} color={c.mint} />
              <Text style={styles.featureText}>{label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: c.mint }]} />
        </View>
        <Text style={styles.footerText}>Licensed · Secure · Real-time</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  orb: { position: 'absolute', borderRadius: width },
  orbTop: { width: width * 0.9, height: width * 0.9, top: -width * 0.35, right: -width * 0.25 },
  orbBottom: { width: width * 0.8, height: width * 0.8, bottom: -width * 0.3, left: -width * 0.2 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, zIndex: 10 },
  logoRing: {
    width: 112,
    height: 112,
    borderRadius: 36,
    borderWidth: 2,
    padding: 4,
    marginBottom: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logoInner: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: { fontSize: 52, fontWeight: '900', color: '#fff' },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 32,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    maxWidth: 320,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureText: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '600' },
  footer: { position: 'absolute', bottom: 48, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 48 },
  progressTrack: { width: '100%', height: 3, borderRadius: 99, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', borderRadius: 99 },
  footerText: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '500', letterSpacing: 0.5 },
});
