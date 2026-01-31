import { supabase } from '../lib/supabase';

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Error fetching user profile:', error);
    return { data: null, error: error.message };
  }
};
