import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNav from './RootNav';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { navigationRef } from '../utils/navigation';
import Login from '../screens/Auth/Login';

const NavContainer = () => {
    return (
        <NavigationContainer
            ref={navigationRef}
            linking={{
                prefixes: ['hairsap://', 'https://hairsap.com'],
                config: { screens: { Login: '' } },
            }}
        >
            <ZegoCallInvitationDialog />
            <RootNav />
        </NavigationContainer>
    );
};

export default NavContainer;
