import { PermissionsAndroid, Platform } from 'react-native';
import {
    getToken,
    requestPermission,
    AuthorizationStatus,
    getMessaging,
    getAPNSToken,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../redux/auth/authService';
import { displayError } from './display';

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
};

const getFcmToken = async () => {
    try {
        requestingPermission();
        await getAPNSToken(getMessaging());
        const token = await getToken(getMessaging());
        return token;
    } catch (err) {
        return undefined;
    }
};

const saveToken = async () => {
    let token = await getFcmToken();
    if (token) {
        let find = await AsyncStorage.getItem('@pushToken');
        if (!find) {
            try {
                await authService.saveToken(token);
                await AsyncStorage.setItem('@pushToken', 'saved');
            } catch (err) {
                console.log(displayError(err, false), 'Error Sending');
            }
        }
    }
};

export { getFcmToken, requestingPermission, saveToken };
