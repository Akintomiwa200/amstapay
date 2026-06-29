import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useSocket } from '@/context/SocketContext';
import { supportService, type SupportMessage } from '@/services/support';
import { parseList, parseData } from '@/lib/parse';
import { useTheme } from '@/context/ThemeContext';

export default function LiveChatScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const { socket } = useSocket();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const loadChat = useCallback(async () => {
    try {
      const res = await supportService.getTickets('open');
      const tickets = parseList<{ _id: string; messages?: SupportMessage[] }>(res);
      if (tickets.length > 0) {
        setTicketId(tickets[0]._id);
        setMessages(tickets[0].messages || []);
      } else {
        const created = parseData<{ _id: string; messages?: SupportMessage[] }>(
          await supportService.createTicket({
            subject: 'Live Chat Support',
            category: 'general',
            message: 'Started live chat session',
          }),
        );
        if (created) {
          setTicketId(created._id);
          setMessages(created.messages || []);
        }
      }
    } catch {
      // offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChat(); }, [loadChat]);

  useEffect(() => {
    if (!socket) return;
    const onMsg = (data: { ticketId?: string; message?: SupportMessage }) => {
      if (data.ticketId === ticketId && data.message) {
        setMessages((prev) => [...prev, data.message!]);
      }
    };
    socket.on('support:message', onMsg);
    return () => { socket.off('support:message', onMsg); };
  }, [socket, ticketId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !ticketId) return;
    const temp: SupportMessage = { message: inputText.trim(), isStaff: false, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, temp]);
    const text = inputText.trim();
    setInputText('');
    try {
      await supportService.reply(ticketId, text);
    } catch {
      // keep optimistic message
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: c.bg }]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: c.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.text }]}>Live Support</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator color={c.violet} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            keyExtractor={(item, index) => item._id || `${index}`}
            renderItem={({ item }) => {
              const isUser = !item.isStaff;
              return (
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.staffBubble]}>
                  <Text style={[styles.messageText, isUser ? styles.userText : { color: c.text }]}>{item.message}</Text>
                </View>
              );
            }}
            inverted
            contentContainerStyle={styles.messageList}
          />
        )}

        <View style={[styles.inputContainer, { borderTopColor: c.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: c.primaryLight, color: c.text }]}
            placeholder="Type a message..."
            placeholderTextColor={c.textSub}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: c.violet }]} onPress={sendMessage}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  messageList: { padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#0EA5E9', borderBottomRightRadius: 4 },
  staffBubble: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, alignItems: 'flex-end' },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, maxHeight: 100, fontSize: 15 },
  sendButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
});
