import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import InputField from '../Basics/InputField';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import authService from '../../redux/auth/authService';
import { getUserInfo } from '../../redux/auth/authSlice';
import { displayError, displaySuccess } from '../../utils/display';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import formStyles from '../../styles/formStyles';
import colors from '../../utils/colors';
import textStyles from '../../styles/textStyles';

const UpdateFields = ({
    closeModal,
    editType,
}: {
    closeModal: () => void;
    editType: string;
}) => {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);

    const [value, setValue] = useState('');
    const [load, setLoad] = useState(false);

    const submitHandler = async () => {
        if (value) {
            if (editType === 'email') {
                const emailReg =
                    /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
                if (!emailReg.test(value)) {
                    Alert.alert('Email must be valid');
                    return;
                }
            }
            try {
                let payload =
                    editType === 'email'
                        ? {
                              email: value,
                              phone: user.phone,
                          }
                        : { phone: value };
                setLoad(true);
                await authService.editProfile(payload);
                dispatch(getUserInfo());
                setLoad(false);
                displaySuccess('Phone number successfully updated');
                closeModal();
            } catch (err) {
                setLoad(false);
                displayError(err, true);
            }
        }
    };

    return (
        <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{}}
        >
            <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
                <InputField
                    val={value}
                    setVal={setValue}
                    placeholder={`Enter your ${
                        editType === 'email' ? 'Email' : 'Phone Number'
                    }`}
                    label={`Edit ${
                        editType === 'email' ? 'Email Address' : 'Phone Number'
                    }`}
                />
                <TouchableOpacity
                    onPress={submitHandler}
                    style={[
                        formStyles.mainBtn,
                        { backgroundColor: colors.secondary, marginTop: 20 },
                    ]}
                    disabled={load}
                >
                    {load ? (
                        <ActivityIndicator color={'#FFF'} />
                    ) : (
                        <Text style={[textStyles.textBold, { color: '#FFF' }]}>
                            Continue
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default UpdateFields;
