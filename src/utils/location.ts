import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, {
    GeoPosition,
    GeoError,
} from 'react-native-geolocation-service';
import { Permission, PERMISSION_TYPE } from './permission';

// TypeScript type for GeoPosition (if not directly imported)
export interface LocationCoords {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number | null;
    heading?: number;
    speed?: number;
}

export interface Location {
    coords: LocationCoords;
    timestamp: number;
}

export const getCurrentLocation = async (): Promise<Location> => {
    try {
        // Request permission on Android
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            ]);
        }

        // Return a promise for geolocation
        return new Promise<Location>((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position: GeoPosition) => {
                    resolve(position as Location);
                },
                (error: GeoError) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    forceRequestLocation: true,
                    showLocationDialog: true,
                },
            );
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
