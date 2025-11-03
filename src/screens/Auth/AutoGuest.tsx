import { ActivityIndicator, ImageBackground, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import textStyles from '../../styles/textStyles';
import { getFcmToken } from '../../utils/notification';
import { getUniqueId } from 'react-native-device-info';
import { displayError } from '../../utils/display';
import { useAppDispatch } from '../../utils/hooks';
import { loginGuest } from '../../redux/auth/authSlice';
import { useNavigation } from '@react-navigation/native';

const AutoGuest = () => {
    const navigation = useNavigation<any>();

    const dispatch = useAppDispatch();

    const [loadState, setLoadState] = useState('token');

    useEffect(() => {
        setup();
    }, []);

    const setup = async () => {
        const token = await getFcmToken();
        const deviceId = await getUniqueId();
        if (token && deviceId) {
            registerGuest(deviceId, token);
        } else {
            navigation.navigate('Login');
            console.log(
                displayError(
                    'An error has occured. Please Contact Admin.',
                    false,
                ),
            );
        }
    };

    const registerGuest = async (deviceId: any, token: any) => {
        try {
            setLoadState('load');
            let payload = {
                deviceId,
                token: token || undefined,
                role: 'guest',
            };
            console.log(payload, 'payload');
            //dispatch(loginGuest(payload))
        } catch (err) {
            navigation.navigate('Login');
            displayError(err, true);
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
                <Text
                    style={[
                        textStyles.text,
                        { fontSize: 12, color: '#FFF', marginTop: 5 },
                    ]}
                >
                    {loadState === 'load'
                        ? 'Please Wait...'
                        : 'Getting App Info...'}
                </Text>
            </View>
        </ImageBackground>
    );
};

export default AutoGuest;
