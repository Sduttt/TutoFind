import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faLanguage,
  faLocationPin,
  faMars,
  faPen,
  faVenus,
} from '@fortawesome/free-solid-svg-icons';
import { getUserProfile } from '../services/userService';
import Components from './components';
import languages from '../data/languages.json';
import { UseAuthStore } from '../store/AuthStore';
import { Routes } from '../navigation/routes';

const Profile = ({
  navigation,
  userId,
}: {
  navigation: any;
  userId: string;
}) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signout, userId: id } = UseAuthStore();

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error: apiError } = await getUserProfile(userId);
    if (apiError) {
      setError(apiError);
    } else {
      setUserProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  const primaryLanguage = userProfile?.native_language
    ? getLanguageName(userProfile.native_language)
    : '';

  const secondaryLanguages = Array.isArray(userProfile?.other_languages)
    ? userProfile.other_languages
        .map((code: string) => getLanguageName(code))
        .join(', ')
    : '';

  const address =
    typeof userProfile?.address === 'string'
      ? JSON.parse(userProfile.address)
      : userProfile?.address;

  if (loading) return <Components.LOADING_COMP />;
  if (error) return <Components.ERROR_COMP error={error} />;

  return (
    <View className="flex-1 bg-white">
      <Components.USER_DASHBOARD_HEADER user={userProfile} />

      {/* Bio Section */}
      <View className="mt-4 mx-4">
        <Text className="text-lg font-bold">Bio</Text>
        <View className="mt-2 h-24 border border-gray-300 rounded-lg p-2">
          <Text className="text-gray-500">{userProfile?.bio}</Text>
        </View>
      </View>

      {/* Gender Section */}
      <View className="flex-row items-center justify-start">
        <View className="mt-4 mx-4 w-[40%]">
          <Text className="text-lg font-bold">Gender</Text>
          <View className="flex-row items-center mt-2">
            <FontAwesomeIcon
              icon={
                userProfile?.gender?.toLowerCase() === 'male' ? faMars : faVenus
              }
              size={20}
              color="gray"
            />
            <Text className="text-gray-500 ml-2 capitalize">
              {userProfile?.gender}
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
      {/* Buttons Section */}
      {id === userId && (
        <>
          <View className="mx-4 mt-6 mb-20">
            {/* Posts Section */}
            {userProfile?.user_type === 'tutor' ? (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate(Routes.CREATE_POST)}
                  className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
                >
                  <Text className="text-white font-bold text-lg">
                    CREATE POST
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate(Routes.VIEW_POSTS)}
                  className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
                >
                  <Text className="text-white text-center w-full font-bold text-lg">
                    VIEW POST
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.STUDENT_HOME)}
                className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
              >
                <Text className="text-white text-center w-full font-bold text-lg">
                  VIEW POST
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                signout();
                navigation.navigate(Routes.SIGNIN);
              }}
              className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
            >
              <Text className="text-white font-bold text-lg">SIGN OUT</Text>
            </TouchableOpacity>
          </View>

          <View className="absolute bottom-4 right-4 items-center justify-center h-16 w-16 bg-blue-500 rounded-full p-2">
            <FontAwesomeIcon icon={faPen} size={20} color="white" />
          </View>
        </>
      )}
    </View>
  );
};

export default Profile;
