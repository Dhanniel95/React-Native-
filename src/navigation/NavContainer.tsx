import React, { useEffect, useRef } from 'react';
import {
    NavigationContainer,
    getStateFromPath,
} from '@react-navigation/native';
import RootNav from './RootNav';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { navigationRef } from '../utils/navigation';
import { Linking } from 'react-native';

const linking = {
    prefixes: ['hairsap://', 'https://www.hairsap.com', 'https://hairsap.com'],
    config: {
        screens: {
            MagicLogin: 'login',
        },
    },
    async getInitialURL() {
        const url = await Linking.getInitialURL();
        console.log('🚀 getInitialURL', url);
        return url;
    },

    subscribe(listener: (url: string) => void) {
        const onReceiveURL = ({ url }: { url: string }) => {
            console.log('📥 subscribe URL', url);
            listener(url);
        };

        const subscription = Linking.addEventListener('url', onReceiveURL);

        return () => subscription.remove();
    },
};

const NavContainer = () => {
    const isReadyRef = useRef(false);

    return (
        <NavigationContainer
            ref={navigationRef}
            linking={linking}
            onReady={() => {
                isReadyRef.current = true;
                console.log('✅ Navigation READY');
            }}
            onStateChange={() => {
                console.log('🧭 Navigation STATE changed');
            }}
        >
            {/* <ZegoCallInvitationDialog /> */}
            <RootNav />
        </NavigationContainer>
    );
};

export default NavContainer;
