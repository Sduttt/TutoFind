import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import subjects from '../../data/subjects.json';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import { useTutorPosts } from '../../hooks/useTutorPosts';
import Components from '../../components/components';

const CreatePost = ({ navigation }: any) => {
  const { createPost, loading, error } = useTutorPosts();

  const [subject, setSubject] = useState('');
  const [subjectline, setSubjectline] = useState('');
  const [level, setLevel] = useState('');
  const [board, setBoard] = useState('');
  const [mode, setMode] = useState('Both');
  const [freeDemoAvailability, setFreeDemoAvailability] = useState(false);
  const [minsalary, setMinsalary] = useState('');
  const [maxsalary, setMaxsalary] = useState('');
  const [description, setDescription] = useState('');

  const [openSubject, setOpenSubject] = useState(false);
  const [openSubjectline, setOpenSubjectline] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openBoard, setOpenBoard] = useState(false);
  const [openMode, setOpenMode] = useState(false);
  const [openFreeDemoAvailability, setOpenFreeDemoAvailability] =
    useState(false);

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

  const modeItems = [
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' },
    { label: 'Both (Online + Offline)', value: 'Both' },
  ];

  const freeDemoAvailabilityItems = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const isFormValid = () => {
    if (
      !subject ||
      !subjectline ||
      !level ||
      !mode ||
      !minsalary ||
      !maxsalary ||
      !description
    ) {
      return false;
    }

    if (boardItemsLength > 0 && !board) {
      return false;
    }
    if (Number(maxsalary) < Number(minsalary)) {
      return false;
    }

    return true;
  };

  const handleReset = () => {
    setSubject('');
    setSubjectline('');
    setLevel('');
    setBoard('');
    setMode('Both');
    setFreeDemoAvailability(false);
    setMinsalary('');
    setMaxsalary('');
    setDescription('');
  };

  const handleCreatePost = async () => {
    if (!isFormValid()) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields correctly',
      );
      return;
    }

    const success = await createPost({
      subject,
      subject_line_2: subjectline,
      level,
      board,
      mode_of_teaching: mode,
      isFreeDemoAvailable: freeDemoAvailability,
      min_salary: parseInt(minsalary),
      max_salary: parseInt(maxsalary),
      description,
    });

    if (success) {
      ToastAndroid.show('Post created successfully', ToastAndroid.SHORT);
      handleReset(); // Reset form
      navigation.goBack();
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {loading && <Components.LOADING_COMP />}
      <Text className="text-2xl font-bold my-4">Create a New Post</Text>

      <View className="mb-4 flex-row items-center justify-between">
        {/* Choose subject */}
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
          listMode="FLATLIST"
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
          listMode="FLATLIST"
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
            listMode="FLATLIST"
            disabled={!subject}
          />
        )}
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        {/* Level */}
        <DropDownPicker
          open={openMode}
          value={mode}
          items={modeItems}
          setOpen={setOpenMode}
          setValue={setMode}
          setItems={() => {}}
          searchable={false}
          placeholder="Select teaching mode"
          containerStyle={{
            marginBottom: 20,
            zIndex: 1000,
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
          listMode="FLATLIST"
          disabled={!subject}
        />

        <DropDownPicker
          open={openFreeDemoAvailability}
          value={freeDemoAvailability}
          items={freeDemoAvailabilityItems}
          setOpen={setOpenFreeDemoAvailability}
          setValue={setFreeDemoAvailability}
          setItems={() => {}} // Not needed unless you want to update items dynamically
          searchable={false}
          placeholder="Free demo availability"
          containerStyle={{
            marginBottom: 20,
            zIndex: 500,
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
          listMode="FLATLIST"
          disabled={!subject}
        />
      </View>

      <View className="">
        <View className="mb-4 flex-row items-center justify-between">
          <TextInput
            placeholder="Minimum fee per hour"
            value={minsalary}
            onChangeText={setMinsalary}
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-4 py-3 w-[48%]"
          />
          <TextInput
            placeholder="Maximum fee per hour"
            value={maxsalary}
            onChangeText={setMaxsalary}
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-4 py-3 w-[48%]"
          />
        </View>
        {maxsalary && minsalary && Number(maxsalary) < Number(minsalary) ? (
          <Text className="text-red-500">
            * Maximum fee must be greater than minimum fee
          </Text>
        ) : (
          ''
        )}
      </View>
      <View className="mb-6">
        <Text className="text-black font-bold mb-2">Description</Text>
        <TextInput
          placeholder="Description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          className="border border-gray-300 rounded-lg px-4 py-3 w-full h-24"
        />
      </View>

      <TouchableOpacity
        onPress={handleCreatePost}
        disabled={!isFormValid() || loading}
        className={`rounded-lg px-4 py-3 w-full mb-4 ${
          !isFormValid() || loading ? 'bg-gray-400' : 'bg-blue-500'
        }`}
      >
        <Text className="text-white text-center font-bold">
          {loading ? 'Creating...' : 'Create Post'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleReset}
        className="bg-gray-500 rounded-lg px-4 py-3 w-full"
      >
        <Text className="text-white text-center font-bold">Reset</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreatePost;
