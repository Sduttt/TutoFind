import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Image as PickerImage } from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { pick } from '@react-native-documents/picker';
import { Alert } from 'react-native';

declare global {
  const atob: (input: string) => string;
}

interface SignupData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  otp: string | null;
  user_type: 'student' | 'tutor' | 'admin';
  subscription_type: 'free' | 'silver' | 'gold';
  email_verified?: boolean;
  avatar?: PickerImage | null;
  avatar_url?: string;
  address?: {
    latitude: number | null;
    longitude: number | null;
    pincode: number | null;
    city: string | null;
  } | null;
  gender: string;
  native_language: string;
  other_languages: string[];
  bio: string;
  resume_url: string;
  resume_name: string;
}

interface AuthStore {
  data: SignupData;
  step: number;
  loading: boolean;
  userId: string | null;
  error: string | null;
  setData: <K extends keyof SignupData>(key: K, value: SignupData[K]) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  clearError: () => void;
  signup: () => Promise<boolean>;
  signin: () => Promise<boolean>;
  uploadAvatar: () => Promise<boolean>;
  uploadResume: () => Promise<boolean>;
  updateProfile: () => Promise<boolean>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  resendEmailVerification: (email: string) => Promise<boolean>;
  sendPasswordResetMail: () => Promise<boolean>;
  passwordReset: () => Promise<boolean>;
  reset: () => void;
}

export const UseAuthStore = create<AuthStore>((set, get) => ({
  data: {
    full_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'student',
    subscription_type: 'free',
    email_verified: false,
    otp: null,
    avatar: null,
    avatar_url: '',
    address: {
      latitude: null,
      longitude: null,
      pincode: null,
      city: null,
    },
    gender: '',
    native_language: '',
    other_languages: [],
    bio: '',
    resume_url: '',
    resume_name: '',
  },
  step: 1,
  loading: false,
  error: null,
  userId: null,

  setData: (key, value) =>
    set(state => ({
      data: { ...state.data, [key]: value as any },
      error: null,
    })),

  clearError: () => set({ error: null }),

  setStep: step => set({ step, error: null }),

  nextStep: () =>
    set(state => ({ step: Math.min(state.step + 1, 3), error: null })),

  prevStep: () =>
    set(state => ({ step: Math.max(state.step - 1, 1), error: null })),

  signup: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    if (!data.full_name.trim()) {
      set({
        loading: false,
        error: 'Signup Validation Error: Full name is required.',
      });
      return false;
    }
    if (!data.email.trim()) {
      set({
        loading: false,
        error: 'Signup Validation Error: Email is required.',
      });
      return false;
    }
    if (!data.password.trim()) {
      set({
        loading: false,
        error: 'Signup Validation Error: Password is required.',
      });
      return false;
    }

    set({ loading: true, error: null });

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.log(authError);
        throw authError;
      } else {
        console.log('Signup successful:', authData);
      }

      set({
        loading: false,
        userId: authData.user?.id || null,
      });

      if (data.avatar && authData.user?.id) {
        console.log('Uploading avatar for user:', authData.user.id);
        await get().uploadAvatar();
        console.log('Avatar upload completed');
      }
      return true;
    } catch (error: any) {
      set({ loading: false, error: `Signup Error: ${error.message}` });
      return false;
    }
  },

  signin: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    if (!data.email.trim()) {
      set({
        loading: false,
        error: 'Signin Validation Error: Email is required.',
      });
      console.log('Signin Validation Error: Email is required.');
      return false;
    }
    if (!data.password.trim()) {
      set({
        loading: false,
        error: 'Signin Validation Error: Password is required.',
      });
      console.log('Signin Validation Error: Password is required.');
      return false;
    }

    set({ loading: true, error: null });

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        console.log(authError);
        throw authError;
      } else {
        console.log('Signin successful:', authData);
      }

      set({ loading: false, userId: authData.user?.id || null });
      return true;
    } catch (error: any) {
      set({ loading: false, error: `Signin Error: ${error.message}` });
      return false;
    }
  },

  updateProfile: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    try {
      await supabase
        .from('profiles')
        .update({
          user_type: data.user_type,
          subscription_type: data.subscription_type,
          full_name: data.full_name,
          email: data.email,
          email_verified: data.email_verified,
          avatar_url: data.avatar_url || null,
          phone: data.phone,
          gender: data.gender,
          native_language: data.native_language,
          other_languages: data.other_languages,
          bio: data.bio,
          resume_url: data.resume_url || null,
          address: data.address,
        })
        .eq('id', get().userId);

      set({ loading: false });
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'View Profile',
          onPress: () => {
            //TODO: Navigate to profile screen
          },
        },
      ]);
      return true;
    } catch (error: any) {
      set({ loading: false, error: `Profile Update Error: ${error.message}` });
      return false;
    }
  },

  verifyEmail: async (email: string, otp: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup',
      });
      if (error) {
        throw error;
      }
      set({ loading: false, data: { ...get().data, email_verified: true } });
      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: `Email Verification Error: ${error.message}`,
      });
      return false;
    }
  },

  resendEmailVerification: async (email: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.resend({
        email: email,
        type: 'signup',
      });
      if (error) {
        throw error;
      }
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({ loading: false, error: `Resend OTP Error: ${error.message}` });
      return false;
    }
  },

  uploadAvatar: async () => {
    const { data, userId } = get();
    if (!data.avatar || !userId) {
      console.log('No avatar or userId, skipping upload');
      return false;
    }

    set({ loading: true, error: null });

    try {
      const fileExt = data.avatar.path.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `avatar-${userId}.${fileExt}`;
      const base64 = await RNFS.readFile(data.avatar.path, 'base64');
      const buffer = Buffer.from(base64, 'base64');
      const filePath = fileName;

      // Check for ANY existing avatar for this user (avatar-{userId}.*) to prevent duplicates
      const { data: listData } = await supabase.storage
        .from('avatars')
        .list('', { search: `avatar-${userId}.` });

      if (listData && listData.length > 0) {
        const filesToRemove = listData.map(f => f.name);
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove(filesToRemove);

        if (removeError) {
          console.log('Error removing existing file:', removeError);
          return false;
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, buffer, {
          contentType: data.avatar.mime || 'image/jpeg',
          upsert: true,
        });
      if (uploadError) {
        console.log('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      set({
        data: { ...data, avatar_url: avatarUrl },
        loading: false,
      });
      return true;
    } catch (error: any) {
      console.log('Avatar upload error:', error);
      set({ loading: false, error: `Avatar Upload Error: ${error.message}` });
      return false;
    }
  },

  uploadResume: async () => {
    const { data, userId } = get();
    if (!userId) {
      console.log('No userId, skipping resume upload');
      return false;
    }

    set({ loading: true, error: null });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    console.log('Current Session:', session);
    console.log('Session User ID:', session?.user?.id);
    console.log('Store User ID:', userId);

    if (!session?.user) {
      console.log('No active session found during resume upload');
      set({
        loading: false,
        error: 'Authentication error: Please log in again.',
      });
      return false;
    }

    const pdfType = 'application/pdf';

    try {
      const [result] = await pick({
        type: [pdfType],
      });

      if (!result) {
        set({ loading: false });
        return false;
      }

      if (!result.type || result.type !== pdfType) {
        set({
          loading: false,
          error: 'Invalid file type. Only PDF is allowed.',
        });
        return false;
      }

      if (!result.size || result.size > 1048576) {
        set({ loading: false, error: 'File size exceeds 1MB limit.' });
        return false;
      }

      get().setData('resume_name', result.name || 'resume.pdf');

      const fileName = 'resume.pdf';
      const filePath = `${userId}/${fileName}`;
      const base64 = await RNFS.readFile(result.uri, 'base64');
      const buffer = Buffer.from(base64, 'base64');

      // We can skip listing/removing because we use a fixed filename per user with upsert: true
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.log('Resume upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      const resumeUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      set({
        data: { ...data, resume_url: resumeUrl },
        loading: false,
      });
      return true;
    } catch (error: any) {
      console.log('Resume upload error:', error);
      set({ loading: false, error: `Resume Upload Error: ${error.message}` });
      return false;
    }
  },

  sendPasswordResetMail: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    if (!data.email.trim()) {
      set({
        loading: false,
        error: 'Password Reset Validation Error: Email is required.',
      });
      console.log('Password Reset Validation Error: Email is required.');
      return false;
    }

    set({ loading: true, error: null });

    try {
      const { data: resetData, error: resetError } =
        await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: 'com.tutofind://reset-password',
        });
      if (resetError) {
        console.log(resetError);
        Alert.alert('Error', `Failed to send password reset email: ${resetError.message}`);
        throw resetError;
      } else {
        console.log('Password reset email sent:', resetData);
      }

      set({ loading: false });
      Alert.alert(
        'Success!!',
        `Password reset email sent successfully to ${data.email}.`,
      );
      return true;
    } catch (error: any) {
      set({ loading: false, error: `Password Reset Error: ${error.message}` });
      return false;
    }
  },

  passwordReset: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    if (!data.password.trim()) {
      set({
        loading: false,
        error: 'Password Reset Validation Error: Password is required.',
      });
      console.log('Password Reset Validation Error: Password is required.');
      return false;
    }

    set({ loading: true, error: null });

    try {
      const { data: resetData, error: resetError } =
        await supabase.auth.updateUser({
          password: data.password,
        });
      if (resetError) {
        console.log(resetError);
        throw resetError;
      } else {
        console.log('Password reset successful:', resetData);
      }

      set({ loading: false });
      Alert.alert(
        'Success!!',
        `Password has been reset successfully.`,
      );
      return true;
    } catch (error: any) {
      set({ loading: false, error: `Password Reset Error: ${error.message}` });
    } return false;
  },

  reset: () =>
    set({
      data: {
        full_name: '',
        email: '',
        phone: '',
        password: '',
        user_type: 'student',
        subscription_type: 'free',
        otp: null,
        avatar: null,
        avatar_url: '',
        resume_name: '',
        address: {
          latitude: null,
          longitude: null,
          pincode: null,
          city: null,
        },
        gender: '',
        native_language: '',
        other_languages: [],
        bio: '',
        resume_url: '',
      },
      step: 1,
      loading: false,
      error: null,
      userId: null,
    }),
}));
