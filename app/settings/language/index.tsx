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
import { useTheme } from '@/context/ThemeContext';

export default function LanguageSettings() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
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
    setTimeout(() => {
      router.back();
    }, 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Language</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: c.primaryLight }]}>
          <Globe size={24} color={c.violet} />
          <Text style={[styles.infoText, { color: c.textSub }]}>
            Choose your preferred language for the app interface
          </Text>
        </View>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.languageItem, { borderBottomColor: c.border }]}
            onPress={() => handleSelect(lang.code)}
          >
            <View>
              <Text style={[styles.languageName, { color: c.text }]}>{lang.name}</Text>
              <Text style={[styles.languageNative, { color: c.textSub }]}>{lang.nativeName}</Text>
            </View>
            {selectedLanguage === lang.code && (
              <View style={[styles.checkCircle, { backgroundColor: c.violet }]}>
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
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  languageItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  languageName: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  languageNative: { fontSize: 13 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
