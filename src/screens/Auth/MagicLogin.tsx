import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthStack';
import authService from '../../redux/auth/authService';
import { getUserInfo, logOut } from '../../redux/auth/authSlice';
import { displayError } from '../../utils/display';
import textStyles from '../../styles/textStyles';
import formStyles from '../../styles/formStyles';
import { getUniqueId } from 'react-native-device-info';
import { getFcmToken } from '../../utils/notification';

const MagicLogin = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigation<any>();

    const route = useRoute<RouteProp<AuthStackParamList, 'MagicLogin'>>();

    const token = route.params ? route.params['magic-token'] : '';

    const { user } = useAppSelector(state => state.auth);

    const [error, setError] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (!user?.userId) {
            loginWithMagicLink();
        }
    }, [token]);

    const loginWithMagicLink = async () => {
        if (token) {
            try {
                let deviceId = await getUniqueId();
                let pushToken = await getFcmToken();
                let payload = {
                    token,
                    deviceId,
                    pushToken,
                };
                await AsyncStorage.removeItem('@accesstoken');
                setLoad(true);
                let res = await authService.magicLinkLogin(payload);
                setLoad(false);
                if (res?.token) {
                    await AsyncStorage.setItem('@accesstoken', res.token);
                }
                let userMagic = res?.user;
                if (userMagic?.userId) {
                    await dispatch(getUserInfo()).unwrap();
                    navigation.navigate('AppTabs');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AppTabs' }],
                    });
                }
            } catch (err) {
                setLoad(false);
                displayError(err, true);
                setError(true);
            }
        } else {
            setError(true);
        }
    };

    const navigateTo = () => {
        if (user?.userId) {
            navigation.navigate('AppTabs');
            navigation.reset({
                index: 0,
                routes: [{ name: 'AppTabs' }],
            });
        } else {
            navigation.navigate('Login');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    };

    const onErrorCancel = () => {
        dispatch(logOut());
        displayError(
            'Please Login Again. There was an issue login you in with the magic link',
            true,
        );
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
                {user?.userId ? (
                    <View style={{ width: '80%' }}>
                        <Text
                            style={[
                                textStyles.textBold,
                                { color: '#FFF', textAlign: 'center' },
                            ]}
                        >
                            You are currently logged in as {user.name}.
                        </Text>
                        <Text
                            style={[
                                textStyles.textBold,
                                {
                                    color: '#FFF',
                                    marginTop: 10,
                                    textAlign: 'center',
                                },
                            ]}
                        >
                            Do you want to proceed with the magic link?
                        </Text>
                        <TouchableOpacity
                            onPress={loginWithMagicLink}
                            disabled={load}
                            style={[formStyles.mainBtn, { marginVertical: 20 }]}
                        >
                            <Text
                                style={[textStyles.textBold, { color: '#FFF' }]}
                            >
                                Login with Magic Link
                            </Text>
                            {load && (
                                <ActivityIndicator
                                    color={'#FFF'}
                                    style={{ marginLeft: 5 }}
                                />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={load}
                            style={[formStyles.mainBtn]}
                            onPress={navigateTo}
                        >
                            <Text
                                style={[textStyles.textBold, { color: '#FFF' }]}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : load ? (
                    <ActivityIndicator color={'#FFF'} />
                ) : (
                    <></>
                )}
                {error && (
                    <View style={{ width: '60%', marginTop: 40 }}>
                        <TouchableOpacity
                            style={[
                                formStyles.mainBtn,
                                { backgroundColor: 'red' },
                            ]}
                            onPress={onErrorCancel}
                        >
                            <Text
                                style={[textStyles.textBold, { color: '#FFF' }]}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

export default MagicLogin;
