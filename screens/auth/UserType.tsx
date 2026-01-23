import { View, Text, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { UseAuthStore } from '../../store/AuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes } from '../../navigation/routes';

const UserType = () => {
  const navigation = useNavigation<any>();
  const { step, nextStep, setData } = UseAuthStore();

  const handleNext = () => {
    nextStep();
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 mt-0 align-center justify-center">
      <Text className="text-3xl text-center font-semibold text-gray-900 mb-2">
        Welcome to
      </Text>
      <Text className="text-3xl text-center font-bold text-blue-600 mb-8">
        TutoFind
      </Text>
      <Text className="text-center text-xl font-semibold mb-6">
        {' '}
        Please select your user type:{' '}
      </Text>
      <View>
        <TouchableOpacity
          onPress={() => {
            setData('user_type', 'student');
            handleNext();
          }}
          className="bg-button rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
        >
          <Text className="text-white font-bold text-lg">Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setData('user_type', 'tutor');
            handleNext();
          }}
          className="bg-button rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
        >
          <Text className="text-white font-bold text-lg">Tutor</Text>
        </TouchableOpacity>
        <TouchableOpacity className=""></TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-8">
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.SIGNIN)}>
          <Text className="text-blue-600 font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserType;
