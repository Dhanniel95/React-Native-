import { View } from 'react-native';
import React, { useEffect } from 'react';
import ChatHeader from '../../../components/Chat/ChatHeader';
import MainChat from '../../../components/Chat/MainChat';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import chatService from '../../../redux/chat/chatService';
import {
    consultantChatting,
    saveChatId,
    updateUnreadCount,
} from '../../../redux/chat/chatSlice';
import { useIsFocused } from '@react-navigation/native';
import { clearAllNotifications } from '../../../utils/notification';

const Consult = ({ route }: { route: any }) => {
    const dispatch = useAppDispatch();

    const isFocused = useIsFocused();

    const { userChatRoomId, consultantChat } = useAppSelector(
        state => state.chat,
    );
    const { user } = useAppSelector(state => state.auth);

    const reload = route?.params?.reload;

    useEffect(() => {
        if (isFocused) {
            clearAllNotifications();
            loadRooms();
            console.log('loadog?');
        }
    }, [isFocused, reload]);

    const loadRooms = async () => {
        try {
            let res = await chatService.listChatRooms();

            if (
                Array.isArray(res?.data?.chatRooms) &&
                res?.data?.chatRooms?.length > 0
            ) {
                let id = res.data.chatRooms[0].chatRoomId;
                let sender = res.data.chatRooms[0]?.chat?.sender;
                let receiver = res.data.chatRooms[0]?.chat?.receiver;
                let count = res.data.chatRooms[0]?.unreadMessages;
                dispatch(saveChatId(id));
                dispatch(
                    consultantChatting(
                        sender?.userId == user.userId ? receiver : sender,
                    ),
                );
                dispatch(updateUnreadCount(count));
            } else {
                dispatch(saveChatId(''));
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ChatHeader
                headerInfo={{
                    user: 'Consultant',
                    image: consultantChat?.profilePhotoUrl,
                }}
            />
            <MainChat chatInfo={{ chatRoomId: userChatRoomId }} />
        </View>
    );
};

export default Consult;
