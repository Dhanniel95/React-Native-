import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getUserInfo } from '../../redux/auth/authSlice';
import textStyles from '../../styles/textStyles';
import formStyles from '../../styles/formStyles';

const GuestToUser = ({ closeModal }: { closeModal: () => void }) => {
    const navigation = useNavigation<any>();

    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        dispatch(getUserInfo());
    }, []);

    const reloadHandler = async () => {
        closeModal();
        if (user.changePassword) {
            navigation.navigate('ChangePassword', {
                change: true,
            });
        }
    };

    return (
        <View style={{ paddingVertical: 20 }}>
            <Text
                style={[textStyles.textMid, { marginBottom: 20, fontSize: 14 }]}
            >
                {user?.changePassword
                    ? `Welcome, ${user?.name}.`
                    : `Welcome Back, ${user?.name}`}
            </Text>
            <TouchableOpacity
                style={[formStyles.mainBtn]}
                onPress={reloadHandler}
            >
                <Text style={[textStyles.textBold, { color: '#FFF' }]}>
                    CLOSE
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default GuestToUser;
