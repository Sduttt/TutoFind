import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useTutorPosts } from '../../hooks/useTutorPosts';
import Components from '../../components/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Routes } from '../../navigation/routes';
import { useFocusEffect } from '@react-navigation/native';

const ViewPosts = ({ navigation }: { navigation: any }) => {
  const { tutorGetPosts } = useTutorPosts();
  const { user } = useUserProfile();
  const [posts, setPosts] = useState<any[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const [postError, setPostError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setPostLoading(true);
      setPostError(null);
      const result = await tutorGetPosts();
      setPosts(result || []);
    } catch (err) {
      setPostError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setPostLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      {postLoading ? (
        <Components.LOADING_COMP />
      ) : postError ? (
        <Components.ERROR_COMP error={postError} />
      ) : posts.length === 0 ? (
        <View className="justify-center items-center h-full">
          <Text className="text-gray-500 font-bold text-3xl">No Posts Available</Text>
        </View>
      ) : (
        <View>
          <Text className="text-2xl font-bold mb-4 text-center">{`Your Posts (${posts.length})`}</Text>
          {posts.map((post, index) => {
            let formattedDate = '';
            if (post.created_at) {
              const now = new Date();
              const created = new Date(post.created_at);
              const diffMs = now.getTime() - created.getTime();
              const diffSec = Math.floor(diffMs / 1000);
              const diffMin = Math.floor(diffSec / 60);
              const diffHr = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHr / 24);

              if (diffDay > 0) {
                formattedDate = `${diffDay}d ago`;
              } else if (diffHr > 0) {
                formattedDate = `${diffHr}h ago`;
              } else if (diffMin > 0) {
                formattedDate = `${diffMin}m ago`;
              } else {
                formattedDate = 'Just now';
              }
            }
            return (
              <Components.POST_CARD
                key={post.id ? String(post.id) : `post-${index}`}
                subject={post.subject}
                subjectLine={post.subject_line_2}
                level={post.level}
                board={post.board}
                desc={post.description}
                minFees={post.min_salary}
                maxFees={post.max_salary}
                mode={post.mode_of_teaching}
                freeDemo={post.isFreeDemoAvailable}
                tutorName={user?.full_name}
                tutorImg={user?.avatar_url}
                postDate={formattedDate}
                totalViews={post.total_views}
                tutorId={post.tutor_id}
                postId={post.id}
                isLive={post.isLive}
                onDelete={fetchPosts}
                onEdit={() =>
                  navigation.navigate(Routes.CREATE_POST, {
                    mode: 'edit',
                    post,
                  })
                }
              />
            );
          })}
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.CREATE_POST)}
        className="bg-blue-600 rounded-xl mt-4 py-4 items-center shadow-lg active:bg-blue-700 mb-8"
      >
        <Text className="text-white font-bold text-lg">CREATE POST</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ViewPosts;
