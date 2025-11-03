import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { useAppSelector } from '../utils/hooks';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const RootNav = () => {
    useEffect(() => {
        const init = async () => {};
        init().finally(async () => {
            await BootSplash.hide({ fade: true });
        });
    }, []);

    const { user } = useAppSelector(state => state.auth);

    return user?.userId ? <AppStack /> : <AuthStack />;
};

export default RootNav;
