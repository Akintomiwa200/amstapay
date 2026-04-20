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
import { C } from '@/components/dashboardComponent/colors';

export default function PrivacySettings() {
  const router = useRouter();
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
    <View style={styles.container}>
      <LinearGradient colors={[C.primaryLight, C.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Settings</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Privacy</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Eye size={20} color={C.violet} />
              <View>
                <Text style={styles.settingLabel}>Profile Visibility</Text>
                <Text style={styles.settingDesc}>Allow others to see your profile</Text>
              </View>
            </View>
            <Switch
              value={settings.profileVisibility}
              onValueChange={(v) => setSettings({ ...settings, profileVisibility: v })}
              trackColor={{ false: C.border, true: C.violet + '50' }}
              thumbColor={settings.profileVisibility ? C.violet : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Lock size={20} color={C.violet} />
              <View>
                <Text style={styles.settingLabel}>Transaction History</Text>
                <Text style={styles.settingDesc}>Show transaction details</Text>
              </View>
            </View>
            <Switch
              value={settings.transactionHistory}
              onValueChange={(v) => setSettings({ ...settings, transactionHistory: v })}
              trackColor={{ false: C.border, true: C.violet + '50' }}
              thumbColor={settings.transactionHistory ? C.violet : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Eye size={20} color={C.violet} />
              <View>
                <Text style={styles.settingLabel}>Show Balance</Text>
                <Text style={styles.settingDesc}>Display balance on home screen</Text>
              </View>
            </View>
            <Switch
              value={settings.showBalance}
              onValueChange={(v) => setSettings({ ...settings, showBalance: v })}
              trackColor={{ false: C.border, true: C.violet + '50' }}
              thumbColor={settings.showBalance ? C.violet : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Sharing</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Database size={20} color={C.violet} />
              <View>
                <Text style={styles.settingLabel}>Share Data for Analytics</Text>
                <Text style={styles.settingDesc}>Help improve app experience</Text>
              </View>
            </View>
            <Switch
              value={settings.shareData}
              onValueChange={(v) => setSettings({ ...settings, shareData: v })}
              trackColor={{ false: C.border, true: C.violet + '50' }}
              thumbColor={settings.shareData ? C.violet : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.dangerItem} onPress={handleClearData}>
            <Trash2 size={20} color={C.error} />
            <Text style={styles.dangerText}>Clear Cache</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem} 
            onPress={() => router.push('/settings/privacy-policy')}
          >
            <Shield size={20} color={C.violet} />
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
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
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', color: C.text, marginBottom: 2 },
  settingDesc: { fontSize: 12, color: C.textSub },
  dangerItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  dangerText: { fontSize: 15, color: C.error, fontWeight: '500' },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  linkText: { fontSize: 15, color: C.violet, fontWeight: '500' },
});