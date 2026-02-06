import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faUser,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useUserProfile } from '../../hooks/useUserProfile';
import { UseAuthStore } from '../../store/AuthStore';
import languages from '../../data/languages.json';
import Components from '../../components/components';
import Geolocation from '@react-native-community/geolocation';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const UpdateUserDetails = ({ navigation }: { navigation: any }) => {
  const { user, loading: profileLoading, refetch } = useUserProfile();
  const {
    data,
    setData,
    updateProfile,
    uploadAvatar,
    loading: authLoading,
    userId,
  } = UseAuthStore();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ['25%'], []);

  // Dropdown States
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

  const [otherLangOpen, setOtherLangOpen] = useState(false);
  const [otherLangItems, setOtherLangItems] = useState(
    languages.map(lang => ({ label: lang.nativeName, value: lang.code })),
  );

  useEffect(() => {
    if (user) {
      setData('full_name', user.full_name || '');
      setData('bio', user.bio || '');
      setData('gender', user.gender || '');
      setData('native_language', user.native_language || '');
      setData('other_languages', user.other_languages || []);
      setData('avatar_url', user.avatar_url || '');

      const address =
        typeof user.address === 'string'
          ? JSON.parse(user.address)
          : user.address;

      getLocation();

      setData('address', {
        ...data.address,
        city: address?.city || '',
        pincode: address?.pincode || null,
      } as any);
    }
  }, [user]);

  const getLocation = () => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setData('address', {
              ...data.address,
              latitude,
              longitude,
            } as any);
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

  const CapturePhotoFromCam = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      compressImageQuality: 0.7,
      mediaType: 'photo',
      cropping: true,
    })
      .then(async image => {
        setData('avatar', image);
        bottomSheetRef.current?.close();
        setIsSheetOpen(false);
        await uploadAvatar();
      })
      .catch(error => {
        console.log('User cancelled camera or error: ', error);
      });
  };

  const UploadFromGlry = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
      mediaType: 'photo',
    })
      .then(async image => {
        setData('avatar', image);
        bottomSheetRef.current?.close();
        setIsSheetOpen(false);
        await uploadAvatar();
      })
      .catch(error => {
        console.log('User cancelled picker or error: ', error);
      });
  };

  const handleUpdate = async () => {
    if (!data.full_name.trim()) {
      Alert.alert('Error', 'Full Name is required');
      return;
    }

    const success = await updateProfile();

    if (!success) {
      Alert.alert('Error', 'Failed to update profile');
    } else {
      Alert.alert('Success', 'Profile updated successfully');
      refetch();
      navigation.goBack();
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  if (profileLoading) return <Components.LOADING_COMP />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {authLoading && <Components.LOADING_COMP />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-2 border-b border-gray-100">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 ml-2">
            Edit Profile
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View className="items-center mt-6 mb-8">
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.expand();
                setIsSheetOpen(true);
              }}
              className="relative"
            >
              <View className="w-32 h-32 rounded-full border-4 border-blue-500 items-center justify-center overflow-hidden bg-gray-100">
                {data.avatar_url || data.avatar?.path ? (
                  <Image
                    source={{ uri: data.avatar_url || data.avatar?.path }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} size={60} color="#9CA3AF" />
                )}
              </View>
              <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white shadow-sm">
                <FontAwesomeIcon icon={faCamera} size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-blue-600 font-medium mt-3">
              Change Profile Picture
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </Text>
            <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <TextInput
                placeholder="Enter your full name"
                value={data.full_name}
                onChangeText={text => setData('full_name', text)}
                className="text-gray-800 text-base p-0"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Bio
            </Text>
            <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm h-24">
              <TextInput
                placeholder="Tell us about yourself..."
                value={data.bio}
                onChangeText={text => setData('bio', text)}
                multiline
                textAlignVertical="top"
                className="text-gray-800 text-base p-0 h-full"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="flex-row mb-6 z-[3000]">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Gender
              </Text>
              <DropDownPicker
                open={genderOpen}
                value={data.gender}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={callback => {
                  const value =
                    typeof callback === 'function'
                      ? callback(data.gender)
                      : callback;
                  setData('gender', value);
                }}
                setItems={setGenderItems}
                placeholder="Select"
                style={{ borderColor: '#E5E7EB', borderRadius: 12 }}
                dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
                listMode="SCROLLVIEW"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Native Language
              </Text>
              <DropDownPicker
                open={nativelangOpen}
                value={data.native_language}
                items={nativelangItems}
                setOpen={setNativelangOpen}
                setValue={callback => {
                  const value =
                    typeof callback === 'function'
                      ? callback(data.native_language)
                      : callback;
                  setData('native_language', value);
                }}
                setItems={setNativelangItems}
                placeholder="Select"
                style={{ borderColor: '#E5E7EB', borderRadius: 12 }}
                dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>

          <View className="mb-6 z-[2000]">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Secondary Languages
            </Text>
            <DropDownPicker
              multiple={true}
              open={otherLangOpen}
              value={data.other_languages}
              items={otherLangItems}
              setOpen={setOtherLangOpen}
              setValue={callback => {
                const value =
                  typeof callback === 'function'
                    ? callback(data.other_languages)
                    : callback;
                setData('other_languages', value);
              }}
              setItems={setOtherLangItems}
              mode="BADGE"
              placeholder="Select Languages"
              style={{ borderColor: '#E5E7EB', borderRadius: 12 }}
              dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
              listMode="MODAL"
              badgeColors={['#DBEAFE']}
              badgeTextStyle={{ color: '#1D4ED8' }}
            />
          </View>

          <View className="flex-row mb-8">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                City
              </Text>
              <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <TextInput
                  placeholder="City"
                  value={data.address?.city || ''}
                  onChangeText={text =>
                    setData('address', { ...data.address, city: text } as any)
                  }
                  className="text-gray-800 text-base p-0"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Pin Code
              </Text>
              <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <TextInput
                  placeholder="Pincode"
                  value={data.address?.pincode?.toString() || ''}
                  onChangeText={text =>
                    setData('address', {
                      ...data.address,
                      pincode: text ? parseInt(text, 10) : null,
                    } as any)
                  }
                  className="text-gray-800 text-base p-0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleUpdate}
            className="bg-blue-600 rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mb-10"
          >
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setIsSheetOpen(false)}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView className="flex-row justify-center items-center py-6">
          <TouchableOpacity
            onPress={CapturePhotoFromCam}
            className="mx-6 items-center"
          >
            <View className="bg-blue-50 p-4 rounded-2xl">
              <FontAwesomeIcon icon={faCamera} size={32} color="#1D4ED8" />
            </View>
            <Text className="text-blue-700 font-medium mt-2">Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={UploadFromGlry}
            className="mx-6 items-center"
          >
            <View className="bg-blue-50 p-4 rounded-2xl">
              <FontAwesomeIcon icon={faFolder} size={32} color="#1D4ED8" />
            </View>
            <Text className="text-blue-700 font-medium mt-2">Gallery</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = {
  sheetBackground: {
    backgroundColor: '#aab7c9ae',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 25,
  },
};

export default UpdateUserDetails;
