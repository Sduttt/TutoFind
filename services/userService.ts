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

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.log('Error updating user profile:', error);
    return { data: null, error: error.message };
  }
};

export const uploadAvatar = async (userId: string, filePath: string) => {
  try {
    const fileExt = filePath.split('.').pop();
    const fileName = `${userId}${Math.random()}.${fileExt}`;
    const path = `avatars/${fileName}`;

    const formData = new FormData();
    formData.append('file', {
      uri: filePath,
      name: fileName,
      type: `image/${fileExt}`,
    } as any);

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, formData);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    return { data: publicUrlData.publicUrl, error: null };
  } catch (error: any) {
    console.log('Error uploading avatar:', error);
    return { data: null, error: error.message };
  }
};
