import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SignupData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  otp: string | null;
  user_type: 'student' | 'tutor' | 'admin';
  subscription_type: 'free' | 'silver' | 'gold';
}

interface SignupStore {
  data: SignupData;
  step: number;
  loading: boolean;
  userId: string | null;
  error: string | null;
  setData: (key: keyof SignupData, value: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  clearError: () => void;
  signup: () => Promise<boolean>;
  updateProfile: (profiledata: any) => Promise<boolean>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  resendEmailVerification: (email: string) => Promise<boolean>;
  reset: () => void;
  // submit: () => Promise<boolean>;
}

export const useSignupStore = create<SignupStore>((set, get) => ({
  data: {
    full_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'student',
    subscription_type: 'free',
    otp: null
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
      set({ loading: false, error: 'Full name is required.' });
      return false;
    }
    if (!data.email.trim()) {
      set({ loading: false, error: 'Email is required.' });
      return false;
    }
    if (!data.password.trim()) {
      set({ loading: false, error: 'Password is required.' });
      return false;
    }

    set({ loading: true, error: null });


    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.log(authError)
        throw authError;
      } else {
        console.log('Signup successful:', authData);
      }

      set({
        loading: false,
        userId: authData.user?.id || null,
      });
      return true;
    } catch (error: any) {
      set({ loading: false, error: error.message });
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
        })
        .eq('id', get().userId);

      set({ loading: false });
      return true;
    } catch (error: any) {
      set({ loading: false, error: error.message });
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
      set({ loading: false } );
      return true;
    }
    catch (error: any) {
      set({ loading: false, error: error.message });
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
      set({ loading: false } );
      return true;
    }
    catch (error: any) {
      set({ loading: false, error: error.message });
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
        otp: null
      },
      step: 1,
      loading: false,
      error: null,
    }),
}));
