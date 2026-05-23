import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api';

const LiveChatScreen = () => {
  const router = useRouter();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Load existing messages or create ticket
  useEffect(() => {
    const loadChat = async () => {
      try {
        const res = await apiClient.get('/support?status=open');
        const tickets = Array.isArray(res?.data) ? res.data : [];
        if (tickets.length > 0) {
          setTicketId(tickets[0]._id);
          setMessages(tickets[0].messages.reverse());
        } else {
          // Create new ticket if none open
          const newTicketRes = await apiClient.post('/support', {
            subject: 'Live Chat Support',
            category: 'general',
            message: 'Started live chat session',
          });
          setTicketId(newTicketRes.data._id);
          setMessages(newTicketRes.data.messages.reverse());
        }
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    };
    loadChat();
  }, []);

  // Listen to socket
  useEffect(() => {
    if (socket) {
      socket.on('support:message', (data: any) => {
        if (data.ticketId === ticketId) {
          setMessages(prev => [data.message, ...prev]);
        }
      });
      return () => {
        socket.off('support:message');
      };
    }
  }, [socket, ticketId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !ticketId) return;

    const tempMessage = {
      _id: Date.now().toString(),
      message: inputText.trim(),
      isStaff: false,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [tempMessage, ...prev]);
    setInputText('');

    try {
      await apiClient.post(`/support/${ticketId}/reply`, { message: tempMessage.message });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = !item.isStaff;
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.staffBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.staffText]}>
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Support</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0EA5E9',
    borderBottomRightRadius: 4,
  },
  staffBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  staffText: {
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#0EA5E9',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginBottom: 2,
  },
});

export default LiveChatScreen;
