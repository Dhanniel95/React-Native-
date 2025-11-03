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
import { useAppSelector } from '../../utils/hooks';
import { useNavigation } from '@react-navigation/native';
import UpdateFace from '../../screens/App/User/UpdateFace';

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
};

const Stack = createStackNavigator<AppStackParamList>();

const AppStack = () => {
    const navigation = useNavigation<any>();

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (user?.role === 'user' && !user.faceIdPhotoUrl) {
            navigation.navigate('UpdateFace');
        }
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
            </Stack.Navigator>
            <ZegoUIKitPrebuiltCallFloatingMinimizedView />
        </>
    );
};

export default AppStack;
