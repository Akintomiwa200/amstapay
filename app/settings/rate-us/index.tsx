// app/settings/rate-us/index.tsx - Rate Us Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Star, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function RateUsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    Alert.alert('Thank You!', 'Your feedback has been submitted. We appreciate your support!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Rate Us</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.title, { color: c.primary }]}>How's your experience?</Text>
        <Text style={[styles.subtitle, { color: c.textSub }]}>We'd love to hear your thoughts about AmstaPay</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Star
                size={44}
                color={star <= rating ? '#FFD700' : c.border}
                fill={star <= rating ? '#FFD700' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && <Text style={[styles.ratingLabel, { color: c.violet }]}>{ratingLabels[rating]}</Text>}

        {/* Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={[styles.label, { color: c.primary }]}>Additional Feedback (Optional)</Text>
          <TextInput
            style={[styles.feedbackInput, { backgroundColor: c.inputBg, borderColor: c.border, color: c.text }]}
            placeholder="Tell us what you think..."
            placeholderTextColor={c.textSub}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <LinearGradient colors={[c.violet, c.primary]} style={styles.submitGradient}>
            <Send size={20} color="#fff" />
            <Text style={styles.submitText}>Submit Review</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  starsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  ratingLabel: { fontSize: 16, fontWeight: '600', marginBottom: 32 },
  feedbackSection: { width: '100%', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  feedbackInput: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, minHeight: 120 },
  submitBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
