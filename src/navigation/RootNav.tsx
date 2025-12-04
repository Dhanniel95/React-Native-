import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { useAppSelector } from '../utils/hooks';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { initNotifications } from '../utils/notification';

const RootNav = () => {
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        const init = async () => {};
        init().finally(async () => {
            await BootSplash.hide({ fade: true });
            initNotifications(user.role);
        });
    }, []);

    return user?.userId ? <AppStack /> : <AuthStack />;
};

export default RootNav;
