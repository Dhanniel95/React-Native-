import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChatCall from './ChatCall';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../utils/hooks';
import Icon from '../Icon';
import textStyles from '../../styles/textStyles';
import colors from '../../utils/colors';

const ChatHeader = ({ headerInfo }: { headerInfo: any }) => {
    const navigation = useNavigation<any>();

    const { user } = useAppSelector(state => state.auth);
    const { usersOnline } = useAppSelector(state => state.chat);

    const [openMenu, setOpenMenu] = useState(false);

    const openHandler = () => {
        if (user.role === 'consultant') {
            setOpenMenu(!openMenu);
        }
    };

    console.log(headerInfo, 'headerInfo');

    const isOnline = () => {
        if (usersOnline.includes(headerInfo?.receiverId as never)) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 10,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        paddingRight: 15,
                        paddingVertical: 10,
                    }}
                >
                    <Icon
                        type="feather"
                        name="arrow-left"
                        color={'#000'}
                        size={25}
                    />
                </TouchableOpacity>
                <Image
                    source={
                        headerInfo.image
                            ? { uri: headerInfo.image }
                            : require('../../assets/images/hairsap.png')
                    }
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={[textStyles.textBold, { fontSize: 15 }]}>
                        {headerInfo.user}
                    </Text>
                    <Text style={[textStyles.text, { fontSize: 13 }]}>
                        {user.role === 'user' || user.role === 'guest'
                            ? 'Available (7am - 7pm)'
                            : isOnline()
                            ? 'Online'
                            : 'Active'}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {user.role !== 'guest' &&
                    headerInfo.receiverId &&
                    headerInfo.user && (
                        <ChatCall
                            userId={headerInfo.receiverId}
                            username={headerInfo.user}
                            phone={headerInfo.userPhone}
                        />
                    )}
                <TouchableOpacity onPress={openHandler}>
                    <Icon
                        type="entypo"
                        name="dots-three-vertical"
                        size={20}
                        color="black"
                    />
                </TouchableOpacity>
            </View>
            {openMenu && (
                <View style={styles.pos}>
                    <TouchableOpacity
                        style={{ marginBottom: 10 }}
                        onPress={() => {
                            setOpenMenu(false);
                            navigation.navigate('BookingSummary', {
                                params: { userId: headerInfo?.receiverId },
                            });
                        }}
                    >
                        <Text style={[textStyles.textMid, { fontSize: 14 }]}>
                            Booking Summaries
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[textStyles.textMid, { fontSize: 14 }]}>
                            Settings
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ChatHeader;

const styles = StyleSheet.create({
    pos: {
        position: 'absolute',
        right: 30,
        top: 70,
        zIndex: 99991,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
});
