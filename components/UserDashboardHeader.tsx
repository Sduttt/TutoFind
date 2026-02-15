import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../navigation/routes';
import { getUnreadConversationsCount } from '../services/chatService';
import { supabase } from '../lib/supabase';

const UserDashboardHeader = ({ user: passedUser }: { user?: any }) => {
  const { user: hookUser } = useUserProfile();
  const user = passedUser || hookUser;
  const navigation = useNavigation<any>();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (user?.id) {
      const { count } = await getUnreadConversationsCount(user.id);
      setUnreadCount(count);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUnreadCount();

    if (!user?.id) return;

    // Listen for new messages or message updates (mark as read)
    const channel = supabase
      .channel(`unread-count-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadCount();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`,
        },
        payload => {
          // If a message we sent was updated (likely marked as read by the other person),
          // this doesn't affect OUR unread count (conversations with unread msgs for us),
          // but we listen to updates where WE are the receiver above.
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchUnreadCount]);

  return (
    <View className="flex-row justify-between items-start p-4">
      {/* Left */}
      <View className="flex-row items-start">
        <View className="border-2 border-blue-500 rounded-full w-32 h-32 flex items-center justify-center">
          <View className="h-28 w-28 bg-gray-100 rounded-full overflow-hidden items-center justify-center">
            {user?.avatar_url ? (
              <Image
                source={{ uri: user?.avatar_url }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} size={60} color="gray" />
            )}
          </View>
        </View>
        <View className="ml-4 mt-2 w-56">
          <Text className="text-2xl font-bold">{user?.full_name}</Text>
          <Text className="text-sm text-gray-600">{user?.email}</Text>
          <TouchableOpacity
            className={`mt-2 border border-dashed rounded-full p-2 w-[145px] h-[40px] items-center justify-center ${user?.subscription_type === 'free' ? 'border-gray-500' : user?.subscription_type === 'silver' ? 'border-blue-500' : 'border-yellow-500'}`}
          >
            <Text
              className={`text-sm font-bold text-white mx-2 text-center w-[130px] rounded-full h-[30px] leading-[30px] items-center justify-center ${user?.subscription_type === 'free' ? 'bg-gray-500' : user?.subscription_type === 'silver' ? 'bg-blue-500' : 'bg-yellow-500'} `}
            >
              {user?.subscription_type?.toUpperCase()} USER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Right */}
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.CHAT_LIST_SCREEN)}
        className="mt-6 relative"
      >
        <FontAwesomeIcon icon={faComment} size={24} />
        {unreadCount > 0 && (
          <View className="absolute top-[-5px] right-[-5px]">
            <View className="bg-red-500 rounded-full h-5 px-1.5 min-w-[20px] items-center justify-center">
              <Text className="text-white text-[10px] font-bold">
                {unreadCount}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UserDashboardHeader;
