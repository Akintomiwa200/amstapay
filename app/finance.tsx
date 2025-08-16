import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Finance = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Rewards</Text>
    <Text style={styles.text}>Rewards page content goes here...</Text>
  </View>
);

export default Finance;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#4b5563' },
});
