import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Text } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import { NavigationContainer } from '@react-navigation/native';

import linking from './navigation/linking';
import { useDeepLinks } from './hooks/useDeepLinks';
import { navigationRef } from './navigation/navigationRef';
import { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import VideoSplashScreen from './screens/common/VideoSplashScreen';

export default function App() {
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  useDeepLinks();

  useEffect(() => {
    // Hide native static splash immediately so video splash can take over
    SplashScreen.hide();
  }, []);

  if (showVideoSplash) {
    return <VideoSplashScreen onFinished={() => setShowVideoSplash(false)} />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<Text>Loading...</Text>}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider className="flex-1">
          <StatusBar barStyle="dark-content" />
          <MainNavigation />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
