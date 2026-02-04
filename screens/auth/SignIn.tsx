import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { UseAuthStore } from '../../store/AuthStore';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { Routes } from '../../navigation/routes';
import Components from '../../components/components';
import { useUserProfile } from '../../hooks/useUserProfile';

const SignIn = ({ navigation }: any) => {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const { user } = useUserProfile();

  const { signin, setData, sendPasswordResetMail, data, loading, error } =
    UseAuthStore();

  const handleSignIn = async () => {
    if (loading) return;
    const success = await signin();
    if (success) {
      const userType = UseAuthStore.getState().data.user_type;
      if (userType === 'tutor') {
        navigation.navigate(Routes.TUTOR_DASHBOARD);
      } else {
        navigation.navigate(Routes.STUDENT_HOME);
      }
    } else {
      Alert.alert(`Sign In Failed: ${error}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 mt-0 align-center justify-center">
      {loading && <Components.LOADING_COMP />}
      <Text className="text-3xl text-center font-bold text-blue-600 mb-8">
        {forgotPassword ? `Reset Password` : `Sign In`}
      </Text>

      <View className="mb-4">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white">
          <View className="mr-3">
            <FontAwesomeIcon icon={faEnvelope} size={18} color="#9CA3AF" />
          </View>
          <TextInput
            className="flex-1 text-gray-800 text-base"
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={data.email}
            onChangeText={text => {
              setData('email', text);
              if (emailError) setEmailError(''); // Clear error on change
            }}
          />
        </View>
        {emailError ? (
          <Text className="text-red-500 mt-2">{emailError}</Text>
        ) : null}
      </View>

      {!forgotPassword && (
        <View className="mb-4">
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white">
            <View className="mr-3">
              <FontAwesomeIcon icon={faLock} size={18} color="#9CA3AF" />
            </View>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={data.password}
              onChangeText={text => {
                setData('password', text);
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text className="text-red-500">{passwordError}</Text>
          ) : null}

          {!forgotPassword && (
            <View className="flex-row justify-center mt-2">
              <Text>Forgot Password? </Text>
              <TouchableOpacity onPress={() => setForgotPassword(true)}>
                <Text className="text-blue-600 font-bold">Reset Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {forgotPassword ? (
        <View className="mb-4">
          <TouchableOpacity
            onPress={() => {
              sendPasswordResetMail();
            }}
            className="bg-button rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mt-6"
          >
            <Text className="text-white font-bold text-lg">Send Link</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mb-4">
          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-button rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mt-6"
          >
            <Text className="text-white font-bold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      {forgotPassword ? (
        <View className="flex-row justify-center mt-2">
          <Text>Or </Text>
          <TouchableOpacity onPress={() => setForgotPassword(false)}>
            <Text className="text-blue-600 font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row justify-center mt-2">
          <Text>New User? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.SIGNUP)}>
            <Text className="text-blue-600 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SignIn;
