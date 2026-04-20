// onboarding-carousel.tsx
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ─── Illustration: Tap-to-Pay / Instant Transfer ───────────────────────────
function IllustrationInstant() {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      {/* Phone body */}
      <Rect x="80" y="20" width="100" height="170" rx="16" fill="#2D0057" />
      <Rect x="86" y="30" width="88" height="150" rx="10" fill="#1a0035" />
      {/* Screen glow */}
      <Ellipse cx="130" cy="105" rx="38" ry="55" fill="#3D0070" opacity="0.6" />
      {/* QR grid dots */}
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        <Rect
          key={`${r}-${c}`}
          x={108 + c * 12}
          y={82 + r * 12}
          width={8}
          height={8}
          rx={2}
          fill={(r + c) % 2 === 0 ? '#22f0c3' : '#8b5cf6'}
          opacity={0.9}
        />
      )))}
      {/* Amount label */}
      <Rect x="100" y="130" width="60" height="20" rx="6" fill="#2D0057" />
      <Rect x="107" y="136" width="46" height="8" rx="3" fill="#22f0c3" opacity="0.7" />

      {/* Left card */}
      <Rect x="10" y="70" width="68" height="44" rx="10" fill="#8b5cf6" opacity="0.9" />
      <Rect x="18" y="80" width="30" height="6" rx="3" fill="#ffffff" opacity="0.6" />
      <Rect x="18" y="91" width="18" height="6" rx="3" fill="#22f0c3" opacity="0.7" />

      {/* Right card */}
      <Rect x="182" y="90" width="68" height="44" rx="10" fill="#ff3cac" opacity="0.85" />
      <Rect x="190" y="100" width="30" height="6" rx="3" fill="#ffffff" opacity="0.6" />
      <Rect x="190" y="111" width="18" height="6" rx="3" fill="#2db3ff" opacity="0.7" />

      {/* Arrows left */}
      <Path d="M80 92 L56 92" stroke="#22f0c3" strokeWidth="2" strokeDasharray="4 3" />
      <Path d="M60 88 L56 92 L60 96" stroke="#22f0c3" strokeWidth="2" fill="none" />
      {/* Arrows right */}
      <Path d="M180 112 L204 112" stroke="#ff3cac" strokeWidth="2" strokeDasharray="4 3" />
      <Path d="M200 108 L204 112 L200 116" stroke="#ff3cac" strokeWidth="2" fill="none" />

      {/* Sparkles */}
      <Path d="M50 50 L52 44 L54 50 L60 52 L54 54 L52 60 L50 54 L44 52 Z" fill="#22f0c3" opacity="0.8" />
      <Path d="M200 50 L202 45 L204 50 L209 52 L204 54 L202 59 L200 54 L195 52 Z" fill="#8b5cf6" opacity="0.8" />
      <Circle cx="38" cy="160" r="5" fill="#ff3cac" opacity="0.6" />
      <Circle cx="218" cy="155" r="4" fill="#2db3ff" opacity="0.6" />
    </Svg>
  );
}

// ─── Illustration: Web3 Wallet / Chain ─────────────────────────────────────
function IllustrationWeb3() {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      {/* Central hexagon */}
      <Path
        d="M130 40 L162 58 L162 94 L130 112 L98 94 L98 58 Z"
        fill="#2D0057"
        stroke="#8b5cf6"
        strokeWidth="2"
      />
      <Path
        d="M130 54 L152 66 L152 90 L130 102 L108 90 L108 66 Z"
        fill="#3D0070"
      />
      {/* Chain symbol */}
      <Path d="M118 78 Q130 68 142 78" stroke="#22f0c3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M118 84 Q130 94 142 84" stroke="#22f0c3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Rect x="124" y="72" width="12" height="16" rx="4" fill="none" stroke="#2db3ff" strokeWidth="2" />

      {/* Satellite nodes */}
      <Circle cx="52" cy="76" r="24" fill="#2D0057" stroke="#ff3cac" strokeWidth="1.5" />
      <Rect x="42" y="68" width="20" height="14" rx="4" fill="#ff3cac" opacity="0.6" />
      <Rect x="44" y="75" width="16" height="4" rx="2" fill="#ffffff" opacity="0.4" />

      <Circle cx="208" cy="76" r="24" fill="#2D0057" stroke="#22f0c3" strokeWidth="1.5" />
      <Path d="M198 80 L208 68 L218 80 L208 92 Z" fill="#22f0c3" opacity="0.7" />

      <Circle cx="80" cy="170" r="20" fill="#2D0057" stroke="#2db3ff" strokeWidth="1.5" />
      <Rect x="72" y="162" width="16" height="16" rx="3" fill="none" stroke="#2db3ff" strokeWidth="2" />
      <Path d="M76 170 L80 166 L84 170 L80 174 Z" fill="#2db3ff" opacity="0.8" />

      <Circle cx="180" cy="170" r="20" fill="#2D0057" stroke="#8b5cf6" strokeWidth="1.5" />
      <Path d="M172 178 L180 162 L188 178 Z" fill="#8b5cf6" opacity="0.8" />

      {/* Connecting lines */}
      <Path d="M76 76 L98 76" stroke="#ff3cac" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Path d="M162 76 L184 76" stroke="#22f0c3" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Path d="M110 107 L92 156" stroke="#2db3ff" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Path d="M150 107 L168 156" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />

      {/* Floating tokens */}
      <Circle cx="130" cy="155" r="10" fill="#22f0c3" opacity="0.25" />
      <Circle cx="130" cy="155" r="6" fill="#22f0c3" opacity="0.5" />
      <Path d="M127 155 L130 150 L133 155 L130 160 Z" fill="#ffffff" opacity="0.8" />
    </Svg>
  );
}

// ─── Illustration: All-in-One Finance ──────────────────────────────────────
function IllustrationAllInOne() {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      {/* Main card */}
      <Rect x="40" y="30" width="180" height="110" rx="18" fill="#2D0057" />
      <Rect x="40" y="30" width="180" height="110" rx="18" fill="url(#cardGrad)" opacity="0.4" />
      <Defs>
        <RadialGradient id="cardGrad" cx="0%" cy="0%" r="100%">
          <Stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#ff3cac" stopOpacity="0.2" />
        </RadialGradient>
      </Defs>
      {/* Card chip */}
      <Rect x="60" y="52" width="28" height="22" rx="4" fill="#22f0c3" opacity="0.8" />
      <Path d="M60 61 L88 61" stroke="#1a0035" strokeWidth="1.5" />
      <Path d="M74 52 L74 74" stroke="#1a0035" strokeWidth="1.5" />
      {/* Card number dots */}
      {[0,1,2,3].map(g => (
        <G key={g} transform={`translate(${60 + g * 42}, 88)`}>
          <Circle cx={0} cy={0} r={3} fill="#ffffff" opacity={0.5} />
          <Circle cx={8} cy={0} r={3} fill="#ffffff" opacity={0.5} />
          <Circle cx={16} cy={0} r={3} fill="#ffffff" opacity={0.5} />
          <Circle cx={24} cy={0} r={3} fill="#ffffff" opacity={0.5} />
        </G>
      ))}
      {/* Name & balance */}
      <Rect x="60" y="108" width="60" height="8" rx="4" fill="#ffffff" opacity="0.3" />
      <Rect x="160" y="104" width="44" height="14" rx="4" fill="#22f0c3" opacity="0.7" />

      {/* Floating action pills */}
      <Rect x="20" y="158" width="64" height="36" rx="12" fill="#2D0057" />
      <Rect x="21" y="159" width="62" height="34" rx="11" stroke="#8b5cf6" strokeWidth="1" fill="none" />
      <Rect x="32" y="168" width="20" height="5" rx="2.5" fill="#8b5cf6" opacity="0.8" />
      <Rect x="32" y="177" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.3" />

      <Rect x="98" y="158" width="64" height="36" rx="12" fill="#2D0057" />
      <Rect x="99" y="159" width="62" height="34" rx="11" stroke="#2db3ff" strokeWidth="1" fill="none" />
      <Rect x="110" y="168" width="20" height="5" rx="2.5" fill="#2db3ff" opacity="0.8" />
      <Rect x="110" y="177" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.3" />

      <Rect x="176" y="158" width="64" height="36" rx="12" fill="#2D0057" />
      <Rect x="177" y="159" width="62" height="34" rx="11" stroke="#ff3cac" strokeWidth="1" fill="none" />
      <Rect x="188" y="168" width="20" height="5" rx="2.5" fill="#ff3cac" opacity="0.8" />
      <Rect x="188" y="177" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.3" />

      {/* Sparkle */}
      <Path d="M24 42 L26 36 L28 42 L34 44 L28 46 L26 52 L24 46 L18 44 Z" fill="#22f0c3" opacity="0.7" />
      <Circle cx="235" cy="148" r="6" fill="#ff3cac" opacity="0.5" />
      <Circle cx="18" cy="145" r="4" fill="#8b5cf6" opacity="0.5" />
    </Svg>
  );
}

const onboardingData = [
  {
    id: 1,
    title: "Scan & Pay Instantly",
    description: "Send crypto or fiat to anyone, anywhere — just scan a QR code and confirm in seconds.",
    accent: "#22f0c3",
    Illustration: IllustrationInstant,
  },
  {
    id: 2,
    title: "Your Web3 Wallet",
    description: "Hold, swap, and bridge tokens across multiple chains. True ownership — your keys, your assets.",
    accent: "#8b5cf6",
    Illustration: IllustrationWeb3,
  },
  {
    id: 3,
    title: "One App, Full Control",
    description: "Pay bills, manage DeFi yields, track spending, and send money globally — all from one dashboard.",
    accent: "#ff3cac",
    Illustration: IllustrationAllInOne,
  },
];

const OnboardingCarousel = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      scrollViewRef.current?.scrollTo({ x: width * next, animated: true });
    } else {
      router.push('/signup');
    }
  };

  const handleSkip = () => router.push('/login');

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentSlide(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const slide = onboardingData[currentSlide];
  const isLast = currentSlide === onboardingData.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Dark purple background */}
      <View style={styles.bg} />



      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {onboardingData.map(({ id, title, description, Illustration }) => (
          <View key={id} style={[styles.slide, { width }]}>
            {/* Illustration area */}
            <View style={styles.illustrationWrap}>
              <Illustration />
            </View>

            {/* Text */}
            <View style={styles.textWrap}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {onboardingData.map((item, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentSlide
                ? [styles.dotActive, { backgroundColor: item.accent }]
                : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.buttonOuter}
        >
          <LinearGradient
            colors={['#22f0c3', '#2db3ff', '#8b5cf6', '#ff3cac']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{isLast ? 'Get Started' : 'Next'}</Text>
            <ArrowRight size={20} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>

        {isLast ? (
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Text style={[styles.loginText, styles.loginAccent]}>Log In</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleSkip}>
            <Text style={[styles.loginText, styles.loginAccent]}>Log in instead</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(45,0,87,0.2)',
  },
  skipText: {
    color: '#2D0057',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  scroll: {
    flex: 1,
    marginTop: 60,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationWrap: {
    width: 280,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  textWrap: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2D0057',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 25,
    maxWidth: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(45,0,87,0.15)',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 44,
    gap: 4,
  },
  buttonOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loginText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '500',
  },
  loginAccent: {
    color: '#22f0c3',
    fontWeight: '700',
  },
});