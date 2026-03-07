import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UseAuthStore } from '../../store/AuthStore';
import Components from '../../components/components';
import { ScrollView } from 'react-native-gesture-handler';

const UserDashboard = ({ navigation }: { navigation: any }) => {
  const { userId } = UseAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <Components.PROFILE userId={userId as string} navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDashboard;
