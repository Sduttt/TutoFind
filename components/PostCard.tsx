import { Text, Image, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { PostType } from '../types/Type';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTutorPosts } from '../hooks/useTutorPosts';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../navigation/routes';
import { supabase } from '../lib/supabase';
import { sendMessage } from '../services/chatService';

const PostCard = ({
  subject,
  subjectLine,
  level,
  board,
  desc,
  minFees,
  maxFees,
  mode,
  freeDemo,
  tutorName,
  tutorImg,
  postDate,
  totalViews,
  tutorId,
  postId,
  isLive,
  onDelete,
  onEdit,
}: PostType) => {
  const { user } = useUserProfile();
  const {
    deletePost,
    publishUnpublishPost,
    incrementViewCount,
    loading,
    error,
  } = useTutorPosts();
  const navigation = useNavigation<any>();

  const [displayViews, setDisplayViews] = useState(totalViews);

  useEffect(() => {
    setDisplayViews(totalViews);
  }, [totalViews]);

  useEffect(() => {
    const recordView = async () => {
      if (user && user.id !== tutorId && user.user_type === 'student') {
        const isNewView = await incrementViewCount(postId);
        if (isNewView) {
          setDisplayViews((prev: any) => (Number(prev) || 0) + 1);
        }
      }
    };
    recordView();
  }, [postId, user?.id, tutorId]);

  const handleDelete = async () => {
    const success = await deletePost(postId);
    if (success && onDelete) {
      onDelete();
    }
  };

  const handleContact = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please wait until your profile is loaded.');
      return;
    }

    try {
      console.log(
        'Fetching conversation for tutor:',
        tutorId,
        'and student:',
        user.id,
      );
      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('tutor_id', tutorId)
        .eq('student_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching conversation:', fetchError);
        Alert.alert(
          'Error',
          'Failed to fetch conversation: ' + fetchError.message,
        );
        return;
      }

      const sendFirstMsg = async (chatData: any) => {
        const { error: msgError } = await sendMessage(
          chatData.id,
          user.id,
          tutorId,
          `I am interested in this class: **${subject}**, **${subjectLine}**.`,
        );
        if (msgError) {
          console.error('Error sending first message:', msgError);
        }
        navigation.navigate(Routes.CHAT_SCREEN as String, {
          tutorId,
          postId,
          conversationId: chatData.id,
        });
      };

      if (data) {
        console.log('Existing conversation found:', data.id);
        sendFirstMsg(data);
      } else {
        console.log('No existing conversation, creating new one...');
        const initialMessage = `I am interested in this class: **${subject}**, **${subjectLine}**.`;
        const { data: newData, error: insertError } = await supabase
          .from('conversations')
          .insert({
            tutor_id: tutorId,
            student_id: user.id,
            last_msg: initialMessage,
          })
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Error creating conversation:', insertError);
          Alert.alert(
            'Error',
            'Failed to create conversation: ' + insertError.message,
          );
          return;
        }

        if (newData) {
          console.log('New conversation created:', newData.id);
          sendFirstMsg(newData);
        } else {
          console.error('Insert returned no data');
        }
      }
    } catch (err: any) {
      console.error('handleContact exception:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View className="mb-4">
      <View className="bg-gray-200 p-3 mt-2 rounded-lg shadow-md flex-row justify-between relative">
        {user && user.id === tutorId ? (
          <TouchableOpacity
            onPress={async () => {
              const success = await publishUnpublishPost(postId, !isLive);
              if (success && onDelete) {
                onDelete();
              }
            }}
            className={`absolute top-0 right-0 px-2 py-1 rounded-lg rounded-tl-none ${
              isLive ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            <Text className="text-white text-xs font-bold">
              {isLive ? 'Unpublish' : 'Publish'}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View className="bg-white p-4 rounded-lg w-[72%] flex-col justify-between">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="font-bold text-lg">{subject}</Text>
              <Text className="text-gray-700 font-bold">{subjectLine}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">{level}</Text>
              {board ? (
                <Text className="text-sm text-gray-500">{board}</Text>
              ) : null}
              <Text className="text-sm text-gray-500">
                {mode == 'Both' ? 'Online & Offline' : mode}
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-gray-700">{desc}</Text>
          </View>
          <View className="text-gray-500 mb-[-10px] mt-2 flex-row justify-between items-center">
            <Text className="text-xs">{`Fees: ${minFees} - ${maxFees} per Hour`}</Text>

            <View className="flex-row items-center w-12 justify-between bg-gray-300 px-2 rounded-full">
              <FontAwesomeIcon icon={faEye} size={12} color={'black'} />
              <Text className="text-sm text-black">{displayViews}</Text>
            </View>
          </View>
        </View>
        <View className="flex-col justify-between mt-4">
          <View>
            <View className="flex-col justify-between items-center mt-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Routes.TUTOR_PROFILE as String, {
                    userId: tutorId as string,
                  })
                }
                className="h-12 w-12 bg-gray-100 rounded-full overflow-hidden items-center justify-center"
              >
                <Image
                  source={
                    typeof tutorImg === 'string' ? { uri: tutorImg } : tutorImg
                  }
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Text className="font-bold text-sm mt-2">{tutorName}</Text>

              <TouchableOpacity
                onPress={handleContact}
                className="mt-2 bg-blue-600 rounded-xl px-2 py-1"
              >
                <Text className="text-white text-sm font-bold">
                  Contact Tutor
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text className="text-sm text-gray-500">{`Posted ${postDate}`}</Text>
          </View>
        </View>
      </View>
      {freeDemo ? (
        <View className="bg-blue-100 p-2 pb-1 rounded-b-xl mt-[-5px] z-[-1]">
          <Text className="text-blue-800 text-center text-xs font-semibold">
            Free Demo Available
          </Text>
        </View>
      ) : null}
      {user && user.id === tutorId ? (
        <View className="h-6 flex-row mt-[-5px] z-[-2]">
          <TouchableOpacity
            onPress={onEdit}
            className="w-1/2 bg-green-600 flex-row justify-center items-center pt-2 h-8 rounded-bl-lg pb-2"
          >
            <FontAwesomeIcon
              icon={faPen}
              size={12}
              color={'white'}
              style={{ alignSelf: 'center', marginTop: 2 }}
            />
            <Text className="text-white text-center text-sm font-bold ml-2">
              Edit Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Warning!',
                'Are you sure you want to delete this post?',
                [
                  {
                    text: 'Yes',
                    style: 'cancel',
                    onPress: handleDelete,
                  },
                  {
                    text: 'No',
                  },
                ],
              )
            }
            className="w-1/2 bg-red-600 flex-row justify-center items-center pt-2 h-8 rounded-br-lg pb-2"
          >
            <FontAwesomeIcon
              icon={faTrash}
              size={12}
              color={'white'}
              style={{ alignSelf: 'center', marginTop: 2 }}
            />
            <Text className="text-white text-center text-sm font-bold ml-2">
              Delete Post
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default PostCard;
