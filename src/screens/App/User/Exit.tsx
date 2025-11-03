import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import formStyles from '../../../styles/formStyles';
import textStyles from '../../../styles/textStyles';
import { useAppDispatch } from '../../../utils/hooks';
import { saveChatId } from '../../../redux/chat/chatSlice';
import { logOut } from '../../../redux/auth/authSlice';

const Exit = () => {
    const dispatch = useAppDispatch();

    const logoutHandler = () => {
        dispatch(saveChatId(''));
        dispatch(logOut());
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF',
                paddingHorizontal: 50,
            }}
        >
            <TouchableOpacity
                style={[formStyles.mainBtn]}
                onPress={logoutHandler}
            >
                <Text style={[textStyles.textBold, { color: '#FFF' }]}>
                    Log In
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Exit;

const styles = StyleSheet.create({});
