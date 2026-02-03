import { useState } from 'react';
import { UseAuthStore } from '../store/AuthStore';
import { supabase } from '../lib/supabase';
import { ToastAndroid } from 'react-native';

interface Post {
  subject: string;
  subject_line_2: string;
  level: string;
  board: string;
  mode_of_teaching: string;
  isFreeDemoAvailable: boolean;
  min_salary: number;
  max_salary: number;
  description: string;
}

export const useTutorPosts = () => {
  const { userId } = UseAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createPost = async (post: Post) => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors

      console.log('Creating post with userId:', userId);
      console.log('Post data:', post);

      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return false;
      }

      const { data, error: insertError } = await supabase.from('posts').insert({
        tutor_id: userId,
        subject: post.subject,
        subject_line_2: post.subject_line_2,
        description: post.description,
        level: post.level,
        board: post.board || null, // Handle empty board
        mode_of_teaching: post.mode_of_teaching,
        isFreeDemoAvailable: post.isFreeDemoAvailable,
        min_salary: post.min_salary,
        max_salary: post.max_salary,
      });

      if (insertError) {
        console.error('Error creating post:', insertError);
        setError(insertError.message);
        setLoading(false);
        return false;
      }

      console.log('Post created successfully:', data);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  const tutorGetPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('tutor_id', userId);
      if (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return [];
      }
      console.log('Posts fetched successfully:', data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
      return [];
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setLoading(true);
      setError('');
      const { data, error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('tutor_id', userId);
      if (deleteError) {
        console.error('Error deleting post:', deleteError);
        setError(deleteError.message);
        setLoading(false);
        return false;
      }
      console.log('Post deleted successfully:', data);
      tutorGetPosts();
      ToastAndroid.show('Post deleted successfully', ToastAndroid.SHORT);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  const publishUnpublishPost = async (postId: string, isLive: boolean) => {
    try {
      setLoading(true);
      setError('');
      const { data, error: updateError } = await supabase
        .from('posts')
        .update({ isLive: isLive })
        .eq('id', postId)
        .eq('tutor_id', userId);
      if (updateError) {
        console.error('Error unpublishing post:', updateError);
        setError(updateError.message);
        setLoading(false);
        return false;
      }
      console.log('Post unpublished successfully:', data);
      tutorGetPosts();
      ToastAndroid.show('Post unpublished successfully', ToastAndroid.SHORT);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  }

  const updatePost = async (postId: string, updatedPost: Post) => {
    try {
      setLoading(true);
      setError('');

      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return false;
      }

      const { data, error: updateError } = await supabase
        .from('posts')
        .update({
          subject: updatedPost.subject,
          subject_line_2: updatedPost.subject_line_2,
          description: updatedPost.description,
          level: updatedPost.level,
          board: updatedPost.board || null,
          mode_of_teaching: updatedPost.mode_of_teaching,
          isFreeDemoAvailable: updatedPost.isFreeDemoAvailable,
          min_salary: updatedPost.min_salary,
          max_salary: updatedPost.max_salary,
        })
        .eq('id', postId)
        .eq('tutor_id', userId);
      if (updateError) {
        console.error('Error updating post:', updateError);
        setError(updateError.message);
        setLoading(false);
        return false;
      }
      console.log('Post updated successfully:', data);
      setLoading(false);
      ToastAndroid.show('Post updated successfully', ToastAndroid.SHORT);
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  return { createPost, updatePost, tutorGetPosts, deletePost, publishUnpublishPost, loading, error };
};
