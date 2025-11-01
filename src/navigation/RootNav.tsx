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
import Test2 from '../screens/Test2';

const Stack = createStackNavigator();

const RootNav = () => {
    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    presentation: 'card',
                }}
                initialRouteName="Test2"
            >
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="Test2" component={Test2} />
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
