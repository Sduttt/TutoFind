import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignupStore } from '../../store/SignupStore';

const OtherDetails = () => {
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [nativeLang, setNativeLang] = useState('');
  const [bio, setBio] = useState('');
  const { prevStep } = useSignupStore();

  // Mock data for dropdowns (Logic would be expanded with a real dropdown component)
  const languages = ['English', 'Spanish', 'French', 'Hindi', 'Bengali'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Almost there!
        </Text>
        <Text className="text-base text-gray-500 mb-8">
          Tell us a bit more about yourself to complete your profile.
        </Text>

        {/* Address (Using gps) */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Address
          </Text>
          <View className="flex-row items-center space-x-3">
            <View className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <TextInput
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
                className="text-gray-800 text-base p-0"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity
              className="bg-blue-600 rounded-xl p-3 justify-center items-center shadow-md active:bg-blue-700"
              onPress={() => console.log('Get GPS Location')}
            >
              <Text className="text-white font-bold">GPS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gender (radio) */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Gender
          </Text>
          <View className="flex-row space-x-4">
            {['Male', 'Female', 'Other'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setGender(option as any)}
                className={`flex-1 py-3 px-4 rounded-xl border ${gender === option ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'} items-center justify-center shadow-sm`}
              >
                <Text
                  className={`font-medium ${gender === option ? 'text-white' : 'text-gray-700'}`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Native Lang */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Native Language
          </Text>
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <TextInput
              placeholder="e.g. English"
              value={nativeLang}
              onChangeText={setNativeLang}
              className="text-gray-800 text-base p-0"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Other langs */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Other Languages
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {['English', 'Hindi', 'Spanish'].map(lang => (
              <TouchableOpacity
                key={lang}
                className="bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
              >
                <Text className="text-gray-700 text-sm font-medium">
                  + {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bio */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Bio</Text>
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm h-32">
            <TextInput
              placeholder="Tell us about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
              className="text-gray-800 text-base p-0 h-full"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Resume (Upload) */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Resume
          </Text>
          <TouchableOpacity
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50 active:bg-gray-100"
            onPress={() => console.log('Upload Resume')}
          >
            <Text className="text-blue-600 font-bold text-base mb-1">
              Click to Upload
            </Text>
            <Text className="text-gray-400 text-xs">PDF, DOCX (Max 5MB)</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8">
          <Text className="text-white font-bold text-lg">Complete Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={prevStep}  className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8">
          <Text className="text-white font-bold text-lg">Back</Text>
        </TouchableOpacity >

      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherDetails;
