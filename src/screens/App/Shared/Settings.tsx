import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { useNavigation } from '@react-navigation/native';
import { saveChatId } from '../../../redux/chat/chatSlice';
import { logOut } from '../../../redux/auth/authSlice';
import authService from '../../../redux/auth/authService';
import { displayError } from '../../../utils/display';
import textStyles from '../../../styles/textStyles';
import ButtonSettings from '../../../components/Basics/ButtonSettings';
import { onboardAcc } from '../../../redux/basic/basicSlice';

const Settings = () => {
    const { user } = useAppSelector(state => state.auth);

    const dispatch = useAppDispatch();

    const navigation = useNavigation<any>();

    const logoutHandler = async () => {
        dispatch(onboardAcc());
        dispatch(saveChatId(''));
        dispatch(logOut());
        await AsyncStorage.removeItem('@accesstoken');
    };

    const deactivateHandler = async () => {
        try {
            await authService.deactivateAccount();
            logoutHandler();
        } catch (err) {
            displayError(err, true);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Text
                style={[
                    textStyles.textBold,
                    { textAlign: 'center', paddingVertical: 10, fontSize: 17 },
                ]}
            >
                Settings
            </Text>
            <View style={{ flex: 1, paddingHorizontal: '8%' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        {user.role === 'pro' ||
                            (user.role === 'user' && (
                                <ButtonSettings
                                    name="Transaction History"
                                    iconName="menu"
                                    onPress={() =>
                                        navigation.navigate('History')
                                    }
                                />
                            ))}
                        <ButtonSettings
                            name="Change Password"
                            iconName="face-man-profile"
                            onPress={() =>
                                navigation.navigate('ChangePassword')
                            }
                        />
                        {user.role === 'user' && (
                            <ButtonSettings
                                name="Discount"
                                iconName="percent"
                                onPress={() => navigation.navigate('Discount')}
                            />
                        )}
                        <ButtonSettings
                            name="Terms of Service"
                            iconName="newspaper"
                            onPress={() => navigation.navigate('Terms')}
                        />
                        <ButtonSettings
                            name="Privacy Policy"
                            iconName="shield-alert-outline"
                            onPress={() => navigation.navigate('Policy')}
                        />
                        <ButtonSettings
                            name="Log Out"
                            iconName="logout"
                            onPress={() =>
                                Alert.alert(
                                    'Logout',
                                    'Are you sure you want to logout?',
                                    [
                                        { text: 'NO' },
                                        {
                                            text: 'LOGOUT',
                                            onPress: () => logoutHandler(),
                                        },
                                    ],
                                )
                            }
                        />
                        {user.role === 'user' && (
                            <>
                                <View style={{ height: 50 }} />
                                <ButtonSettings
                                    name="Deactivate Account"
                                    iconName="cancel"
                                    onPress={() =>
                                        Alert.alert(
                                            'Deactivate Account',
                                            'Are you sure you want to deactivate your account?',
                                            [
                                                { text: 'NO' },
                                                {
                                                    text: 'Deactivate',
                                                    onPress: () =>
                                                        deactivateHandler(),
                                                    style: 'destructive',
                                                },
                                            ],
                                        )
                                    }
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Settings;
