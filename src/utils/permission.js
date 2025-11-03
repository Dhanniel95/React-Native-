import { Platform } from 'react-native';
import {
    check,
    PERMISSIONS,
    RESULTS,
    request,
    requestNotifications,
} from 'react-native-permissions';

const PLATFORM_PHOTO_PERMISSIONS = {
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

const PLATFORM_CAMERA_PERMISSIONS = {
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_READ_PHOTO_PERMISSIONS = {
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    iod: PERMISSIONS.IOS.PHOTO_LIBRARY,
};

const PLATFORM_SEND_SMS_PERMISSIONS = {
    ios: null,
    android: PERMISSIONS.ANDROID.SEND_SMS,
};

const PLATFORM_LOCATION_PERMISSIONS = {
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_CONTACTS_PERMISSIONS = {
    ios: PERMISSIONS.IOS.CONTACTS,
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
};

const PLATFORM_AUDIO_PERMISSIONS = {
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
};

const REQUEST_PERMISSION_TYPE = {
    photo: PLATFORM_PHOTO_PERMISSIONS,
    send_sms: PLATFORM_SEND_SMS_PERMISSIONS,
    location: PLATFORM_LOCATION_PERMISSIONS,
    contacts: PLATFORM_CONTACTS_PERMISSIONS,
    read_photo: PLATFORM_READ_PHOTO_PERMISSIONS,
    camera: PLATFORM_CAMERA_PERMISSIONS,
    audio: PLATFORM_AUDIO_PERMISSIONS,
};

const PERMISSION_TYPE = {
    contacts: 'contacts',
    photo: 'photo',
    send_sms: 'send_sms',
    location: 'location',
    read_photo: 'read_photo',
    camera: 'camera',
    audio: 'audio',
};

class AppPermission {
    checkPermission = async type => {
        const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
        if (!permissions) {
            return true;
        }
        try {
            const result = await check(permissions);

            if (result === RESULTS.GRANTED) return true;
            return this.requestPermission(permissions); // Request Permission
        } catch (error) {
            return false;
        }
    };

    requestPermission = async permissions => {
        try {
            const result = await request(permissions);

            return result === RESULTS.GRANTED;
        } catch (error) {
            return false;
        }
    };

    requestMultiple = async types => {
        const results = [];
        for (const type of types) {
            const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
            if (permission) {
                const result = await this.requestPermission(permission);
                results.push(result);
            }
        }

        for (const result of results) {
            if (!result) {
                return false;
            }
        }
        return true;
    };

    requestNotifyPermission = async () => {
        if (Platform.OS === 'android') {
            return true;
        }

        const { status, settings } = await requestNotifications([
            'alert',
            'sound',
            'badge',
        ]);
        return status === RESULTS.GRANTED;
    };
}

const Permission = new AppPermission();

export { Permission, PERMISSION_TYPE };
