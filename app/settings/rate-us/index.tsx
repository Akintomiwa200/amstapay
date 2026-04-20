// app/settings/rate-us/index.tsx - Rate Us Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Star, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function RateUsScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Us</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>How's your experience?</Text>
        <Text style={styles.subtitle}>We'd love to hear your thoughts about AmstaPay</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Star
                size={44}
                color={star <= rating ? '#FFD700' : C.border}
                fill={star <= rating ? '#FFD700' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && <Text style={styles.ratingLabel}>{ratingLabels[rating]}</Text>}

        {/* Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={styles.label}>Additional Feedback (Optional)</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Tell us what you think..."
            placeholderTextColor={C.textSub}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <LinearGradient colors={[C.violet, C.primary]} style={styles.submitGradient}>
            <Send size={20} color="#fff" />
            <Text style={styles.submitText}>Submit Review</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.primary },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: C.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: C.textSub, textAlign: 'center', marginBottom: 32 },
  starsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  ratingLabel: { fontSize: 16, fontWeight: '600', color: C.violet, marginBottom: 32 },
  feedbackSection: { width: '100%', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: C.primary, marginBottom: 8 },
  feedbackInput: { backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: C.text, minHeight: 120 },
  submitBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
