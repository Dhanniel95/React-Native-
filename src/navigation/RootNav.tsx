import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Test from '../screens/Test';
import {
    ZegoCallInvitationDialog,
    ZegoUIKitPrebuiltCallWaitingScreen,
    ZegoUIKitPrebuiltCallInCallScreen,
    ZegoUIKitPrebuiltCallFloatingMinimizedView,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Stack = createStackNavigator();

const RootNav = () => {
    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    presentation: 'card',
                }}
            >
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen
                    name="ZegoUIKitPrebuiltCallWaitingScreen"
                    component={ZegoUIKitPrebuiltCallWaitingScreen}
                />
                <Stack.Screen
                    name="ZegoUIKitPrebuiltCallInCallScreen"
                    component={ZegoUIKitPrebuiltCallInCallScreen}
                />
            </Stack.Navigator>
            <ZegoUIKitPrebuiltCallFloatingMinimizedView />
        </>
    );
};

export default RootNav;

const styles = StyleSheet.create({});
