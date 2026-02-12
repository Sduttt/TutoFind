import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from '../../services/chatService';
import { StackScreenProps } from '@react-navigation/stack';
import { UseAuthStore } from '../../store/AuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserProfile } from '../../services/userService';
import { Routes } from '../../navigation/routes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faCheck,
  faCheckDouble,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/supabase';

type RootStackParamList = {
  ChatScreen: {
    conversationId: string;
    tutorId?: string;
    postId?: string;
    otherUserId?: string; // We'll try to get this from params or fetch it
  };
};

type Props = StackScreenProps<RootStackParamList, 'ChatScreen'>;

const ChatScreen = ({ route, navigation }: Props) => {
  const { conversationId, tutorId } = route.params;
  const { userId } = UseAuthStore();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  // Debug logging to fix alignment issue
  useEffect(() => {
    console.log('DEBUG: Current User ID:', userId);
    if (messages.length > 0) {
      console.log(
        'DEBUG: Last message sender_id:',
        messages[messages.length - 1].sender_id,
      );
    }
  }, [userId, messages.length]);

  const fetchOtherUserProfile = async (id: string) => {
    const { data } = await getUserProfile(id);
    if (data) {
      setOtherUser(data);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await getMessages(conversationId);
    if (data) {
      setMessages(data);
    }
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();
    if (tutorId && tutorId !== userId) {
      fetchOtherUserProfile(tutorId);
    }

    // Subscribe to new messages and updates in the current conversation
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new;
            setMessages(prev => {
              if (prev.some(m => m.id === newMessage.id)) return prev;
              const updated = [...prev, newMessage];
              return updated.sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime(),
              );
            });
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev =>
              prev.map(m =>
                m.id === (payload.new as any).id ? payload.new : m,
              ),
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev =>
              prev.filter(m => m.id === (payload.old as any).id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, tutorId, userId]);

  useEffect(() => {
    const markAsRead = async () => {
      if (!conversationId || !userId || messages.length === 0) return;
      const unread = messages.some(m => m.receiver_id === userId && !m.isRead);
      if (unread) {
        const { success } = await markMessagesAsRead(conversationId, userId);
        if (success) {
          setMessages(prev =>
            prev.map(msg =>
              msg.receiver_id === userId ? { ...msg, isRead: true } : msg,
            ),
          );
        }
      }
    };
    markAsRead();
  }, [messages.length, conversationId, userId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !userId || !otherUser?.id) return;
    const msg = inputText.trim();
    setInputText('');

    const { data, error } = await sendMessage(
      conversationId,
      userId,
      otherUser.id,
      msg,
    );
    if (data) {
      setMessages(prev =>
        prev.some(m => m.id === data.id) ? prev : [...prev, data],
      );
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
    if (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#000" />
          </TouchableOpacity>
          {otherUser && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.TUTOR_PROFILE as any, {
                  userId: otherUser.id,
                })
              }
              className="flex-row items-center flex-1"
            >
              <View className="h-10 w-10 rounded-full bg-blue-500 items-center justify-center mr-3 overflow-hidden">
                {otherUser.avatar_url ? (
                  <Image
                    source={{ uri: otherUser.avatar_url }}
                    className="h-full w-full"
                  />
                ) : (
                  <Text className="text-white font-bold">
                    {otherUser.full_name?.charAt(0)}
                  </Text>
                )}
              </View>
              <View>
                <Text
                  className="text-base font-bold text-black"
                  numberOfLines={1}
                >
                  {otherUser.full_name}
                </Text>
                <Text className="text-xs text-gray-500">View Profile</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          className="flex-1"
          style={{ flex: 1 }}
          onContentSizeChange={() => {
            if (messages.length > 0)
              flatListRef.current?.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => {
            const isMine = String(item.sender_id) === String(userId);
            return (
              <View
                className={`p-3 m-2 rounded-lg max-w-[80%] ${
                  isMine ? 'bg-blue-600 self-end' : 'bg-gray-200 self-start'
                }`}
              >
                <Text className={isMine ? 'text-white' : 'text-black'}>
                  {item.content}
                </Text>
                <View className="flex-row justify-end items-center mt-1">
                  <Text
                    className={`text-[10px] mr-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}
                  >
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  {isMine && (
                    <FontAwesomeIcon
                      icon={item.isRead ? faCheckDouble : faCheck}
                      size={10}
                      color={item.isRead ? '#93c5fd' : '#bfdbfe'}
                    />
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {/* Input Bar */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 15) }}
          className="flex-row p-4 border-t border-gray-200 items-center bg-white"
        >
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4  mr-2 text-black max-h-24"
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            style={{ fontSize: 16 }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-blue-600 rounded-full px-6 py-2"
            disabled={!inputText.trim()}
          >
            <Text className="text-white font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
// TODO: fix the gap below message input section
