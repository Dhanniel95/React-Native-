import React, { useEffect } from 'react';
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
};

const NavContainer = () => {
    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            console.log('🔗 Received URL while running:', event.url);

            // Parse the URL into a navigation state using your linking config
            const state = getStateFromPath(event.url, linking.config);

            if (state && navigationRef.current) {
                console.log(
                    '🧭 Parsed state from URL:',
                    JSON.stringify(state, null, 2),
                );
                navigationRef.current.resetRoot(state);
            } else {
                console.warn(
                    '⚠️ Could not parse or handle deep link:',
                    event.url,
                );
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => subscription.remove();
    }, []);

    return (
        <NavigationContainer ref={navigationRef} linking={linking}>
            <ZegoCallInvitationDialog />
            <RootNav />
        </NavigationContainer>
    );
};

export default NavContainer;
