import { Text, Image, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { PostType } from '../types/Type';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTutorPosts } from '../hooks/useTutorPosts';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../navigation/routes';

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
              <Text className="text-gray-700">{subjectLine}</Text>
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
