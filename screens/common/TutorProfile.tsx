import { View, Text } from 'react-native';
import React from 'react';
import Components from '../../components/components';

const TutorProfile = ({ route, navigation }: any) => {
  const { userId } = route.params;
  return <Components.PROFILE userId={userId} navigation={navigation} />;
};

export default TutorProfile;
