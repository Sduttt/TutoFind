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
import { useNotification } from './hooks/useNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Routes } from './navigation/routes';

export default function App() {
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  useDeepLinks();
  useNotification();

  useEffect(() => {
    // Hide native static splash immediately so video splash can take over
    SplashScreen.hide();
  }, []);

  // Check if app was opened from a notification tap (cold start / background)
  useEffect(() => {
    const checkPending = async () => {
      try {
        const pending = await AsyncStorage.getItem('pending_notification_conversation');
        if (pending && navigationRef.isReady()) {
          navigationRef.navigate(Routes.CHAT_SCREEN, { conversationId: pending });
          await AsyncStorage.removeItem('pending_notification_conversation');
          return;
        }

        // Check notifee initial notification
        const initial = await notifee.getInitialNotification();
        if (initial?.notification?.data?.conversationId && navigationRef.isReady()) {
          navigationRef.navigate(Routes.CHAT_SCREEN, { conversationId: initial.notification.data.conversationId });
          return;
        }

        // Fallback: check firebase messaging initial notification
        const msgInitial = await messaging().getInitialNotification();
        if (msgInitial?.data?.conversationId && navigationRef.isReady()) {
          navigationRef.navigate(Routes.CHAT_SCREEN, { conversationId: msgInitial.data.conversationId });
        }
      } catch (err) {
        console.log('Error checking pending notification', err);
      }
    };

    const t = setTimeout(checkPending, 800);
    return () => clearTimeout(t);
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
