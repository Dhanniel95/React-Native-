import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ActivityIndicator, ImageBackground, View } from 'react-native';
import { useAppDispatch } from '../../utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthStack';
import authService from '../../redux/auth/authService';
import { getUserInfo } from '../../redux/auth/authSlice';
import { displayError } from '../../utils/display';

const MagicLogin = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigation<any>();

    const route = useRoute<RouteProp<AuthStackParamList, 'MagicLogin'>>();

    const token = route.params['magic-token'];

    useEffect(() => {
        loginWithMagicLink();
    }, [token]);

    const loginWithMagicLink = async () => {
        if (token) {
            try {
                let res = await authService.magicLinkLogin(token);
                if (res?.token) {
                    await AsyncStorage.setItem('@accesstoken', res.token);
                }
                let user = res?.user;
                if (user?.userId) {
                    dispatch(getUserInfo());
                }
            } catch (err) {
                displayError(err, true);
                navigation.navigate('Login');
            }
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/hairsap_home.png')}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator color={'#fff'} size={'large'} />
            </View>
        </ImageBackground>
    );
};

export default MagicLogin;
