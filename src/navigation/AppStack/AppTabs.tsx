import React, { useEffect } from 'react';
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
import { getUserInfo } from '../../redux/auth/authSlice';
import Gallery from '../../screens/App/User/Gallery';
import Consult from '../../screens/App/User/Consult';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
    const dispatch = useAppDispatch();

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
        dispatch(getUserInfo());
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

        socket.onAny((event, ...args) => {
            console.log('Got event:', event, args);
        });
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
                {user.role === 'consultant' ? (
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
                        <Tab.Screen
                            name="Profile"
                            component={ConsultantProfile}
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
                    </>
                ) : user.role === 'user' || user.role === 'guest' ? (
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
                ) : (
                    <Tab.Screen
                        name="Home"
                        component={ChatRooms}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon
                                    type="feather"
                                    color={color}
                                    size={22}
                                    name={'message-square'}
                                />
                            ),
                        }}
                    />
                )}
                {user.role !== 'guest' && (
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
                )}
            </Tab.Navigator>
        </Layout>
    );
};

export default AppTabs;
