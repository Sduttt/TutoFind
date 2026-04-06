import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import subjects from '../../data/subjects.json';
import { useTutorPosts } from '../../hooks/useTutorPosts';
import Components from '../../components/components';
import { getUserProfile } from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'react-native-drawer-layout';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const StudentHome = () => {
  const { studentGetPosts, loading, error } = useTutorPosts();
  const navigation = useNavigation();

  const [subject, setSubject] = useState('');
  const [subjectline, setSubjectline] = useState('');
  const [level, setLevel] = useState('');
  const [board, setBoard] = useState('');

  const [openSubject, setOpenSubject] = useState(false);
  const [openSubjectline, setOpenSubjectline] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openBoard, setOpenBoard] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [tutorProfiles, setTutorProfiles] = useState<Record<string, any>>({});

  const subjectItems = subjects.map(subject => ({
    label: subject.subject,
    value: subject.subject,
  }));

  const subjectlineItems = subjects
    .filter(sub => sub.subject === subject)
    .flatMap(sub => sub.subject_line_2)
    .map(subject_line_2 => ({ label: subject_line_2, value: subject_line_2 }));

  const levelItems = subjects
    .filter(sub => sub.subject === subject)
    .flatMap(sub => sub.levels)
    .map(levels => ({ label: levels, value: levels }));

  const boardItemsLength = subjects
    .filter(sub => sub.subject === subject)
    .flatMap(sub => sub.board || [])
    .filter(board => board !== null && board !== undefined).length;

  const boardItems = subjects
    .filter(sub => sub.subject === subject)
    .flatMap(sub => sub.board || [])
    .filter(board => board !== null && board !== undefined)
    .map(board => ({ label: board, value: board }));

  const fetchposts = async () => {
    try {
      const result = await studentGetPosts(subject, subjectline, level, board);
      setPosts(postsWithAds(result || []));
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const postsWithAds = (posts: any[]) => {
    let postSinceLastAd = 0;
    let nextAdIndex = 1;
    
    for(let i = 0; i < posts.length; i++) {
      if (postSinceLastAd >= nextAdIndex) {
        posts.splice(i+1, 0, { isAd: true, id: `ad-${i}` });
        postSinceLastAd = 0;
        nextAdIndex++;
        i++; // Skip the ad we just inserted
      } else {
        postSinceLastAd++;
      }
    }

    return posts;
  }

  useEffect(() => {
    fetchposts();
  }, [subject, subjectline, level, board]);

  const postDateDuration = (created_at: string) => {
    const now = new Date();
    const created = new Date(created_at);
    const diffMs = now.getTime() - created.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) {
      return `${diffDay}d ago`;
    } else if (diffHr > 0) {
      return `${diffHr}h ago`;
    } else if (diffMin > 0) {
      return `${diffMin}m ago`;
    } else {
      return 'Just now';
    }
  };

  useEffect(() => {
    if (!posts.length) {
      setTutorProfiles({});
      return;
    }

    let isMounted = true;

    const loadProfiles = async () => {
      const uniqueIds = Array.from(
        new Set(
          posts
            .map(post => post.tutor_id)
            .filter(
              (id): id is string => typeof id === 'string' && id.length > 0,
            ),
        ),
      );

      try {
        const resolvedProfiles = await Promise.all(
          uniqueIds.map(async tutorId => {
            // Check if we already have it to avoid redundant fetches
            if (tutorProfiles[tutorId])
              return [tutorId, tutorProfiles[tutorId]];

            const { data } = await getUserProfile(tutorId);
            return data ? [tutorId, data] : null;
          }),
        );

        if (!isMounted) return;

        const nextProfiles = resolvedProfiles.filter(
          (entry): entry is [string, any] => Array.isArray(entry),
        );

        setTutorProfiles(prev => ({
          ...prev,
          ...Object.fromEntries(nextProfiles),
        }));
      } catch (profileError) {
        console.error('Error fetching tutor profile:', profileError);
      }
    };

    loadProfiles();

    return () => {
      isMounted = false;
    };
  }, [posts]);

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="my-4 flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-center">Find Your Tutor</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <FontAwesomeIcon icon={faBars} size={24} />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-center">
        <DropDownPicker
          open={openSubject}
          value={subject}
          items={subjectItems}
          setOpen={setOpenSubject}
          setValue={setSubject}
          setItems={() => {}}
          searchable={true}
          searchPlaceholder="Search subjects..."
          placeholder="Select a subject"
          containerStyle={{
            marginBottom: 20,
            zIndex: 3000,
            width: '48%',
          }}
          style={{ borderColor: '#d1d5db' }}
          dropDownContainerStyle={{
            backgroundColor: '#fff',
            borderColor: '#E5E7EB',
            maxHeight: 200,
          }}
          listMode="MODAL"
          modalProps={{
            animationType: 'slide',
          }}
          modalContentContainerStyle={{
            backgroundColor: 'white',
            width: '90%',
            maxHeight: 300,
            alignSelf: 'center',
            borderRadius: 12,
            padding: 10,
          }}
        />

        <DropDownPicker
          open={openSubjectline}
          value={subjectline}
          items={subjectlineItems}
          setOpen={setOpenSubjectline}
          setValue={setSubjectline}
          setItems={() => {}} // Not needed unless you want to update items dynamically
          searchable={false}
          placeholder="Select a subject line"
          containerStyle={{
            marginBottom: 20,
            zIndex: 3000,
            width: '48%',
            opacity: !subject ? 0.5 : 1, // visually indicate disabled
          }}
          style={{
            borderColor: '#d1d5db',
            backgroundColor: !subject ? '#f3f4f6' : '#fff', // lighter bg when disabled
          }}
          dropDownContainerStyle={{
            borderColor: '#d1d5db',
            backgroundColor: !subject ? '#f3f4f6' : '#fff',
            maxHeight: 200,
          }}
          listMode="MODAL"
          disabled={!subject}
        />
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        {/* Level */}
        <DropDownPicker
          open={openLevel}
          value={level}
          items={levelItems}
          setOpen={setOpenLevel}
          setValue={setLevel}
          setItems={() => {}}
          searchable={false}
          placeholder="Select a level"
          containerStyle={{
            marginBottom: 20,
            zIndex: 3000,
            width: '48%',
            opacity: !subject ? 0.5 : 1, // visually indicate disabled
          }}
          style={{
            borderColor: '#d1d5db',
            backgroundColor: !subject ? '#f3f4f6' : '#fff', // lighter bg when disabled
          }}
          dropDownContainerStyle={{
            borderColor: '#d1d5db',
            backgroundColor: !subject ? '#f3f4f6' : '#fff',
            maxHeight: 200,
          }}
          listMode="MODAL"
          disabled={!subject}
        />

        {boardItemsLength > 0 && (
          <DropDownPicker
            open={openBoard}
            value={board}
            items={boardItems}
            setOpen={setOpenBoard}
            setValue={setBoard}
            setItems={() => {}} // Not needed unless you want to update items dynamically
            searchable={false}
            placeholder="Select a board"
            containerStyle={{
              marginBottom: 20,
              zIndex: 2500,
              width: '48%',
              opacity: !subject ? 0.5 : 1, // visually indicate disabled
            }}
            style={{
              borderColor: '#d1d5db',
              backgroundColor: !subject ? '#f3f4f6' : '#fff', // lighter bg when disabled
            }}
            dropDownContainerStyle={{
              borderColor: '#d1d5db',
              backgroundColor: !subject ? '#f3f4f6' : '#fff',
              maxHeight: 200,
            }}
            listMode="MODAL"
            disabled={!subject}
          />
        )}
      </View>


      <FlatList
        data={posts}
        keyExtractor={(item, index) => item.id ? String(item.id) : `post-${index}`}
        renderItem={({ item, index }) => {
          if (item.isAd) {
            return (
              <Components.AD_BANNER />
            );
          }
          else {
            const tutorProfile = tutorProfiles[item.tutor_id];
            return (
              <Components.POST_CARD
                key={item.id ? String(item.id) : `post-${index}`}
                subject={item.subject}
                subjectLine={item.subject_line_2}
                level={item.level}
                board={item.board}
                desc={item.description}
                minFees={item.min_salary}
                maxFees={item.max_salary}
                mode={item.mode_of_teaching}
                freeDemo={item.isFreeDemoAvailable}
                tutorName={tutorProfile?.full_name}
                tutorImg={tutorProfile?.avatar_url}
                postDate={postDateDuration(item.created_at)}
                totalViews={item.total_views}
                tutorId={item.tutor_id}
                postId={item.id}
                isLive={item.isLive}
              />
            );
          }

        }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text className="text-red-500">{error}</Text>
          ) : (
            <Text className="text-gray-500 font-bold text-3xl text-center">
              No Posts Available
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />  
    </SafeAreaView>
  );
};

export default StudentHome;
