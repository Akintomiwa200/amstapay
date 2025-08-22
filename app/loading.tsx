// components/LoadingScreen.tsx
import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Animated, 
  Easing,
  Dimensions 
} from 'react-native';
import { QrCode } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  message?: string;
  type?: 'default' | 'pulse' | 'dots' | 'progress';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  showLogo?: boolean;
  showProgressBar?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  type = 'default',
  size = 'medium',
  color = '#F97316',
  backgroundColor = '#FFFFFF',
  showLogo = true,
  showProgressBar = false
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotScale1 = useRef(new Animated.Value(1)).current;
  const dotScale2 = useRef(new Animated.Value(1)).current;
  const dotScale3 = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    switch (type) {
      case 'default':
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
        break;
      
      case 'pulse':
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
        break;
      
      case 'dots':
        // Animate dots sequentially
        const createDotAnimation = (dot: Animated.Value, delay: number) => {
          return Animated.loop(
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(dot, {
                toValue: 1.4,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ])
          );
        };
        
        createDotAnimation(dotScale1, 0).start();
        createDotAnimation(dotScale2, 200).start();
        createDotAnimation(dotScale3, 400).start();
        break;
      
      case 'progress':
        Animated.loop(
          Animated.sequence([
            Animated.timing(progressAnim, {
              toValue: 0.8,
              duration: 1500,
              easing: Easing.out(Easing.sin),
              useNativeDriver: false,
            }),
            Animated.timing(progressAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }),
          ])
        ).start();
        break;
    }
  }, [type]);

  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 48;
      case 'large': return 72;
      default: return 48;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderSpinner = () => {
    switch (type) {
      case 'default':
        return (
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <QrCode size={getSpinnerSize()} color={color} />
          </Animated.View>
        );
      
      case 'pulse':
        return (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <QrCode size={getSpinnerSize()} color={color} />
          </Animated.View>
        );
      
      case 'dots':
        return (
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { transform: [{ scale: dotScale1 }], backgroundColor: color }]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: dotScale2 }], backgroundColor: color }]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: dotScale3 }], backgroundColor: color }]} />
          </View>
        );
      
      case 'progress':
        return (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: `${color}20` }]}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: color,
                    width: progressInterpolate
                  }
                ]} 
              />
            </View>
          </View>
        );
      
      default:
        return (
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <QrCode size={getSpinnerSize()} color={color} />
          </Animated.View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <QrCode size={32} color={color} />
          <Text style={[styles.appName, { color }]}>AmstaPay</Text>
        </View>
      )}
      
      <View style={styles.spinnerContainer}>
        {renderSpinner()}
      </View>
      
      <Text style={[styles.message, { fontSize: getTextSize(), color }]}>
        {message}
      </Text>
      
      {showProgressBar && type !== 'progress' && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: `${color}20` }]}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: color,
                  width: progressInterpolate
                }
              ]} 
            />
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: `${color}80` }]}>
          Secured by AmstaPay
        </Text>
      </View>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  spinnerContainer: {
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  progressContainer: {
    width: '60%',
    marginTop: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 14,
  },
});