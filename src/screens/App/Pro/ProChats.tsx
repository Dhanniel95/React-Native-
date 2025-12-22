import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import chatService from '../../../redux/chat/chatService';
import textStyles from '../../../styles/textStyles';
import EachChat from '../../../components/Lists/EachChat';
import colors from '../../../utils/colors';
import SkeletonLoad from '../../../components/SkeletonLoad';
import { useAppDispatch } from '../../../utils/hooks';
import { updateUnreadCount } from '../../../redux/chat/chatSlice';

const Chats = () => {
    const dispatch = useAppDispatch();

    const [list, setList] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [load, setLoad] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            listChats();
        }
    }, [isFocused]);

    const listChats = async () => {
        try {
            setLoad(true);
            let res = await chatService.listChatRooms();
            setLoad(false);
            if (Array.isArray(res?.data?.chatRooms)) {
                setList(res.data.chatRooms);
                let count = res.data.chatRooms?.reduce(
                    (a: any, b: any) => a + b.unreadMessages,
                );
                if (!isNaN(count)) {
                    dispatch(updateUnreadCount(count));
                }
            }
        } catch (err) {
            setLoad(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        listChats();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#FFF',
                paddingHorizontal: 20,
                paddingVertical: 15,
            }}
        >
            <Text
                style={[
                    textStyles.textBold,
                    { textAlign: 'center', paddingVertical: 10, fontSize: 17 },
                ]}
            >
                Chats
            </Text>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={list}
                    keyExtractor={(item: any) => item.chat?.chatId?.toString()}
                    renderItem={({ item }) => <EachChat chat={item} />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.dark}
                            colors={[colors.dark]}
                        />
                    }
                    ListEmptyComponent={
                        load ? (
                            <SkeletonLoad count={5} />
                        ) : (
                            <View style={{ marginTop: 100 }}>
                                <Text
                                    style={[
                                        textStyles.text,
                                        { textAlign: 'center', fontSize: 13 },
                                    ]}
                                >
                                    Your Chats will appear here..
                                </Text>
                            </View>
                        )
                    }
                />
            </View>
        </View>
    );
};

export default Chats;
