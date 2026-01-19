import React, { useEffect } from 'react';
import {
    ZegoUIKitPrebuiltCallWaitingScreen,
    ZegoUIKitPrebuiltCallInCallScreen,
    ZegoUIKitPrebuiltCallFloatingMinimizedView,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';
import Notification from '../../screens/App/Shared/Notification';
import Chat from '../../screens/App/Shared/Chat';
import History from '../../screens/App/Shared/History';
import Terms from '../../screens/App/Shared/Terms';
import Policy from '../../screens/App/Shared/Policy';
import ChangePassword from '../../screens/App/Shared/ChangePassword';
import Discount from '../../screens/App/Shared/Discount';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { useNavigation } from '@react-navigation/native';
import UpdateFace from '../../screens/App/User/UpdateFace';
import Reel from '../../screens/App/User/Reel';
import { getTransport, listNotifications } from '../../redux/basic/basicSlice';
import BookingList from '../../screens/App/Pro/BookingList';
import ActivityBooks from '../../screens/App/Pro/ActivityBooks';
import MagicLogin from '../../screens/Auth/MagicLogin';

export type AppStackParamList = {
    AppTabs: undefined;
    ZegoUIKitPrebuiltCallWaitingScreen: undefined;
    ZegoUIKitPrebuiltCallInCallScreen: undefined;
    Notifications: undefined;
    Chat: { params: any };
    History: undefined;
    Policy: undefined;
    Terms: undefined;
    Discount: undefined;
    ChangePassword: undefined | { change: boolean };
    UpdateFace: undefined;
    Reel: { startFrom: number };
    BookingList: { date: any };
    ActivityBooks: { itemId: number };
    MagicLogin: { 'magic-token': string };
};

const Stack = createStackNavigator<AppStackParamList>();

const AppStack = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigation<any>();

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (user?.role === 'user' && !user.faceIdPhotoUrl) {
            navigation.navigate('UpdateFace');
        }
    }, [user]);

    useEffect(() => {
        dispatch(listNotifications());
        dispatch(getTransport());
    }, []);

    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    presentation: 'card',
                }}
            >
                <Stack.Screen name="AppTabs" component={AppTabs} />
                <Stack.Screen
                    name="ZegoUIKitPrebuiltCallWaitingScreen"
                    component={ZegoUIKitPrebuiltCallWaitingScreen}
                />
                <Stack.Screen
                    name="ZegoUIKitPrebuiltCallInCallScreen"
                    component={ZegoUIKitPrebuiltCallInCallScreen}
                />
                <Stack.Screen name="Notifications" component={Notification} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="History" component={History} />
                <Stack.Screen name="Terms" component={Terms} />
                <Stack.Screen name="Policy" component={Policy} />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                />
                <Stack.Screen name="Discount" component={Discount} />
                <Stack.Screen name="UpdateFace" component={UpdateFace} />
                <Stack.Screen name="Reel" component={Reel} />
                <Stack.Screen name="BookingList" component={BookingList} />
                <Stack.Screen name="ActivityBooks" component={ActivityBooks} />
                <Stack.Screen name="MagicLogin" component={MagicLogin} />
            </Stack.Navigator>
            <ZegoUIKitPrebuiltCallFloatingMinimizedView />
        </>
    );
};

export default AppStack;
