import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getConversations } from '../../services/chatService';
import { UseAuthStore } from '../../store/AuthStore';
import { Routes } from '../../navigation/routes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const ChatListScreen = () => {
  const { userId } = UseAuthStore();
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversationsData = async () => {
    if (!userId) return;
    const { data, error } = await getConversations(userId);
    if (data) {
      setConversations(data);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversationsData();
    }, [userId]),
  );

  useEffect(() => {
    if (!userId) return;

    // Real-time listener for the conversation list
    const channel = supabase
      .channel('conversations-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        payload => {
          console.log('Conversation list real-time update:', payload.eventType);
          // If the change belongs to this user, refresh
          const newPayload = payload.new as any;
          const oldPayload = payload.old as any;

          const isParticipant = (data: any) =>
            data && (data.student_id === userId || data.tutor_id === userId);

          if (isParticipant(newPayload) || isParticipant(oldPayload)) {
            fetchConversationsData();
          }
        },
      )
      .subscribe(status => {
        console.log('Conversations list subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const renderItem = ({ item }: { item: any }) => {
    const isStudent = item.student_id === userId;
    const otherUser = isStudent ? item.tutor : item.student;
    const lastMsg = item.last_message_details;
    const isUnread = lastMsg && lastMsg.sender_id !== userId && !lastMsg.isRead;

    if (!otherUser) return null;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(Routes.CHAT_SCREEN, {
            conversationId: item.id,
            tutorId: isStudent ? item.tutor_id : item.student_id,
          })
        }
        className={`flex-row items-center p-4 border-b border-gray-100 ${
          isUnread ? 'bg-blue-50/50' : 'bg-white'
        }`}
      >
        <View className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden mr-4 relative">
          {otherUser.avatar_url ? (
            <Image
              source={{ uri: otherUser.avatar_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center bg-blue-500">
              <Text className="text-white font-bold text-lg">
                {otherUser.full_name?.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className={`text-base font-Outfit-Bold ${
                isUnread ? 'text-black font-bold' : 'text-gray-900'
              }`}
              numberOfLines={1}
            >
              {otherUser.full_name}
            </Text>
            <Text
              className={`text-xs ${isUnread ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
            >
              {new Date(item.updated_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-sm flex-1 mr-2 ${
                isUnread ? 'text-black font-bold' : 'text-gray-500'
              }`}
              numberOfLines={1}
            >
              {item.last_msg}
            </Text>
            {isUnread && (
              <View className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 py-4 border-b border-gray-50 flex-row items-center justify-start">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} size={20} color="black" />
        </TouchableOpacity>
        <Text
          className="text-3xl font-bold text-black ml-2"
          style={{ fontFamily: 'Outfit-Bold' }}
        >
          Messages
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center p-10">
          <View className="h-40 w-40 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">💬</Text>
          </View>
          <Text className="text-gray-400 text-lg text-center font-Outfit-Medium">
            No conversations yet. Start a chat by contacting a tutor!
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatListScreen;
