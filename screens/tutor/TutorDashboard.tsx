import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Components from '../../components/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile } from '../../hooks/useUserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import languages from '../../data/languages.json';
import {
  faLanguage,
  faLocationPin,
  faMars,
  faPen,
  faVenus,
} from '@fortawesome/free-solid-svg-icons';
import { UseAuthStore } from '../../store/AuthStore';
import { Routes } from '../../navigation/routes';

const TutorDashboard = ({ navigation }: { navigation: any }) => {
  const { user, loading, error } = useUserProfile();
  const { signout } = UseAuthStore();

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  const primaryLanguage = user?.native_language
    ? getLanguageName(user.native_language)
    : '';

  const secondaryLanguages = Array.isArray(user?.other_languages)
    ? user.other_languages
      .map((code: string) => getLanguageName(code))
      .join(', ')
    : '';

  // Parse address if it's a string
  const address =
    typeof user?.address === 'string'
      ? JSON.parse(user.address)
      : user?.address;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading ? (
        <Components.LOADING_COMP />
      ) : error ? (
        <Components.ERROR_COMP error={error} />
      ) : (
        <>
          <Components.TUTOR_DASHBOARD_HEADER />
          {/* Bio Section */}
          <View className="mt-4 mx-4">
            <Text className="text-lg font-bold">Bio</Text>
            <View className="mt-2 h-24 border border-gray-300 rounded-lg p-2">
              <Text className="text-gray-500">{user?.bio}</Text>
            </View>
          </View>

          {/* Gender Section */}
          <View className="flex-row items-center justify-start">
            <View className="mt-4 mx-4 w-[40%]">
              <Text className="text-lg font-bold">Gender</Text>
              <View className="flex-row items-center mt-2">
                <FontAwesomeIcon
                  icon={
                    user?.gender?.toLowerCase() === 'male' ? faMars : faVenus
                  }
                  size={20}
                  color="gray"
                />
                <Text className="text-gray-500 ml-2 capitalize">
                  {user?.gender}
                </Text>
              </View>
            </View>

            {/* Address Section */}
            <View className="mt-4 mx-4 w-[40%]">
              <Text className="text-lg font-bold">Address</Text>
              <View className="mt-2 flex-row">
                <FontAwesomeIcon icon={faLocationPin} size={20} color="gray" />
                <Text className="text-gray-500 ml-2">
                  {address?.city
                    ? `${address.city}, ${address.pincode}`
                    : 'Not provided'}
                </Text>
              </View>
            </View>
          </View>

          {/* Language Section */}

          <View className="flex-row items-center justify-start">
            <View className="mt-4 mx-4 w-[40%]">
              <Text className="text-lg font-bold">Primary Language</Text>
              <View className="flex-row items-center mt-2">
                <FontAwesomeIcon icon={faLanguage} size={20} color="gray" />
                <Text className="text-gray-500 ml-2">{primaryLanguage}</Text>
              </View>
            </View>

            <View className="mt-4 mx-4 w-[45%]">
              <Text className="text-lg font-bold">Secondary Languages</Text>
              <View className="mt-2 flex-row items-center">
                <FontAwesomeIcon icon={faLanguage} size={20} color="gray" />
                <Text className="text-gray-500 ml-2" numberOfLines={2}>
                  {secondaryLanguages || 'None'}
                </Text>
              </View>
            </View>



          </View>

          <View className="mx-4 mt-6 mb-20">
            {/* Posts sSection */}
            <TouchableOpacity onPress={() => navigation.navigate(Routes.CREATE_POST)} className='bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8'>
              <Text className="text-white font-bold text-lg">CREATE POST</Text>
            </TouchableOpacity>

            <TouchableOpacity className='bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8'>
              <Text className="text-white text-center w-full font-bold text-lg">VIEW POST</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={
              () => {
                signout()
                navigation.navigate(Routes.SIGNIN)
              }
            } className='bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8'>
              <Text className="text-white font-bold text-lg">SIGN OUT</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Button */}
          <View className="absolute bottom-4 right-4 items-center justify-center h-16 w-16 bg-blue-500 rounded-full p-2">
            <FontAwesomeIcon icon={faPen} size={20} color="white" />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default TutorDashboard;
