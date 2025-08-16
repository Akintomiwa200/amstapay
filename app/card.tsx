import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { CreditCard, Clock } from 'lucide-react-native';

const Cards = () => (
  <View style={styles.container}>
    <View style={styles.cardIllustration}>
      <CreditCard size={80} color="#6b7280" />
      <Clock size={40} color="#3b82f6" style={styles.clockIcon} />
    </View>
    
    <Text style={styles.title}>Debit Cards Coming Soon</Text>
    
    <Text style={styles.subtitle}>
      We're working hard to bring you virtual and physical debit cards
    </Text>
    
    <Text style={styles.description}>
      This feature will allow you to make payments online and in stores, 
      withdraw cash from ATMs, and manage your spending all in one place.
    </Text>
    
    <View style={styles.notifyContainer}>
      <Text style={styles.notifyText}>Notify me when available</Text>
    </View>
  </View>
);

export default Cards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  cardIllustration: {
    position: 'relative',
    marginBottom: 32,
  },
  clockIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  notifyContainer: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  notifyText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});