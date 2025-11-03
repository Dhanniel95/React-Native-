import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../../utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../../navigation/AppStack';
import authService from '../../../redux/auth/authService';
import { displayError, displaySuccess } from '../../../utils/display';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import colors from '../../../utils/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputField from '../../../components/Basics/InputField';
import formStyles from '../../../styles/formStyles';
import textStyles from '../../../styles/textStyles';

const ChangePassword = () => {
    const navigation = useNavigation<any>();

    const { user } = useAppSelector(state => state.auth);

    const route = useRoute<RouteProp<AppStackParamList, 'ChangePassword'>>();

    const changeParams = route.params?.change;

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (changeParams) {
            setPassword('password');
        }
    }, [changeParams]);

    const submitHandler = async () => {
        if (password) {
            if (newPassword && newPassword === confirmPassword) {
                try {
                    let payload = {
                        newPassword,
                        oldPassword: password,
                    };

                    setLoad(true);
                    await authService.changePassword(
                        changeParams ? { newPassword } : payload,
                    );
                    setLoad(false);
                    displaySuccess('Password successfully updated');
                    if (changeParams && user.role === 'user') {
                        navigation.navigate('Gallery');
                    }
                } catch (err) {
                    setLoad(false);
                    displayError(err, true);
                }
            } else {
                displayError('Passwords Mismatch', true);
            }
        }
    };

    return (
        <Layout>
            <GoBack
                bgColor={colors.dark}
                iconColor={colors.white}
                title="Change Password"
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: '8%',
                    paddingVertical: 40,
                }}
            >
                <KeyboardAwareScrollView
                    enableAutomaticScroll={true}
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{}}
                >
                    {!changeParams && (
                        <InputField
                            label="Old Password"
                            val={password}
                            setVal={setPassword}
                            password={true}
                        />
                    )}
                    <InputField
                        label="New Password"
                        val={newPassword}
                        setVal={setNewPassword}
                        password={true}
                    />
                    <InputField
                        label="Confirm New Password"
                        val={confirmPassword}
                        setVal={setConfirmPassword}
                        password={true}
                    />
                    <TouchableOpacity
                        style={[
                            formStyles.mainBtn,
                            {
                                backgroundColor: colors.secondary,
                                marginTop: 20,
                            },
                        ]}
                        disabled={load}
                        onPress={submitHandler}
                    >
                        {load ? (
                            <ActivityIndicator color={'#FFF'} />
                        ) : (
                            <Text
                                style={[textStyles.textBold, { color: '#FFF' }]}
                            >
                                Reset
                            </Text>
                        )}
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        </Layout>
    );
};

export default ChangePassword;
