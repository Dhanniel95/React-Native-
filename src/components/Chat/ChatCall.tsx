import React, { useState } from 'react';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import ModalComponent from '../ModalComponent';
import colors from '../../utils/colors';
import formStyles from '../../styles/formStyles';
import textStyles from '../../styles/textStyles';

const ChatCall = ({
    userId,
    username,
    phone,
}: {
    userId: number;
    username: string;
    phone: string;
}) => {
    const [openCall, setOpenCall] = useState(false);

    const phoneHandler = () => {
        try {
            let phoneUrl = `tel:${phone}`;
            Linking.openURL(phoneUrl);
        } catch (err) {}
    };

    return (
        <>
            <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => setOpenCall(true)}
            >
                <Icon name="phone" type="feather" />
            </TouchableOpacity>
            <ModalComponent
                open={openCall}
                closeModal={() => setOpenCall(false)}
            >
                <View style={{ alignItems: 'center' }}>
                    <ZegoSendCallInvitationButton
                        invitees={[
                            {
                                userID: `${userId}`,
                                userName: username,
                            },
                        ]}
                        isVideoCall={false}
                        showWaitingPageWhenGroupCall={true}
                        text={'In-App Call'}
                        width={300}
                        height={50}
                        borderRadius={5}
                        backgroundColor={colors.secondary}
                        textColor={'#FFF'}
                        onPressed={(errorCode: any, errorMessage: any) => {
                            if (errorCode == 0) {
                                // Successful
                            } else {
                                // console.log({
                                //     type: ZegoToastType.error,
                                //     text: `error: ${errorCode}\n\n${errorMessage}`,
                                // });
                            }
                        }}
                    />
                    {phone && (
                        <TouchableOpacity
                            onPress={phoneHandler}
                            style={[
                                formStyles.mainBtn,
                                { width: 300, marginTop: 20 },
                            ]}
                        >
                            <Icon
                                type="fontawesome"
                                name="phone"
                                size={22}
                                color={'#FFF'}
                            />
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        color: '#FFF',
                                        fontSize: 14,
                                        marginLeft: 10,
                                    },
                                ]}
                            >
                                Phone Call
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ModalComponent>
        </>
    );
};

export default ChatCall;
