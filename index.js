/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { name as appName } from './app.json';


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    const title = remoteMessage.notification?.title || remoteMessage.data?.title || 'New Message';
    const body = remoteMessage.notification?.body || remoteMessage.data?.body || '';
    const cid = remoteMessage.data?.conversationId;

    await notifee.displayNotification({
      title,
      body,
      ...(cid ? { data: { conversationId: String(cid) } } : {}),
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { 
          id: 'default',
          launchActivity: 'default'
        },
      },
    });
  } catch (err) {
    console.log('Error creating notification in background', err);
  }
});

// Handle notification press when app is in background/killed.
notifee.onBackgroundEvent(async ({ type, detail }) => {
  try {
    if (type === EventType.PRESS) {
      const cid = detail.notification?.data?.conversationId;
      if (cid) {
        await AsyncStorage.setItem('pending_notification_conversation', cid);
      }
    }
  } catch (err) {
    console.log('Error handling background notification event', err);
  }
});
AppRegistry.registerComponent(appName, () => App);
