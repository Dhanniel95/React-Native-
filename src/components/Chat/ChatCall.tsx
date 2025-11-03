import React from 'react';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { ZegoToastType } from '@zegocloud/zego-uikit-rn';

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
                    console.log({
                        type: ZegoToastType.error,
                        text: `error: ${errorCode}\n\n${errorMessage}`,
                    });
                }
            }}
        />
    );
};

export default ChatCall;
