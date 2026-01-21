import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UseAuthStore } from '../../store/AuthStore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker';
import languages from '../../data/languages.json';

const OtherDetails = () => {
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [nativeLang, setNativeLang] = useState('');
  const [bio, setBio] = useState('');
  const { prevStep, setData, updateProfile, data, uploadResume } =
    UseAuthStore();
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const user_type = data.user_type;

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ]);

  const [nativelangOpen, setNativelangOpen] = useState(false);
  const [nativelangItems, setNativelangItems] = useState(
    languages.map(lang => ({ label: lang.nativeName, value: lang.code })),
  );

  const [otherLanguages, setOtherLanguages] = useState<string[]>([]);
  const [otherLangOpen, setOtherLangOpen] = useState(false);
  const [otherLangItems, setOtherLangItems] = useState(
    languages.map(lang => ({ label: lang.nativeName, value: lang.code })),
  );
  const [resumeName, setResumeName] = useState('');

  const GetLocation = () => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setData('address', {
              latitude: latitude,
              longitude,
              pincode: null,
              city: null,
            });
          },
          error => {
            console.log('Error getting location', error);
          },
        );
      },
      error => {
        console.log('Location permission denied', error);
      },
    );
  };

  const handleCompleteProfile = () => {
    // Set individual fields in the global store
    setData('gender', gender);
    setData('native_language', nativeLang);
    setData('other_languages', otherLanguages);
    setData('bio', bio);
    // Merge address with city and pincode (convert pincode to number if needed)
    setData('address', {
      latitude: data.address?.latitude || null,
      longitude: data.address?.longitude || null,
      city,
      pincode: pincode ? parseInt(pincode, 10) : null,
    });

    // Now update the profile in Supabase
    updateProfile();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          className="px-6 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Almost there!
          </Text>
          <Text className="text-base text-gray-500 mb-8">
            Tell us a bit more about yourself to complete your profile.
          </Text>

          {/* Address (Using gps) */}
          <View className="mb-6">
            <TouchableOpacity
              className="bg-blue-600 rounded-xl p-3 justify-center items-center shadow-md active:bg-blue-700"
              onPress={() => GetLocation()}
            >
              <View className="flex flex-row items-center">
                <FontAwesomeIcon color="white" icon={faLocation} />
                <Text className="text-white font-bold ml-2">
                  Allow Location Access
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* city and zip code */}
          <View className="flex-row justify-between items-center">
            <View className="mb-6 w-1/2 mr-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                City
              </Text>
              <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <TextInput
                  placeholder="e.g. New York"
                  value={city}
                  onChangeText={setCity}
                  className="text-gray-800 text-base p-0"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View className="mb-6 w-1/2 ml-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Pin Code
              </Text>
              <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <TextInput
                  placeholder="e.g. 12345"
                  value={pincode}
                  onChangeText={setPincode}
                  className="text-gray-800 text-base p-0"
                  placeholderTextColor="#9CA3AF"
                  maxLength={6}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Gender (radio) and language dropdown */}
          <View className="flex-row justify-between items-center">
            <View className="mb-6 w-1/2 mr-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Gender
              </Text>
              <DropDownPicker
                open={genderOpen}
                value={gender}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={setGender}
                setItems={setGenderItems}
                placeholder="Select Gender"
                placeholderStyle={{ color: '#9CA3AF' }}
                containerStyle={{ height: 50 }}
                style={{ backgroundColor: '#fff', borderColor: '#E5E7EB' }}
                textStyle={{ color: '#374151' }}
                dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
                zIndex={1000}
                listMode="SCROLLVIEW"
              />
            </View>

            <View className="mb-6 w-1/2 mr-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Native Language
              </Text>
              <DropDownPicker
                open={nativelangOpen}
                value={nativeLang}
                items={nativelangItems}
                setOpen={setNativelangOpen}
                setValue={setNativeLang}
                setItems={setNativelangItems}
                placeholder="Select Native Language"
                placeholderStyle={{ color: '#9CA3AF' }}
                containerStyle={{ height: 50 }}
                style={{ backgroundColor: '#fff', borderColor: '#E5E7EB' }}
                textStyle={{ color: '#374151' }}
                dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
                zIndex={1000}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>

          {/* Native Lang */}

          {/* Other langs */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Other Languages
            </Text>
            <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <TouchableOpacity
                onPress={() => setOtherLangOpen(!otherLangOpen)}
                className="flex-row flex-wrap gap-2"
              >
                {otherLanguages.length > 0 ? (
                  otherLanguages.map(lang => (
                    <View
                      key={lang}
                      className="bg-blue-100 rounded-full px-3 py-1 flex-row items-center"
                    >
                      <Text className="text-blue-700 text-sm font-medium">
                        {
                          otherLangItems.find(item => item.value === lang)
                            ?.label
                        }
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setOtherLanguages(
                            otherLanguages.filter(l => l !== lang),
                          )
                        }
                        className="ml-2"
                      >
                        <Text className="text-blue-700 font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-400">Select languages...</Text>
                )}
              </TouchableOpacity>
            </View>

            {otherLangOpen && (
              <DropDownPicker
                open={otherLangOpen}
                value={otherLanguages}
                items={otherLangItems}
                setOpen={setOtherLangOpen}
                setValue={setOtherLanguages}
                setItems={setOtherLangItems}
                placeholder="Select Other Languages"
                placeholderStyle={{ color: '#9CA3AF' }}
                multiple={true}
                mode="BADGE"
                containerStyle={{ height: 50, marginTop: 8 }}
                style={{ backgroundColor: '#fff', borderColor: '#E5E7EB' }}
                textStyle={{ color: '#374151' }}
                dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
                zIndex={999}
                listMode="MODAL"
              />
            )}
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Bio
            </Text>
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
          {user_type === 'tutor' && (
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Resume
              </Text>
              <TouchableOpacity
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50 active:bg-gray-100"
                onPress={uploadResume}
              >
                <Text className="text-blue-600 font-bold text-base mb-1">
                  {data.resume_name ||
                    (data.resume_url ? 'Resume Uploaded' : 'Click to Upload')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleCompleteProfile}
            className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
          >
            <Text className="text-white font-bold text-lg">
              Complete Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={prevStep}
            className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-8"
          >
            <Text className="text-white font-bold text-lg">Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtherDetails;
