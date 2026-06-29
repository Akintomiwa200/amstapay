import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Smartphone, Monitor, Trash2, Shield } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSocket } from '@/context/SocketContext';
import { authService } from '@/services/auth';
import type { AuthSession } from '@/lib/models';

function parseList<T>(res: unknown): T[] {
  const data = (res as { data?: T[] })?.data ?? res;
  return Array.isArray(data) ? data : [];
}

function formatDate(value?: string) {
  if (!value) return 'Unknown';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SessionsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { socket } = useSocket();
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await authService.getSessions();
      setSessions(parseList<AuthSession>(res));
    } catch {
      setSessions([
        {
          deviceId: 'current',
          deviceName: `${Platform.OS === 'ios' ? 'iPhone' : 'Android'} (This device)`,
          platform: Platform.OS,
          lastActive: new Date().toISOString(),
          current: true,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions]),
  );

  useEffect(() => {
    if (!socket) return;
    const onSession = () => loadSessions();
    socket.on('auth:session', onSession);
    socket.on('security:alert', onSession);
    return () => {
      socket.off('auth:session', onSession);
      socket.off('security:alert', onSession);
    };
  }, [socket, loadSessions]);

  const handleRevoke = (session: AuthSession) => {
    if (session.current) {
      Alert.alert('Current device', 'You cannot sign out your current device from here. Use Logout instead.');
      return;
    }
    Alert.alert(
      'Sign out device',
      `Remove access for ${session.deviceName || 'this device'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              setRevoking(session.deviceId);
              await authService.revokeSession(session.deviceId);
              await loadSessions();
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to revoke session');
            } finally {
              setRevoking(null);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primaryLight, c.bg]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.bg, borderColor: c.border }]}>
            <ChevronLeft size={24} color={c.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.primary }]}>Active Sessions</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSessions(); }} tintColor={c.violet} />}
      >
        <View style={[styles.infoCard, { backgroundColor: c.primaryLight }]}>
          <Shield size={22} color={c.violet} />
          <Text style={[styles.infoText, { color: c.textSub }]}>
            These devices are signed in to your AmstaPay account. Remove any you do not recognize.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 40 }} />
        ) : (
          sessions.map((session) => {
            const Icon = session.platform === 'web' || session.platform === 'desktop' ? Monitor : Smartphone;
            return (
              <View key={session.deviceId} style={[styles.sessionCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                <View style={[styles.sessionIcon, { backgroundColor: `${c.violet}15` }]}>
                  <Icon size={22} color={c.violet} />
                </View>
                <View style={styles.sessionInfo}>
                  <View style={styles.sessionTitleRow}>
                    <Text style={[styles.sessionName, { color: c.text }]}>{session.deviceName || 'Unknown device'}</Text>
                    {session.current && (
                      <View style={[styles.currentBadge, { backgroundColor: `${c.mint}22` }]}>
                        <Text style={[styles.currentText, { color: c.mint }]}>This device</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.sessionMeta, { color: c.textSub }]}>
                    {session.platform ? `${session.platform} · ` : ''}Last active {formatDate(session.lastActive)}
                  </Text>
                  {session.ipAddress ? (
                    <Text style={[styles.sessionMeta, { color: c.textSub }]}>IP {session.ipAddress}</Text>
                  ) : null}
                </View>
                {!session.current && (
                  <TouchableOpacity
                    onPress={() => handleRevoke(session)}
                    disabled={revoking === session.deviceId}
                    style={styles.revokeBtn}
                  >
                    {revoking === session.deviceId ? (
                      <ActivityIndicator size="small" color={c.error} />
                    ) : (
                      <Trash2 size={18} color={c.error} />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  infoCard: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 14, marginBottom: 20, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19 },
  sessionCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  sessionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  sessionInfo: { flex: 1 },
  sessionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  sessionName: { fontSize: 15, fontWeight: '600' },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  currentText: { fontSize: 10, fontWeight: '700' },
  sessionMeta: { fontSize: 12, marginTop: 2 },
  revokeBtn: { padding: 8 },
});
