import React from 'react';
import AutoGuest from '../../screens/Auth/AutoGuest';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../../screens/Auth/Login';
import Register from '../../screens/Auth/Register';
import { useAppSelector } from '../../utils/hooks';
import Terms from '../../screens/App/Shared/Terms';
import Policy from '../../screens/App/Shared/Policy';
import ForgotPassword from '../../screens/Auth/ForgotPassword';
import MagicLogin from '../../screens/Auth/MagicLogin';

export type AuthStackParamList = {
    AutoGuest: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Terms: undefined;
    Policy: undefined;
    MagicLogin: { 'magic-token': string };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    const { onboarded } = useAppSelector(state => state.basic);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                presentation: 'card',
            }}
            initialRouteName={onboarded ? 'Login' : 'AutoGuest'}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="AutoGuest" component={AutoGuest} />
            <Stack.Screen name="Terms" component={Terms} />
            <Stack.Screen name="Policy" component={Policy} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="MagicLogin" component={MagicLogin} />
        </Stack.Navigator>
    );
};

export default AuthStack;
