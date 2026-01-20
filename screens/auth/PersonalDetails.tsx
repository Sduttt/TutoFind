import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Alert,
  Image,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSignupStore } from '../../store/SignupStore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faUser,
  faEnvelope,
  faLock,
  faEyeSlash,
  faEye,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

type Props = {};

const PersonalDetails = (props: Props) => {
  const {
    data,
    error,
    nextStep,
    setData,
    signup,
    verifyEmail,
    resendEmailVerification,
    uploadAvatar,
  } = useSignupStore();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sheetRef = useRef<BottomSheet>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const isValidPassword = (password: string) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= minLength &&
      hasUpper &&
      hasLower &&
      hasNumber &&
      hasSpecial
    );
  };

  const validateFields = () => {
    let isValid = true;

    // Full Name
    const trimmedName = data.full_name.trim();
    if (!trimmedName) {
      setNameError('Full name is required.');
      isValid = false;
    } else if (trimmedName.length < 2) {
      setNameError('Full name must be at least 2 characters.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Email
    const trimmedEmail = data.email.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password
    if (!data.password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (!isValidPassword(data.password)) {
      setPasswordError(
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const UserSignup = () => {
    if (!validateFields()) return;
    setIsModalVisible(true);
    signup();
  };

  const EmailVerification = async () => {
    const verified = await verifyEmail(data.email, data.otp!);
    if (verified) {
      setOtpVerified(true);
      nextStep();
    } else {
      setOtpVerified(false);
    }
  };

  const OtpResend = async () => {
    const emailSent = await resendEmailVerification(data.email);
    if (emailSent) {
      Alert.alert('Success', 'OTP has been resent to your email.');
    } else {
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    }
  };

  const CapturePhotoFromCam = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      compressImageQuality: 0.7,
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => {
        setData('avatar', image);
        sheetRef.current?.close();
        setIsSheetOpen(false);
        uploadAvatar();
      })
      .catch(error => {
        console.log(
          'User cancelled image selection or error occurred: ',
          error,
        );
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
      .then(image => {
        setData('avatar', image);
        sheetRef.current?.close();
        setIsSheetOpen(false);
        uploadAvatar();
      })
      .catch(error => {
        console.log(
          'User cancelled image selection or error occurred: ',
          error,
        );
      });
  };

  useEffect(() => {
    if (confirmPassword && data.password && confirmPassword !== data.password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword, data.password]);

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 px-6 mt-6"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {/* Image Upload */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={() => setIsSheetOpen(true)}
              className="relative h-28 w-28"
            >
              <View className="h-full w-full bg-gray-100 rounded-full overflow-hidden items-center justify-center border-2 border-dashed border-gray-300">
                {data.avatar_url || data.avatar?.path ? (
                  <Image
                    source={{ uri: data.avatar_url || data.avatar?.path }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : null}
              </View>

              {!data.avatar_url && (
                <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white z-10">
                  <FontAwesomeIcon icon={faCamera} size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
            {data.avatar_url || data.avatar?.path ? (
              <TouchableOpacity onPress={() => setIsSheetOpen(true)}>
                <Text className="text-gray-500 text-sm mt-3">
                  Change Profile Picture
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-500 text-sm mt-3">
                Upload Profile Picture
              </Text>
            )}
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Full Name
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white">
              <View className="mr-3">
                <FontAwesomeIcon icon={faUser} size={18} color="#9CA3AF" />
              </View>
              <TextInput
                className="flex-1 text-gray-800 text-base"
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={data.full_name}
                onChangeText={text => {
                  setData('full_name', text);
                  if (nameError) setNameError(''); // Clear error on change
                }}
              />
            </View>
            {nameError ? (
              <Text className="text-red-500 mt-1 ml-1 text-sm">
                {nameError}
              </Text>
            ) : null}
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Email Address
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white">
              <View className="mr-3">
                <FontAwesomeIcon icon={faEnvelope} size={18} color="#9CA3AF" />
              </View>
              <TextInput
                className="flex-1 text-gray-800 text-base"
                placeholder="john@example.com"
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

          {/* Password */}

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
                  // if (confirmPasswordError) setConfirmPasswordError('');
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
          <View className="mb-8">
            <TouchableOpacity
              onPress={UserSignup}
              className="bg-button rounded-xl py-4 items-center shadow-lg active:bg-blue-700 mt-6"
            >
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            </TouchableOpacity>
          </View>
          {/* Otp */}

          <Modal
            visible={isModalVisible}
            animationType="fade"
            transparent={true}
          >
            <View className="bg-black/50 flex-1 justify-center items-center">
              <View className="mt-8 items-center bg-white rounded-xl p-6 mx-4 shadow-lg">
                {
                  error ? (
                    <>
                      <Text className="text-red-500 text-lg font-semibold mb-4">
                        Signup Failed
                      </Text>
                      <Text className="text-gray-700 mb-6">{error}</Text>
                      <TouchableOpacity
                        onPress={() => setIsModalVisible(false)}
                        className="bg-button rounded-xl py-3 px-6 items-center shadow-lg active:bg-blue-700"
                      >
                        <Text className="text-white font-bold text-lg">
                          Close
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text className="text-2xl font-bold mb-4">
                        Verify Your Email
                      </Text>
                      <Text className="text-center text-gray-700 mb-6 px-8">
                        We sent an OTP to your email address:{data.email} . Please enter it to
                        verify your account.
                      </Text>
                      <TextInput
                        className="w-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-gray-800 text-base mb-4"
                        placeholder="Enter OTP"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        maxLength={8}
                        onChangeText={text => setData('otp', text)}
                      />
                      {data.otp && data.otp.trim().length !== 8 && (
                        <Text className="text-red-500">
                          Please enter a valid 8-digit OTP
                        </Text>
                      )}
                      {!otpVerified && error && (
                        <>
                          <Text className="text-red-500 mb-2">
                            OTP Verification Failed: {error}
                          </Text>
                          <TouchableOpacity
                            onPress={OtpResend}
                            className="bg-button rounded-xl px-6 py-4 items-center shadow-lg active:bg-blue-700 mt-2 w-2/3"
                          >
                            <Text className="text-white font-bold text-lg">
                              Resend OTP
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}

                      <View className="flex-row mt-6">
                        <TouchableOpacity
                        onPress={EmailVerification}
                        className="bg-button rounded-xl px-6 py-4 items-center shadow-lg active:bg-blue-700 mt-2 w-1/2 mr-2"
                      >
                        <Text className="text-white font-bold text-lg">
                          Verify
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => resendEmailVerification(data.email)}
                        className="bg-button rounded-xl px-6 py-4 items-center shadow-lg active:bg-blue-700 mt-2 w-1/2 ml-2"
                      >
                        <Text className="text-white font-bold text-lg">
                          Resend OTP
                        </Text>
                      </TouchableOpacity>
                      </View>
                    </>
                  )
                }
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomSheet
        ref={sheetRef}
        index={isSheetOpen ? 0 : -1}
        snapPoints={['20%']}
        enablePanDownToClose={true}
        onClose={() => setIsSheetOpen(false)}
        backgroundStyle={{
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,

          // iOS shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,

          // Android shadow
          elevation: 25,
        }}
      >
        <BottomSheetView className="flex-row justify-center items-center">
          <TouchableOpacity onPress={CapturePhotoFromCam} className="mx-4">
            <FontAwesomeIcon icon={faCamera} size={48} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={UploadFromGlry} className="mx-4">
            <FontAwesomeIcon icon={faFolder} size={48} color="#9CA3AF" />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default PersonalDetails;
