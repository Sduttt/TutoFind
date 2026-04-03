import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const reqUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    if(granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Noti permission granted")
    } else {
        console.log("Noti permission denied")
    }
}

const getToken = async () => {
    try {
        const  token = await messaging().getToken();
        console.log("FCM Token: ", token)
    } catch (error) {
        console.log("Failed to get FCM token", error)
    }
}

export const useNotification = () => {
    useEffect(() => {
        reqUserPermission();
        getToken();
    }, [])
}