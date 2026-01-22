import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { UseAuthStore } from '../../store/AuthStore';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { Routes } from '../../navigation/routes';

const ResetPassword = ({ navigation }: any) => {
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { passwordReset, setData, data } = UseAuthStore();

  const UpdatePassword = () => {
    passwordReset();
    navigation.navigate(Routes.SIGNIN);
  };

  useEffect(() => {
      if (confirmPassword && data.password && confirmPassword !== data.password) {
        setConfirmPasswordError('Passwords do not match.');
      } else {
        setConfirmPasswordError('');
      }
    }, [confirmPassword, data.password]);

  return (
    <SafeAreaView className="flex-1 bg-white px-6 mt-0 align-center justify-center">
      <Text className="text-3xl text-center font-bold text-blue-600 mb-8">
        Reset Password
      </Text>

      <View className="mb-4">
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">
            Password
          </Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white">
            <View className="mr-3">
              <FontAwesomeIcon icon={faLock} size={18} color="#9CA3AF" />
            </View>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={data.password}
              onChangeText={text => {
                setData('password', text);
                if (passwordError) setPasswordError(''); // Clear error on change
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
        </View>

        {/* Confirm Password */}

        <View className="mb-8">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">
            Confirm Password
          </Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white">
            <View className="mr-3">
              <FontAwesomeIcon icon={faLock} size={18} color="#9CA3AF" />
            </View>
            <TextInput
              className="flex-1 text-gray-800 text-base"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text className="text-red-500 mt-2">{confirmPasswordError}</Text>
          ) : null}
        </View>
        {/* Signup */}
        <View className="mb-4">
          <TouchableOpacity
            onPress={UpdatePassword}
            className="bg-button rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mt-6"
          >
            <Text className="text-white font-bold text-lg">Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
