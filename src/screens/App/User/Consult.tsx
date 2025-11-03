import { View } from 'react-native';
import React, { useEffect } from 'react';
import ChatHeader from '../../../components/Chat/ChatHeader';
import MainChat from '../../../components/Chat/MainChat';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import chatService from '../../../redux/chat/chatService';
import { consultantChatting, saveChatId } from '../../../redux/chat/chatSlice';

const Consult = () => {
    const dispatch = useAppDispatch();

    const { userChatRoomId } = useAppSelector(state => state.chat);
    const { consultantChat } = useAppSelector(state => state.chat);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            let res = await chatService.listChatRooms();
            if (
                Array.isArray(res?.data?.chatRooms) &&
                res?.data?.chatRooms?.length > 0
            ) {
                let id = res.data.chatRooms[0].chatRoomId;
                let receiver = res.data.chatRooms[0]?.chat?.receiver;
                dispatch(saveChatId(id));
                dispatch(consultantChatting(receiver));
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
