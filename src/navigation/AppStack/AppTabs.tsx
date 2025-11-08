import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import Layout from '../../components/Layout';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../../utils/colors';
import ChatRooms from '../../screens/App/Consultant/ChatRooms';
import Icon from '../../components/Icon';
import Settings from '../../screens/App/Shared/Settings';
import ConsultantProfile from '../../screens/App/Consultant/ConsultantProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectSocket, disconnectSocket } from '../../utils/socket';
import baseUrl from '../../utils/config';
import { getUserInfo, logOut, saveUserData } from '../../redux/auth/authSlice';
import Gallery from '../../screens/App/User/Gallery';
import Consult from '../../screens/App/User/Consult';
import UserProfile from '../../screens/App/User/UserProfile';
import ProHome from '../../screens/App/Pro/ProHome';
import ProProfile from '../../screens/App/Pro/ProProfile';
import ProChats from '../../screens/App/Pro/ProChats';
import { Alert, TouchableOpacity } from 'react-native';
import Exit from '../../screens/App/User/Exit';
import { saveChatId } from '../../redux/chat/chatSlice';
import { onUserLogin } from '../../utils/zego';
import ModalComponent from '../../components/ModalComponent';
import GuestToUser from '../../components/User/GuestToUser';
import { onboardAcc } from '../../redux/basic/basicSlice';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
    const dispatch = useAppDispatch();

    const [openUser, setOpenUser] = useState(false);

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        const init = async () => {
            try {
                await connectToSocket();
            } catch (err) {
                console.log('Init error:', err);
            }
        };

        const timeout = setTimeout(init, 0);

        return () => {
            clearTimeout(timeout);
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (user.role !== 'guest') {
            dispatch(getUserInfo());
            onUserLogin(`${user.userId}`, user.name, user.faceIdPhotoUrl);
        }
    }, []);

    const connectToSocket = async () => {
        const token = (await AsyncStorage.getItem('@accesstoken')) || '';

        const socket = connectSocket(baseUrl, token, user.role);

        socket.on('connect', () => {
            console.log('Connected');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });

        socket.on('connect_error', err => {
            console.log('Error With Connection', err);
        });

        socket.on('auth:new-token', async data => {
            if (data?.data?.token) {
                await AsyncStorage.setItem('@accesstoken', data.data.token);
                dispatch(
                    saveUserData({
                        ...data.data.user,
                        changePassword: data.data?.changePassword,
                    }),
                );
                setOpenUser(true);
            }
        });

        // socket.onAny((event, ...args) => {
        //     console.log('Got event:', event, args);
        // });
    };

    const logoutHandler = () => {
        dispatch(saveChatId(''));
        dispatch(onboardAcc());
        dispatch(logOut());
    };

    return (
        <Layout>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.dark,
                    tabBarLabelStyle: {
                        fontFamily: 'Poppins-Medium',
                        fontSize: 12,
                    },
                    tabBarStyle: {
                        height: 60,
                        paddingTop: 5,
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
                safeAreaInsets={{ bottom: 0, top: 0 }}
            >
                {user.role === 'consultant' && (
                    <>
                        <Tab.Screen
                            name="Consult"
                            component={ChatRooms}
                            options={{
                                tabBarIcon: ({ color }) => (
                                    <Icon
                                        type="feather"
                                        color={color}
                                        size={20}
                                        name={'message-square'}
                                    />
                                ),
                            }}
                        />
                    </>
                )}
                {(user.role === 'user' || user.role === 'guest') && (
                    <>
                        <Tab.Screen
                            name="Gallery"
                            component={Gallery}
                            options={{
                                tabBarIcon: ({ color }) => (
                                    <Icon
                                        type="feather"
                                        color={color}
                                        size={20}
                                        name={'image'}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Consult"
                            component={Consult}
                            options={{
                                tabBarIcon: ({ color }) => (
                                    <Icon
                                        type="feather"
                                        color={color}
                                        size={20}
                                        name={'message-square'}
                                    />
                                ),
                                tabBarStyle: {
                                    display: 'none',
                                },
                            }}
                        />
                    </>
                )}
                {user.role === 'pro' && (
                    <Tab.Screen
                        name="Home"
                        component={ProHome}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon
                                    type="feather"
                                    color={color}
                                    size={20}
                                    name={'home'}
                                />
                            ),
                        }}
                    />
                )}

                {user.role !== 'guest' && (
                    <>
                        <Tab.Screen
                            name="Profile"
                            component={
                                user.role === 'consultant'
                                    ? ConsultantProfile
                                    : user.role === 'pro'
                                    ? ProProfile
                                    : UserProfile
                            }
                            options={{
                                tabBarIcon: ({ color }) => (
                                    <Icon
                                        type="feather"
                                        color={color}
                                        size={20}
                                        name={'user'}
                                    />
                                ),
                            }}
                        />
                        {user.role === 'pro' && (
                            <Tab.Screen
                                name="Chats"
                                component={ProChats}
                                options={{
                                    tabBarIcon: ({ color }) => (
                                        <Icon
                                            type="feather"
                                            color={color}
                                            size={20}
                                            name={'message-square'}
                                        />
                                    ),
                                }}
                            />
                        )}
                        <Tab.Screen
                            name="Settings"
                            component={Settings}
                            options={{
                                tabBarIcon: ({ color }) => (
                                    <Icon
                                        type="feather"
                                        color={color}
                                        size={22}
                                        name={'settings'}
                                    />
                                ),
                            }}
                        />
                    </>
                )}
                {user.role === 'guest' && (
                    <Tab.Screen
                        name="Log In"
                        component={Exit}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon
                                    type="feather"
                                    color={color}
                                    size={22}
                                    name={'log-in'}
                                />
                            ),
                            tabBarButton: props => {
                                return (
                                    <TouchableOpacity
                                        {...props}
                                        onPress={() => {
                                            Alert.alert(
                                                'Log In',
                                                'Log In to Hairsap to access more',
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'Login',
                                                        onPress: () =>
                                                            logoutHandler(),
                                                    },
                                                ],
                                            );
                                        }}
                                    />
                                );
                            },
                        }}
                    />
                )}
            </Tab.Navigator>
            <ModalComponent open={openUser} closeModal={() => console.log('')}>
                <GuestToUser closeModal={() => setOpenUser(false)} />
            </ModalComponent>
        </Layout>
    );
};

export default AppTabs;
