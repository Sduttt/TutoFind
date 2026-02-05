import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UseAuthStore } from '../store/AuthStore';
import { Routes } from '../navigation/routes';
import { CommonActions } from '@react-navigation/native';
import { useUserProfile } from '../hooks/useUserProfile';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { user } = useUserProfile();
  const signout = UseAuthStore(state => state.signout);
  const resetAuth = UseAuthStore(state => state.reset);

  const handleSignOut = async () => {
    await signout();
    resetAuth();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Routes.SIGNIN }],
      }),
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: 0,
        paddingLeft: 0,
      }}
    >
      <View className="bg-blue-500 items-center p-5 pt-6 w-[120%] ml-[-20px] rounded-tl-2xl ">
        <View className="bg-white rounded-full p-0.5 mb-3 shadow-lg elevation-5">
          {user?.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              className="w-[90px] h-[90px] rounded-full border-[3px] border-white"
              resizeMode="cover"
            />
          ) : (
            <View className="w-[90px] h-[90px] rounded-full bg-gray-100 justify-center items-center border-[3px] border-white">
              <FontAwesomeIcon icon={faUser} size={40} color="#9CA3AF" />
            </View>
          )}
        </View>
        <Text className="text-white text-xl font-bold mb-1">
          {user?.full_name || 'User'}
        </Text>
        <Text className="text-white/80 text-sm mb-6" numberOfLines={1}>
          {user?.email || ''}
        </Text>
      </View>

      <View className="pt-2 px-3">
        <TouchableOpacity
          className="flex-row items-center p-3.5 rounded-xl mb-1"
          onPress={() => props.navigation.navigate(Routes.TUTOR_DASHBOARD)}
        >
          <FontAwesomeIcon icon={faUser} size={20} color="#374151" />
          <Text className="ml-4 text-[#374151] font-semibold text-base">
            View Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center p-3.5 rounded-xl mb-1"
          onPress={handleSignOut}
        >
          <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#EF4444" />
          <Text className="ml-4 text-[#EF4444] font-semibold text-base">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
