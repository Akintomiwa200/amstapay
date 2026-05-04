// app/card/index.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Clock, Bell, Plus, Shield, Zap, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

const Cards = () => {
  const router = useRouter();

  const features = [
    { icon: Zap, title: 'Instant Issuance', description: 'Get your virtual card immediately' },
    { icon: Shield, title: 'Secure Transactions', description: 'Bank-grade security for all payments' },
    { icon: Globe, title: 'Global Acceptance', description: 'Use anywhere Mastercard/Visa is accepted' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[C.primary, C.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Cards</Text>
          <Text style={styles.headerSubtitle}>Virtual & Physical Debit Cards</Text>
        </LinearGradient>

        {/* Main Content Area with White Background */}
        <View style={styles.contentArea}>
          {/* Card Preview - Now on white background */}
          <View style={styles.cardPreviewContainer}>
            <LinearGradient
              colors={[C.primary, C.violet]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardPreview}
            >
              <View style={styles.cardHeader}>
                <CreditCard size={28} color="#fff" />
                <Text style={styles.cardType}>Debit Card</Text>
              </View>
              <Text style={styles.cardNumber}>•••• •••• •••• 2024</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardValue}>YOUR NAME</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardValue}>**/**</Text>
                </View>
              </View>
            </LinearGradient>
            
            {/* Coming Soon Badge */}
            <View style={styles.comingSoonBadge}>
              <Clock size={16} color="#fff" />
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Virtual & Physical Cards</Text>
            
            <Text style={styles.subtitle}>
              Get ready to experience seamless payments with AmstaPay cards
            </Text>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={[styles.featureIcon, { backgroundColor: `${C.violet}15` }]}>
                      <Icon size={24} color={C.violet} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>What you'll get:</Text>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Instant virtual card upon request</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Physical card delivered to your doorstep</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>No annual fees for the first year</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Up to 2% cashback on all purchases</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Free ATM withdrawals (first 3 monthly)</Text>
              </View>
            </View>

            {/* Notify Button */}
            <TouchableOpacity style={styles.notifyButton}>
              <LinearGradient
                colors={[C.mint, C.blue, C.violet, C.pink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.notifyGradient}
              >
                <Bell size={18} color="#fff" />
                <Text style={styles.notifyText}>Notify Me When Available</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer Note */}
            <Text style={styles.footerNote}>
              Cards are issued in partnership with licensed financial institutions
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  contentArea: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 20,
  },
  cardPreviewContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    position: 'relative',
  },
  cardPreview: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -12,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: C.textSub,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: C.bg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 11,
    color: C.textSub,
    textAlign: 'center',
    lineHeight: 15,
  },
  benefitsContainer: {
    backgroundColor: C.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.primary,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.violet,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: C.text,
  },
  notifyButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  notifyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  notifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  footerNote: {
    fontSize: 11,
    color: C.textSub,
    textAlign: 'center',
    lineHeight: 16,
  },
});