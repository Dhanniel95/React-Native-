import React, { useEffect } from 'react';
import Layout from '../../../components/Layout';
import ChatHeader from '../../../components/Chat/ChatHeader';
import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../../navigation/AppStack';
import MainChat from '../../../components/Chat/MainChat';
import { clearAllNotifications } from '../../../utils/notification';

const Chat = () => {
    const isFocused = useIsFocused();

    const route = useRoute<RouteProp<AppStackParamList, 'Chat'>>();

    const { params } = route.params;

    useEffect(() => {
        if (isFocused) {
            clearAllNotifications();
        }
    }, [isFocused]);

    return (
        <Layout>
            <ChatHeader headerInfo={params} />
            <MainChat chatInfo={params} />
        </Layout>
    );
};

export default Chat;
