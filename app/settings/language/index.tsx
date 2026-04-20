// app/settings/language.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Check, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

export default function LanguageSettings() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yoruba' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  const handleSelect = (code: string) => {
    setSelectedLanguage(code);
    // Save language preference
    setTimeout(() => {
      router.back();
    }, 500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Language</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Globe size={24} color={C.violet} />
          <Text style={styles.infoText}>
            Choose your preferred language for the app interface
          </Text>
        </View>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageItem}
            onPress={() => handleSelect(lang.code)}
          >
            <View>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.languageNative}>{lang.nativeName}</Text>
            </View>
            {selectedLanguage === lang.code && (
              <View style={styles.checkCircle}>
                <Check size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.primaryLight, padding: 16, borderRadius: 16, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 13, color: C.textSub, lineHeight: 18 },
  languageItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  languageName: { fontSize: 16, fontWeight: '500', color: C.text, marginBottom: 4 },
  languageNative: { fontSize: 13, color: C.textSub },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center' },
});