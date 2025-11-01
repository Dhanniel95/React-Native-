import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNav from './RootNav';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { navigationRef } from '../utils/navigation';

const NavContainer = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <ZegoCallInvitationDialog />
            <RootNav />
        </NavigationContainer>
    );
};

export default NavContainer;
