import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SignupData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  user_type: 'student' | 'tutor' | 'admin';
  subscription_type: 'free' | 'silver' | 'gold';
}

interface SignupStore {
  data: SignupData;
  step: number;
  loading: boolean;
  error: string | null;
  setData: (key: keyof SignupData, value: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => Promise<boolean>;
}

export const useSignupStore = create<SignupStore>((set, get) => ({
  data: {
    full_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'student',
    subscription_type: 'free',
  },
  step: 1,
  loading: false,
  error: null,

  setData: (key, value) =>
    set(state => ({
      data: { ...state.data, [key]: value as any },
      error: null,
    })),

  setStep: step => set({ step, error: null }),

  nextStep: () =>
    set(state => ({ step: Math.min(state.step + 1, 3), error: null })),

  prevStep: () =>
    set(state => ({ step: Math.max(state.step - 1, 1), error: null })),

  submit: async () => {
    const { data } = get();
    set({ loading: true, error: null });

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name, user_type: data.user_type },
        },
      });

      if (authError) throw authError;

      await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          user_type: data.user_type,
          subscription_type: data.subscription_type,
        })
        .eq('id', authData.user!.id);

      set({ loading: false });
      return true;
    } catch (error: any) {
      set({ loading: false, error: error.message });
      return false;
    }
  },
}));
