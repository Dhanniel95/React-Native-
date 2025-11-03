import React from 'react';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { Alert } from 'react-native';

const ChatCall = ({
    userId,
    username,
}: {
    userId: number;
    username: string;
}) => {
    return (
        <ZegoSendCallInvitationButton
            invitees={[
                {
                    userID: `${userId}`,
                    userName: username,
                },
            ]}
            isVideoCall={false}
            showWaitingPageWhenGroupCall={true}
            onPressed={(errorCode: any, errorMessage: any) => {
                if (errorCode == 0) {
                    // Successful
                } else {
                    if (errorCode === 6000281) {
                        Alert.alert(
                            'Error',
                            'Unable to reach user. Try again later.',
                        );
                    } else {
                        Alert.alert('Error', errorMessage.toString());
                    }
                }
            }}
        />
    );
};

export default ChatCall;
