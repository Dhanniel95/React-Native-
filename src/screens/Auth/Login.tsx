import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Logo from '../../assets/images/logo-light.svg';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { useNavigation } from '@react-navigation/native';
import { loginGuest, loginUser } from '../../redux/auth/authSlice';
import { getFcmToken } from '../../utils/notification';
import { getUniqueId } from 'react-native-device-info';
import { displayError } from '../../utils/display';
import LinearGradient from 'react-native-linear-gradient';
import textStyles from '../../styles/textStyles';
import formStyles from '../../styles/formStyles';
import colors from '../../utils/colors';
import FloatInput from '../../components/Basics/FloatInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onUserLogin } from '../../utils/zego';

const Login = () => {
    const dispatch = useAppDispatch();

    const insets = useSafeAreaInsets();

    const navigation = useNavigation<any>();

    const { loading } = useAppSelector(state => state.auth);

    const [pass, setPass] = useState('');
    const [phone, setPhone] = useState('');
    const [load, setLoad] = useState(false);

    const submitHandler = async () => {
        if (phone && pass) {
            let res = await dispatch(
                loginUser({ phone: phone.trim(), password: pass.trim() }),
            ).unwrap();
            loadStream(res);
        }
    };

    const loadStream = async (user: any) => {
        if (user.userId) {
            await onUserLogin(`${user.userId}`, user.name, user.faceIdPhotoUrl);
        }
    };

    const registerGuest = async () => {
        try {
            setLoad(true);
            const token = await getFcmToken();
            const deviceId = await getUniqueId();
            let payload = {
                deviceId,
                token: token || undefined,
                role: 'guest',
            };
            dispatch(loginGuest(payload));
        } catch (err) {
            displayError(
                'An error has occured. Please login or create an account',
                true,
            );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#02302E', '#022220', '#000000']}
                style={{ flex: 1 }}
            >
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        paddingTop: Platform.OS == 'android' ? 30 : 0,
                    }}
                >
                    <View style={{ paddingTop: insets.top + 20 }} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, paddingHorizontal: '8%' }}>
                            <View
                                style={{ alignItems: 'center', marginTop: 20 }}
                            >
                                <Logo width={150} />
                                <Text
                                    style={[
                                        textStyles.textBold,
                                        {
                                            fontSize: 22,
                                            color: '#FFF',
                                            marginTop: 20,
                                        },
                                    ]}
                                >
                                    Welcome Back
                                </Text>
                                <Text
                                    style={[
                                        textStyles.text,
                                        { color: '#FFF', textAlign: 'center' },
                                    ]}
                                >
                                    Enter your phone number and password
                                </Text>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <FloatInput
                                    label="Phone Number"
                                    value={phone}
                                    setValue={setPhone}
                                    number={true}
                                    maxLength={11}
                                    dark={true}
                                />
                                <FloatInput
                                    label="Password"
                                    value={pass}
                                    setValue={setPass}
                                    password={true}
                                    dark={true}
                                />
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'flex-end',
                                        marginTop: 10,
                                        marginBottom: 20,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate(
                                                'ForgotPassword',
                                            )
                                        }
                                    >
                                        <Text
                                            style={[
                                                textStyles.textMid,
                                                { color: colors.mildGray },
                                            ]}
                                        >
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={[formStyles.mainBtn]}
                                    disabled={loading || load}
                                    onPress={submitHandler}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={'#FFF'} />
                                    ) : (
                                        <Text
                                            style={[
                                                textStyles.textBold,
                                                { color: '#FFF' },
                                            ]}
                                        >
                                            Log In
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <View
                                    style={{
                                        marginTop: 30,
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.lightGray,
                                            fontFamily: 'regular',
                                        }}
                                    >
                                        New to Hairsap?{'  '}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('Register')
                                        }
                                    >
                                        <Text
                                            style={[
                                                textStyles.textMid,
                                                { color: colors.mildGray },
                                            ]}
                                        >
                                            Create an account
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    {load ? (
                                        <ActivityIndicator color={'#FFF'} />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={registerGuest}
                                            disabled={loading}
                                            style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#FFF',
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    textStyles.textBold,
                                                    {
                                                        color: '#FFF',
                                                        fontSize: 16,
                                                    },
                                                ]}
                                            >
                                                Skip
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
};

export default Login;
