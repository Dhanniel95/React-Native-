import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
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
import authService from '../../redux/auth/authService';
import { useAppDispatch } from '../../utils/hooks';
import { getUserInfo } from '../../redux/auth/authSlice';
import { displayError } from '../../utils/display';
import Layout from '../../components/Layout';
import GoBack from '../../components/GoBack';
import colors from '../../utils/colors';
import FloatInput from '../../components/Basics/FloatInput';
import formStyles from '../../styles/formStyles';
import textStyles from '../../styles/textStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Register = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigation<any>();

    const [load, setLoad] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [fname, setFname] = useState('');
    const [phone, setPhone] = useState('');

    const submitHandler = async () => {
        if (fname && phone && confirmPassword && password) {
            if (phone.length === 11) {
                if (password && password === confirmPassword) {
                    try {
                        let payload = {
                            name: fname.trim(),
                            phone: phone.trim(),
                            password: password.trim(),
                            role: 'user',
                        };
                        setLoad(true);
                        let res = await authService.register(payload);
                        setLoad(false);
                        if (res?.data?.token) {
                            await AsyncStorage.setItem(
                                '@accesstoken',
                                res.data.token,
                            );
                        }
                        dispatch(getUserInfo());
                    } catch (err) {
                        setLoad(false);
                        displayError(err, true);
                    }
                } else {
                    displayError('Passwords do not match', true);
                }
            } else {
                displayError('Please enter a valid phone number', true);
            }
        } else {
            displayError('Please fill all fields!', true);
        }
    };

    return (
        <Layout>
            <View style={{ flex: 1, paddingVertical: 10 }}>
                <GoBack
                    bgColor={colors.dark}
                    iconColor={colors.white}
                    title="Register"
                />
                <KeyboardAwareScrollView
                    enableAutomaticScroll={true}
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{}}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: '8%',
                            paddingTop: 20,
                        }}
                    >
                        <FloatInput
                            label="Full Name"
                            value={fname}
                            setValue={setFname}
                        />
                        <FloatInput
                            label="Mobile Number"
                            value={phone}
                            setValue={setPhone}
                            number={true}
                            maxLength={11}
                        />
                        <FloatInput
                            label="Password"
                            value={password}
                            setValue={setPassword}
                            password={true}
                        />
                        <FloatInput
                            label="Confirm Password"
                            value={confirmPassword}
                            setValue={setconfirmPassword}
                            password={true}
                        />
                        <TouchableOpacity
                            style={[
                                formStyles.mainBtn,
                                {
                                    backgroundColor: colors.secondary,
                                    marginVertical: 20,
                                },
                            ]}
                            disabled={load}
                            onPress={submitHandler}
                        >
                            {load ? (
                                <ActivityIndicator color={'#FFF'} />
                            ) : (
                                <Text
                                    style={[
                                        textStyles.textBold,
                                        { color: '#FFF' },
                                    ]}
                                >
                                    Continue
                                </Text>
                            )}
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                marginVertical: 20,
                            }}
                        >
                            <Text
                                style={[
                                    textStyles.textMid,
                                    { color: colors.mediumGray },
                                ]}
                            >
                                By proceeding, you agree with our{' '}
                            </Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Terms')}
                            >
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        { color: colors.mildGray },
                                    ]}
                                >
                                    Terms and Conditions
                                </Text>
                            </TouchableOpacity>

                            <Text
                                style={[
                                    textStyles.textMid,
                                    { color: colors.mediumGray },
                                ]}
                            >
                                {' '}
                                and{' '}
                            </Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Policy')}
                            >
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        { color: colors.mildGray },
                                    ]}
                                >
                                    Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </Layout>
    );
};

export default Register;
