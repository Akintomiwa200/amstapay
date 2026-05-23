import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Dimensions,
  ScrollView, NativeSyntheticEvent, NativeScrollEvent, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

function IllustrationInstant({ colors }: { colors: any }) {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      <Rect x="80" y="20" width="100" height="170" rx="16" fill={colors.primary} />
      <Rect x="86" y="30" width="88" height="150" rx="10" fill={colors.primaryDark} />
      <Ellipse cx="130" cy="105" rx="38" ry="55" fill={colors.primaryDark} opacity="0.6" />
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        <Rect
          key={`${r}-${c}`}
          x={108 + c * 12}
          y={82 + r * 12}
          width={8}
          height={8}
          rx={2}
          fill={(r + c) % 2 === 0 ? colors.mint : colors.violet}
          opacity={0.9}
        />
      )))}
      <Rect x="100" y="130" width="60" height="20" rx="6" fill={colors.primary} />
      <Rect x="107" y="136" width="46" height="8" rx="3" fill={colors.mint} opacity="0.7" />
      <Rect x="10" y="70" width="68" height="44" rx="10" fill={colors.violet} opacity={0.9} />
      <Rect x="18" y="80" width="30" height="6" rx="3" fill="#ffffff" opacity="0.6" />
      <Rect x="18" y="91" width="18" height="6" rx="3" fill={colors.mint} opacity="0.7" />
      <Rect x="182" y="90" width="68" height="44" rx="10" fill={colors.pink} opacity="0.85" />
      <Rect x="190" y="100" width="30" height="6" rx="3" fill="#ffffff" opacity="0.6" />
      <Rect x="190" y="111" width="18" height="6" rx="3" fill={colors.blue} opacity="0.7" />
      <Path d="M80 92 L56 92" stroke={colors.mint} strokeWidth="2" strokeDasharray="4 3" />
      <Path d="M60 88 L56 92 L60 96" stroke={colors.mint} strokeWidth="2" fill="none" />
      <Path d="M180 112 L204 112" stroke={colors.pink} strokeWidth="2" strokeDasharray="4 3" />
      <Path d="M200 108 L204 112 L200 116" stroke={colors.pink} strokeWidth="2" fill="none" />
      <Path d="M50 50 L52 44 L54 50 L60 52 L54 54 L52 60 L50 54 L44 52 Z" fill={colors.mint} opacity="0.8" />
      <Path d="M200 50 L202 45 L204 50 L209 52 L204 54 L202 59 L200 54 L195 52 Z" fill={colors.violet} opacity="0.8" />
      <Circle cx="38" cy="160" r="5" fill={colors.pink} opacity="0.6" />
      <Circle cx="218" cy="155" r="4" fill={colors.blue} opacity="0.6" />
    </Svg>
  );
}

function IllustrationWeb3({ colors }: { colors: any }) {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      <Path
        d="M130 40 L162 58 L162 94 L130 112 L98 94 L98 58 Z"
        fill={colors.primary}
        stroke={colors.violet}
        strokeWidth="2"
      />
      <Path d="M130 54 L152 66 L152 90 L130 102 L108 90 L108 66 Z" fill={colors.primaryDark} />
      <Path d="M118 78 Q130 68 142 78" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M118 84 Q130 94 142 84" stroke={colors.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Rect x="124" y="72" width="12" height="16" rx="4" fill="none" stroke={colors.blue} strokeWidth="2" />
      <Circle cx="52" cy="76" r="24" fill={colors.primary} stroke={colors.pink} strokeWidth="1.5" />
      <Rect x="42" y="68" width="20" height="14" rx="4" fill={colors.pink} opacity="0.6" />
      <Rect x="44" y="75" width="16" height="4" rx="2" fill="#ffffff" opacity="0.4" />
      <Circle cx="208" cy="76" r="24" fill={colors.primary} stroke={colors.mint} strokeWidth="1.5" />
      <Path d="M198 80 L208 68 L218 80 L208 92 Z" fill={colors.mint} opacity="0.7" />
      <Circle cx="80" cy="170" r="20" fill={colors.primary} stroke={colors.blue} strokeWidth="1.5" />
      <Rect x="72" y="162" width="16" height="16" rx="3" fill="none" stroke={colors.blue} strokeWidth="2" />
      <Path d="M76 170 L80 166 L84 170 L80 174 Z" fill={colors.blue} opacity="0.8" />
      <Circle cx="180" cy="170" r="20" fill={colors.primary} stroke={colors.violet} strokeWidth="1.5" />
      <Path d="M172 178 L180 162 L188 178 Z" fill={colors.violet} opacity="0.8" />
      <Path d="M76 76 L98 76" stroke={colors.pink} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Path d="M162 76 L184 76" stroke={colors.mint} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Path d="M110 107 L92 156" stroke={colors.blue} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Path d="M150 107 L168 156" stroke={colors.violet} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <Circle cx="130" cy="155" r="10" fill={colors.mint} opacity="0.25" />
      <Circle cx="130" cy="155" r="6" fill={colors.mint} opacity="0.5" />
      <Path d="M127 155 L130 150 L133 155 L130 160 Z" fill="#ffffff" opacity="0.8" />
    </Svg>
  );
}

function IllustrationAllInOne({ colors }: { colors: any }) {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      <Rect x="40" y="30" width="180" height="110" rx="18" fill={colors.primary} />
      <Rect x="40" y="30" width="180" height="110" rx="18" fill="url(#cardGrad)" opacity="0.4" />
      <Defs>
        <RadialGradient id="cardGrad" cx="0%" cy="0%" r="100%">
          <Stop offset="0%" stopColor={colors.violet} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={colors.pink} stopOpacity="0.2" />
        </RadialGradient>
      </Defs>
      <Rect x="60" y="52" width="28" height="22" rx="4" fill={colors.mint} opacity="0.8" />
      <Path d="M60 61 L88 61" stroke={colors.primaryDark} strokeWidth="1.5" />
      <Path d="M74 52 L74 74" stroke={colors.primaryDark} strokeWidth="1.5" />
      {[0,1,2,3].map(g => (
        <G key={g} transform={`translate(${60 + g * 42}, 88)`}>
          <Circle cx={0} cy={0} r={3} fill="#ffffff" opacity={0.5} />
          <Circle cx={8} cy={0} r={3} fill="#ffffff" opacity={0.5} />
          <Circle cx={16} cy={0} r={3} fill="#ffffff" opacity={0.5} />
          <Circle cx={24} cy={0} r={3} fill="#ffffff" opacity={0.5} />
        </G>
      ))}
      <Rect x="60" y="108" width="60" height="8" rx="4" fill="#ffffff" opacity="0.3" />
      <Rect x="160" y="104" width="44" height="14" rx="4" fill={colors.mint} opacity="0.7" />
      <Rect x="20" y="158" width="64" height="36" rx="12" fill={colors.primary} />
      <Rect x="21" y="159" width="62" height="34" rx="11" stroke={colors.violet} strokeWidth="1" fill="none" />
      <Rect x="32" y="168" width="20" height="5" rx="2.5" fill={colors.violet} opacity="0.8" />
      <Rect x="32" y="177" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.3" />
      <Rect x="98" y="158" width="64" height="36" rx="12" fill={colors.primary} />
      <Rect x="99" y="159" width="62" height="34" rx="11" stroke={colors.blue} strokeWidth="1" fill="none" />
      <Rect x="110" y="168" width="20" height="5" rx="2.5" fill={colors.blue} opacity="0.8" />
      <Rect x="110" y="177" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.3" />
      <Rect x="176" y="158" width="64" height="36" rx="12" fill={colors.primary} />
      <Rect x="177" y="159" width="62" height="34" rx="11" stroke={colors.pink} strokeWidth="1" fill="none" />
      <Rect x="188" y="168" width="20" height="5" rx="2.5" fill={colors.pink} opacity="0.8" />
      <Rect x="188" y="177" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.3" />
      <Path d="M24 42 L26 36 L28 42 L34 44 L28 46 L26 52 L24 46 L18 44 Z" fill={colors.mint} opacity="0.7" />
      <Circle cx="235" cy="148" r="6" fill={colors.pink} opacity="0.5" />
      <Circle cx="18" cy="145" r="4" fill={colors.violet} opacity="0.5" />
    </Svg>
  );
}

const onboardingData = [
  {
    title: "Scan & Pay Instantly",
    description: "Send crypto or fiat to anyone, anywhere — just scan a QR code and confirm in seconds.",
    Illustration: IllustrationInstant,
  },
  {
    title: "Your Web3 Wallet",
    description: "Hold, swap, and bridge tokens across multiple chains. True ownership — your keys, your assets.",
    Illustration: IllustrationWeb3,
  },
  {
    title: "One App, Full Control",
    description: "Pay bills, manage DeFi yields, track spending, and send money globally — all from one dashboard.",
    Illustration: IllustrationAllInOne,
  },
];

const OnboardingCarousel = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const c = theme.colors;

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

  const isLast = currentSlide === onboardingData.length - 1;

  const dotActiveColors = [c.mint, c.violet, c.pink];

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={[styles.bg, { backgroundColor: c.surface }]} />

      <TouchableOpacity style={[styles.skipButton, { borderColor: `${c.primary}33` }]} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: c.primary }]}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {onboardingData.map(({ title, description, Illustration }) => (
          <View key={title} style={[styles.slide, { width }]}>
            <View style={styles.illustrationWrap}>
              <Illustration colors={c} />
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.title, { color: c.primary }]}>{title}</Text>
              <Text style={[styles.description, { color: c.textSecondary }]}>{description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {onboardingData.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentSlide
                ? [styles.dotActive, { backgroundColor: dotActiveColors[i] }]
                : [styles.dotInactive, { backgroundColor: `${c.primary}26` }],
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.85} onPress={handleNext} style={styles.buttonOuter}>
          <LinearGradient
            colors={c.gradientSplash as any}
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
            <Text style={[styles.loginText, { color: c.textLight }]}>Already have an account? </Text>
            <Text style={[styles.loginAccent, { color: c.mint }]}>Log In</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleSkip}>
            <Text style={[styles.loginText, styles.loginAccent, { color: c.mint }]}>Log in instead</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingCarousel;

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipText: {
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
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: '500',
  },
  loginAccent: {
    fontWeight: '700',
  },
});
