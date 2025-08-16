import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Cards = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Rewards</Text>
    <Text style={styles.text}>Rewards page content goes here...</Text>
  </View>
);

export default Cards;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#4b5563' },
});
