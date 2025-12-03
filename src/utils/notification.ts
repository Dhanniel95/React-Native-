import { PermissionsAndroid, Platform, Vibration } from 'react-native';
import {
    getToken,
    requestPermission,
    AuthorizationStatus,
    getMessaging,
    getAPNSToken,
    onNotificationOpenedApp,
    getInitialNotification,
    onMessage,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../redux/auth/authService';
import { displayError } from './display';
import crashlytics from '@react-native-firebase/crashlytics';
import notifee from '@notifee/react-native';
import * as Navigation from '../utils/navigation';

const requestingPermission = async () => {
    let authStatus = await requestPermission(getMessaging());
    if (Platform.OS === 'ios') {
        const enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
        } else {
            console.log('Notification permission denied');
        }
    }

    if (Platform.OS === 'android') {
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            vibration: true,
        });
    }
};

const getFcmToken = async () => {
    try {
        requestingPermission();
        await getAPNSToken(getMessaging());
        const token = await getToken(getMessaging());
        return token;
    } catch (err) {
        crashlytics().recordError(err as Error);
        return undefined;
    }
};

const defaultToken = () => {
    return `foP1VqPIQV-s1U4LfaAB4n:APA91bH4Q81iymUvccn-Y7jI1cwhcPQDxZ_I_WbCST2kVO8M2owqAzjP86Ah7X72XlfqccjRdwtUgeJq88NIuHzNvnbxGpuvBXQhJDx9foNbxgZ-ncOq9Cs`;
};

const saveToken = async () => {
    let token = await getFcmToken();
    if (token) {
        let find = await AsyncStorage.getItem('@pushTokens');
        if (!find) {
            try {
                await authService.saveToken(token);
                await AsyncStorage.setItem('@pushTokens', 'saved');
            } catch (err) {
                console.log(displayError(err, false), 'Error Sending');
            }
        }
    }
};

const navigateFromNotification = (data: any, role: string) => {
    console.log(data, 'DATAA');
    if (data?.chatId) {
        if (role === 'consultant' || role === 'pro') {
            Navigation.navigateParams('Chat', { params: data });
        } else {
            Navigation.navigateParams('Consult', { reload: true });
        }
    }
};

let notificationsInitialized = false;

const initNotifications = () => {
    if (!notificationsInitialized) {
        setupNotificationHandlers('');
        notificationsInitialized = true;
    }
};

const setupNotificationHandlers = (role: string) => {
    onNotificationOpenedApp(getMessaging(), remoteMessage => {
        console.log(remoteMessage, 'remoteOpen');
        navigateFromNotification(remoteMessage.data, role);
    });

    getInitialNotification(getMessaging()).then(remoteMessage => {
        console.log(remoteMessage, 'remoteKilled');
        navigateFromNotification(remoteMessage?.data, role);
    });

    const unsubscribe = onMessage(getMessaging(), async remoteMessage => {
        console.log(remoteMessage, 'remote');
        Vibration.vibrate(150);

        await notifee.displayNotification({
            id: 'chat-message',
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            android: {
                channelId: 'default',
                smallIcon: 'ic_launcher',
                pressAction: {
                    id: 'default',
                },
            },

            ios: {
                sound: 'default',
            },
        });
    });

    return unsubscribe;
};

const clearAllNotifications = async () => {
    await notifee.cancelAllNotifications();
    if (Platform.OS === 'ios') {
        await notifee.setBadgeCount(0);
    }
};

export {
    getFcmToken,
    defaultToken,
    requestingPermission,
    saveToken,
    setupNotificationHandlers,
    clearAllNotifications,
    initNotifications,
};
