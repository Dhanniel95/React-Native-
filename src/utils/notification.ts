import { PermissionsAndroid, Platform } from 'react-native';
import {
    getToken,
    requestPermission,
    AuthorizationStatus,
    getMessaging,
    getAPNSToken,
} from '@react-native-firebase/messaging';

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
        console.log(err, 'Error Token');
    }
};

export { getFcmToken, requestingPermission };
