import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { onUserLogin, onUserLogout } from '../utils/zego';

const Test = () => {
    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Button
                title="Login IPhone 16 e"
                onPress={() => onUserLogin('16', 'Esther')}
            />
            <Button
                title="Login IPhone 17 Pro"
                onPress={() => onUserLogin('14', 'Olawale')}
            />

            <Text style={{ marginTop: 40 }}>Call Iphone 17</Text>
            <ZegoSendCallInvitationButton
                invitees={[{ userID: '14', userName: 'Olawale' }]}
                isVideoCall={false}
                resourceID={'zego_data'}
                showWaitingPageWhenGroupCall={true}
                onPressed={(errorCode, errorMessage, errorInvitees) => {
                    if (errorCode == 0) {
                        console.log(errorMessage, 'Error Here');
                    } else {
                        console.log(errorCode, 'ERROCo', errorInvitees);
                        Alert.alert('Error', errorMessage);
                    }
                }}
            />
            <Button title="Logout" onPress={() => onUserLogout()} />
        </View>
    );
};

export default Test;

const styles = StyleSheet.create({});
