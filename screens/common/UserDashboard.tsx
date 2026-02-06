import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UseAuthStore } from '../../store/AuthStore';
import Components from '../../components/components';

const UserDashboard = ({ navigation }: { navigation: any }) => {
  const { userId } = UseAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Components.PROFILE userId={userId as string} navigation={navigation} />
    </SafeAreaView>
  );
};

export default UserDashboard;
