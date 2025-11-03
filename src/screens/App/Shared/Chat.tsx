import React from 'react';
import Layout from '../../../components/Layout';
import ChatHeader from '../../../components/Chat/ChatHeader';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../../navigation/AppStack';
import MainChat from '../../../components/Chat/MainChat';

const Chat = () => {
    const route = useRoute<RouteProp<AppStackParamList, 'Chat'>>();

    const { params } = route.params;

    return (
        <Layout>
            <ChatHeader headerInfo={params} />
            <MainChat chatInfo={params} />
        </Layout>
    );
};

export default Chat;
