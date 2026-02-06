import { View, Text } from 'react-native';
import React from 'react';
import Components from '../../components/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const TutorProfile = ({ route, navigation }: any) => {
  const { userId } = route.params;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Components.PROFILE userId={userId} navigation={navigation} />
    </SafeAreaView>
  );
};

export default TutorProfile;
