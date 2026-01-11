import { View, Text, Button } from 'react-native';
import React, { useState } from 'react';
import { useSignupStore } from '../../store/SignupStore';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const UserType = (props: Props) => {
  const { step, nextStep, setData } = useSignupStore();

  const handleNext = () => {
    nextStep();
  };

  return (
    <SafeAreaView>
      <Text> Welcome to TutoFind </Text>
      <Text> Please select your user type </Text>
      <View>
        <Button
          title="Student"
          onPress={() => {
            setData('user_type', 'student');
          }}
        />
        <Button
          title="Tutor"
          onPress={() => {
            setData('user_type', 'tutor');
          }}
        />
      </View>
      <Button title="Next" onPress={handleNext} />

      <Text>
        Already have an account? <Text onPress={() => {}}>Sign In</Text>
      </Text>
    </SafeAreaView>
  );
};

export default UserType;
