import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Phone, Video, MoveVertical as MoreVertical, Send, Smile, Paperclip, Mic } from 'lucide-react-native';
import Animated, { FadeInUp, withRepeat, withSequence, withTiming, useAnimatedStyle, withDelay } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { getContactById, generateMockMessages } from '@/utils/mockData';
import { Message as MessageType, Contact } from '@/types';
import { Message } from '@/components/Message';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    // Get contact data
    const contactData = getContactById(id as string);
    if (contactData) {
      setContact(contactData);
    }
    
    // Generate mock messages
    setMessages(generateMockMessages(20, id as string));
  }, [id]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add new message to the list
    const newMsg: MessageType = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'me',
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Simulate message sending and response
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'sent' } : msg
        )
      );
      
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate reply after a delay
      setTimeout(() => {
        setIsTyping(false);
        
        const replyMsg: MessageType = {
          id: `msg-${Date.now()}`,
          text: getRandomReply(),
          timestamp: new Date().toISOString(),
          sender: id as string,
          status: 'read'
        };
        
        setMessages(prev => [...prev, replyMsg]);
      }, 3000);
    }, 1000);
  };
  
  const getRandomReply = () => {
    const replies = [
      "Sure, that sounds good!",
      "I'll get back to you soon.",
      "Thanks for letting me know.",
      "Can we discuss this later?",
      "That's interesting!",
      "I'm not sure about that.",
      "Let me think about it.",
      "Great idea!",
      "How about meeting tomorrow?",
      "I'm busy right now, can we talk later?"
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // Create animated styles for each typing dot
  const dot1Style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.2, { duration: 400 }),
            withTiming(1, { duration: 400 })
          ),
          -1
        )
      }
    ]
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withDelay(200,
              withTiming(1.2, { duration: 400 })
            ),
            withDelay(200,
              withTiming(1, { duration: 400 })
            )
          ),
          -1
        )
      }
    ]
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withDelay(400,
              withTiming(1.2, { duration: 400 })
            ),
            withDelay(400,
              withTiming(1, { duration: 400 })
            )
          ),
          -1
        )
      }
    ]
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              {contact && (
                <View style={styles.headerContent}>
                  <Image 
                    source={{ uri: contact.avatarUrl }}
                    style={styles.avatar}
                  />
                  <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{contact.name}</Text>
                    {contact.isOnline ? (
                      <Text style={styles.onlineStatus}>Online</Text>
                    ) : (
                      <Text style={styles.offlineStatus}>Last seen today</Text>
                    )}
                  </View>
                </View>
              )}
              
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerActionButton}>
                  <Phone size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerActionButton}>
                  <Video size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerActionButton}>
                  <MoreVertical size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Message message={item} />
        )}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />
      
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <Animated.View style={[styles.typingDot, dot1Style]} />
            <Animated.View style={[styles.typingDot, dot2Style]} />
            <Animated.View style={[styles.typingDot, dot3Style]} />
          </View>
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Smile size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {newMessage.trim() === '' ? (
            <TouchableOpacity style={styles.micButton}>
              <Mic size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#3B82F6',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  onlineStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#BBF7D0',
  },
  offlineStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 16,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    paddingTop: 10,
    paddingBottom: 10,
  },
  emojiButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});