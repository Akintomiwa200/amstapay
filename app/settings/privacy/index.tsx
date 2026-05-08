// app/settings/privacy.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Eye, Lock, Shield, Database, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function PrivacySettings() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [settings, setSettings] = useState({
    profileVisibility: true,
    transactionHistory: false,
    showBalance: true,
    shareData: false,
  });

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Cache cleared successfully')
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Privacy Settings</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Profile Privacy</Text>
          <View style={[styles.settingItem, { borderBottomColor: c.border }]}>
            <View style={styles.settingLeft}>
              <Eye size={20} color={c.violet} />
              <View>
                <Text style={[styles.settingLabel, { color: c.text }]}>Profile Visibility</Text>
                <Text style={[styles.settingDesc, { color: c.textSub }]}>Allow others to see your profile</Text>
              </View>
            </View>
            <Switch
              value={settings.profileVisibility}
              onValueChange={(v) => setSettings({ ...settings, profileVisibility: v })}
              trackColor={{ false: c.border, true: c.violet + '50' }}
              thumbColor={settings.profileVisibility ? c.violet : '#fff'}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: c.border }]}>
            <View style={styles.settingLeft}>
              <Lock size={20} color={c.violet} />
              <View>
                <Text style={[styles.settingLabel, { color: c.text }]}>Transaction History</Text>
                <Text style={[styles.settingDesc, { color: c.textSub }]}>Show transaction details</Text>
              </View>
            </View>
            <Switch
              value={settings.transactionHistory}
              onValueChange={(v) => setSettings({ ...settings, transactionHistory: v })}
              trackColor={{ false: c.border, true: c.violet + '50' }}
              thumbColor={settings.transactionHistory ? c.violet : '#fff'}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: c.border }]}>
            <View style={styles.settingLeft}>
              <Eye size={20} color={c.violet} />
              <View>
                <Text style={[styles.settingLabel, { color: c.text }]}>Show Balance</Text>
                <Text style={[styles.settingDesc, { color: c.textSub }]}>Display balance on home screen</Text>
              </View>
            </View>
            <Switch
              value={settings.showBalance}
              onValueChange={(v) => setSettings({ ...settings, showBalance: v })}
              trackColor={{ false: c.border, true: c.violet + '50' }}
              thumbColor={settings.showBalance ? c.violet : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Data & Sharing</Text>
          <View style={[styles.settingItem, { borderBottomColor: c.border }]}>
            <View style={styles.settingLeft}>
              <Database size={20} color={c.violet} />
              <View>
                <Text style={[styles.settingLabel, { color: c.text }]}>Share Data for Analytics</Text>
                <Text style={[styles.settingDesc, { color: c.textSub }]}>Help improve app experience</Text>
              </View>
            </View>
            <Switch
              value={settings.shareData}
              onValueChange={(v) => setSettings({ ...settings, shareData: v })}
              trackColor={{ false: c.border, true: c.violet + '50' }}
              thumbColor={settings.shareData ? c.violet : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.primary }]}>Data Management</Text>
          <TouchableOpacity style={[styles.dangerItem, { borderBottomColor: c.border }]} onPress={handleClearData}>
            <Trash2 size={20} color={c.error} />
            <Text style={[styles.dangerText, { color: c.error }]}>Clear Cache</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem} 
            onPress={() => router.push('/settings/privacy-policy')}
          >
            <Shield size={20} color={c.violet} />
            <Text style={[styles.linkText, { color: c.violet }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
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
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  settingDesc: { fontSize: 12 },
  dangerItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1 },
  dangerText: { fontSize: 15, fontWeight: '500' },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  linkText: { fontSize: 15, fontWeight: '500' },
});
