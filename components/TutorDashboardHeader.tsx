import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const TutorDashboardHeader = () => {
  const { user } = useUserProfile();

  return (
    <View className="flex-row justify-between items-start p-4">
      {/* Left */}
      <View className="flex-row items-start">
        <View className="border-2 border-blue-500 rounded-full w-32 h-32 flex items-center justify-center">
          <View className="h-28 w-28 bg-gray-100 rounded-full overflow-hidden items-center justify-center">
            <Image
              source={{ uri: user?.avatar_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
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
              {user?.subscription_type.toUpperCase()} USER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Right */}
      <TouchableOpacity className="mt-6 relative">
        <FontAwesomeIcon icon={faComment} size={24} />
        <View className="absolute top-[-5px] right-[-5px]">
          <View className="bg-red-500 rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-white text-xs">2</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TutorDashboardHeader;
