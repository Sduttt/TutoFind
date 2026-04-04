import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useEffect } from 'react';
import { UseAuthStore } from '../store/AuthStore';
import { supabase } from '../lib/supabase';
import { navigationRef } from '../navigation/navigationRef';
import { Routes } from '../navigation/routes';

const reqUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    if(granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Noti permission granted")
    } else {
        console.log("Noti permission denied")
    }
}

const getToken = async (userId: string) => {
    try {
        const token = await messaging().getToken();
        console.log("FCM Token: ", token)
        
        if (userId && token) {
            const { error } = await supabase
                .from('profiles')
                .update({ fcm_token: token })
                .eq('id', userId);
                
            if (error) {
                console.log("Error saving FCM token to Supabase:", error.message);
            } else {
                // console.log("FCM token successfully saved to profile.");
            }
        }
    } catch (error) {
        console.log("Failed to get FCM token", error)
    }
}

export const useNotification = () => {
    const userId = UseAuthStore(state => state.userId);

    useEffect(() => {
        reqUserPermission();
        if (userId) {
            getToken(userId);
        }
    }, [userId])

    // Listen for FCM token refresh
    useEffect(() => {
        if (!userId) return;
        
        const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
            console.log("FCM Token refreshed: ", newToken);
            await supabase
                .from('profiles')
                .update({ fcm_token: newToken })
                .eq('id', userId);
        });
        
        return unsubscribe;
    }, [userId]);

    // Listen for foreground messages
    
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // console.log('A new FCM message arrived in the foreground!', remoteMessage);
            // 1. Request permissions (required for iOS)
            await notifee.requestPermission();
            // 2. Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
                importance: AndroidImportance.HIGH, 
            });
            // 3. Display the notification locally
            const rawTitle = remoteMessage.notification?.title || remoteMessage.data?.title || 'New Message';
            const rawBody = remoteMessage.notification?.body || remoteMessage.data?.body || '';
            const title = typeof rawTitle === 'string' ? rawTitle : String(rawTitle);
            const body = typeof rawBody === 'string' ? rawBody : String(rawBody);

            if (title || body) {
                const rawCid = remoteMessage.data?.conversationId;
                const cid = rawCid !== undefined && rawCid !== null ? String(rawCid) : undefined;
                await notifee.displayNotification({
                    title: title,
                    body: body,
                    ...(cid ? { data: { conversationId: cid } } : {}),
                    android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        smallIcon: 'ic_launcher',
                        pressAction: {
                            id: 'default',
                            launchActivity: 'default'
                        },
                    },
                });
            }
        });
        return unsubscribe;
    }, []);

    // Handle notification press when app is in foreground
    useEffect(() => {
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                const cid = detail.notification?.data?.conversationId;
                if (cid && navigationRef.isReady()) {
                    navigationRef.navigate(Routes.CHAT_SCREEN, { conversationId: cid });
                }
            }
        });

        return () => unsubscribe();
    }, []);

}
// TODO: Redirect to chat screen when notification is tapped (requires additional setup with notifee and react-navigation)
// TODO: Implement ad banner in the post list screen
// TODO: Implement subscription-based premium features (e.g., ad-free experience, exclusive content)
// TODO: Publish the updated version of the app



    
