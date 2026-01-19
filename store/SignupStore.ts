import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Image as PickerImage } from 'react-native-image-crop-picker';
import { FileObject } from '@supabase/storage-js';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

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
  avatar?: PickerImage | null;
  avatar_url?: string;
}

interface SignupStore {
  data: SignupData;
  step: number;
  loading: boolean;
  userId: string | null;
  error: string | null;
  setData: (key: keyof SignupData, value: string | PickerImage | null) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  clearError: () => void;
  signup: () => Promise<boolean>;
  uploadAvatar: () => Promise<boolean>;
  updateProfile: (profiledata: any) => Promise<boolean>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  resendEmailVerification: (email: string) => Promise<boolean>;
  reset: () => void;
}

export const useSignupStore = create<SignupStore>((set, get) => ({
  data: {
    full_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'student',
    subscription_type: 'free',
    otp: null,
    avatar: null,
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

  updateProfile: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    try {
      await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          user_type: data.user_type,
          subscription_type: data.subscription_type,
          avatar_url: data.avatar_url || null,
        })
        .eq('id', get().userId);

      set({ loading: false });
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
      set({ loading: false });
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
      },
      step: 1,
      loading: false,
      error: null,
    }),
}));
