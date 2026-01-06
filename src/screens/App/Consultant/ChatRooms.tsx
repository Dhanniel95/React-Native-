import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch } from '../../../utils/hooks';
import { useDebounce } from '../../../utils/search';
import { getSocket } from '../../../utils/socket';
import { displayError, displaySuccess } from '../../../utils/display';
import { listNotifications } from '../../../redux/basic/basicSlice';
import chatService from '../../../redux/chat/chatService';
import Header from '../../../components/Header';
import textStyles from '../../../styles/textStyles';
import colors from '../../../utils/colors';
import Icon from '../../../components/Icon';
import ModalComponent from '../../../components/ModalComponent';
import UserForm from '../../../components/User/UserForm';
import ChatTabs from '../../../components/Consultant/ChatTabs';
import EachChat from '../../../components/Lists/EachChat';

const ChatRooms = () => {
    const dispatch = useAppDispatch();

    const isFocused = useIsFocused();

    const [activeTab, setActiveTab] = useState(1);
    const [load, setLoad] = useState(false);
    const [guestList, setGuestList] = useState<any>({});
    const [myGuestList, setMyGuestList] = useState<any>({});
    const [myCustomersList, setMyCustomersList] = useState<any>({});
    const [customersList, setCustomersList] = useState<any>({});
    const [braidersList, setBraidersList] = useState<any>({});
    const [refreshing, setRefreshing] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');

    const [guestTotal, setGuestTotal] = useState(0);
    const [myGuestTotal, setMyGuestTotal] = useState(0);
    const [customerTotal, setCustomerTotal] = useState(0);
    const [myCustomerTotal, setMyCustomerTotal] = useState(0);
    const [braiderTotal, setBraiderTotal] = useState(0);

    const debouncedSearch = useDebounce(search);

    const socket = getSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('message:new:customer', data => {
            listCustomers(data?.data);
            listMyCustomers(data?.data);
        });
        socket.on('message:new', data => {
            listCustomers(data?.data);
            listMyCustomers(data?.data);
            listGuests();
            listMyGuests();
        });
        socket.on('message:new:guest', data => {
            listGuests(data?.data);
            listMyGuests(data?.data);
        });
        socket.on('chatroom:updated', data => {
            listGuests();
            listMyGuests();
            listCustomers();
            listMyCustomers();
            displaySuccess('Hello!', 'Your Chat Room has been updated.');
        });
        socket.on('chatroom:deleted', data => {
            listGuests();
            listMyGuests();
            listCustomers();
            listMyCustomers();
            displaySuccess('Hello!', 'The Chat Room has been Deleted.');
        });
        socket.onAny((event, ...args) => {
            console.log('Got event:', event, args);
        });
    }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            listChats();
        }
    }, [isFocused]);

    useEffect(() => {
        dispatch(listNotifications());
    }, []);

    useEffect(() => {
        if (isFocused) {
            listCustomers();
        }
    }, [debouncedSearch, isFocused]);

    const listChats = async () => {
        listGuests();
        listMyGuests();
        listMyCustomers();
        listBraiders();
    };

    const listMyGuests = async (incoming?: any) => {
        if (incoming?.chat) {
            updateChatCount(3, incoming);
        } else {
            try {
                let res = await chatService.listMyGuestChats();
                if (Array.isArray(res?.data?.data)) {
                    setMyGuestList(res.data);
                    let total = res.data.data.filter(
                        (room: any) => room.unreadMessages > 0,
                    ).length;
                    setMyGuestTotal(total);
                }
            } catch (err) {}
        }
    };

    const listGuests = async (incoming?: any) => {
        if (incoming?.chat) {
            updateChatCount(1, incoming);
        } else {
            try {
                let res = await chatService.listGuestChats();
                if (Array.isArray(res?.data?.chatRooms)) {
                    setGuestList(res.data);
                    let total = res.data.chatRooms.filter(
                        (room: any) => room.unreadMessages > 0,
                    ).length;
                    setGuestTotal(total);
                }
            } catch (err) {}
        }
    };

    const listCustomers = async (incoming?: any) => {
        if (incoming?.chat) {
            updateChatCount(2, incoming);
        } else {
            try {
                setLoad(true);
                let res = await chatService.listCustomersChats(debouncedSearch);
                if (Array.isArray(res?.data?.chatRooms)) {
                    setCustomersList(res.data);
                    let total = res.data.chatRooms.filter(
                        (room: any) => room.unreadMessages > 0,
                    ).length;
                    setCustomerTotal(total);
                }
                setLoad(false);
            } catch (err) {
                setLoad(false);
            }
        }
    };

    const listMyCustomers = async (incoming?: any) => {
        if (incoming?.chat) {
            updateChatCount(4, incoming);
        } else {
            try {
                let res = await chatService.listMyCustomersChats();
                if (Array.isArray(res?.data?.chatRooms)) {
                    setMyCustomersList(res.data);
                    let total = res.data.chatRooms.filter(
                        (room: any) => room.unreadMessages > 0,
                    ).length;
                    setMyCustomerTotal(total);
                }
            } catch (err) {
                displayError(err, true);
            }
        }
    };

    const listBraiders = async () => {
        try {
            let res = await chatService.listBraidersChats();
            if (Array.isArray(res?.data?.chatRooms)) {
                setBraidersList(res.data);
                let total = res.data.chatRooms.filter(
                    (room: any) => room.unreadMessages > 0,
                ).length;
                setBraiderTotal(total);
            }
        } catch (err) {}
    };

    const updateChatCount = (tab: number, incoming: any) => {
        let arr = arrayType('chatRooms', tab);
        let find = arr.find(
            (a: any) => a?.chat?.chatRoomId === incoming?.chat?.chatRoomId,
        );
        if (find) {
            console.log(find, 'FIND');
            let newArr = arr.map((a: any) => {
                if (a?.chat?.chatRoomId === incoming?.chat?.chatRoomId) {
                    a.unreadMessages = a.unreadMessages + 1;
                    a.chat.message = incoming.chat.message;
                }
                return a;
            });
            if (tab === 1) {
                setGuestList({ ...guestList, chatRooms: newArr });
            } else if (tab === 2) {
                setCustomersList({ ...customersList, chatRooms: newArr });
            } else if (tab === 3) {
                setMyGuestList({ ...myGuestList, data: newArr });
            } else if (tab === 4) {
                setMyCustomersList({ ...myCustomersList, chatRooms: newArr });
            } else {
                setBraidersList({ ...braidersList, chatRooms: newArr });
            }
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        listChats();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const arrayType = (type: string, tab?: number) => {
        let mainTab = tab || activeTab;
        if (mainTab === 1) {
            return sortedArr(guestList[type]);
        } else if (mainTab === 2) {
            return sortedArr(customersList[type]);
        } else if (mainTab === 3) {
            return sortedArr(myGuestList?.data);
        } else if (mainTab === 4) {
            return sortedArr(myCustomersList[type]);
        } else {
            return sortedArr(braidersList[type]);
        }
    };

    const sortedArr = (arr: any) => {
        if (Array.isArray(arr) && arr?.length > 0) {
            return arr.slice().sort((a: any, b: any) => {
                const dateA = a.chat?.updatedAt
                    ? new Date(a.chat.updatedAt).getTime()
                    : 0;
                const dateB = b.chat?.updatedAt
                    ? new Date(b.chat.updatedAt).getTime()
                    : 0;
                return dateB - dateA;
            });
        } else {
            return [];
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#FFF',
            }}
        >
            <Header />
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 15 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                >
                    <Text style={[textStyles.textBold, { fontSize: 18 }]}>
                        Consultations
                    </Text>
                    <TouchableOpacity
                        onPress={() => setOpenModal(true)}
                        style={{
                            backgroundColor: colors.secondary,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={[
                                textStyles.textMid,
                                { color: '#FFF', fontSize: 14 },
                            ]}
                        >
                            New User
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20, marginTop: 15 }}>
                    <ChatTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        guestList={guestTotal}
                        braidersList={braiderTotal}
                        customersList={customerTotal}
                        myCustomersList={myCustomerTotal}
                        myGuestList={myGuestTotal}
                    />
                </View>
                {activeTab === 2 && (
                    <View style={{ position: 'relative', marginBottom: 10 }}>
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search"
                            style={styles.input}
                            placeholderTextColor={'rgba(0,0,0,0.3)'}
                        />
                        <View style={styles.pos}>
                            <Icon
                                type="feather"
                                name="search"
                                color={'rgba(0,0,0,0.3)'}
                                size={20}
                            />
                        </View>
                        {load && search && (
                            <ActivityIndicator
                                style={{ marginBottom: 15 }}
                                color={colors.primary}
                            />
                        )}
                    </View>
                )}
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={arrayType('chatRooms')}
                        keyExtractor={(item: any, i: number) => i.toString()}
                        renderItem={({ item }) => (
                            <EachChat
                                chat={item}
                                userType={
                                    activeTab === 1 || activeTab === 3
                                        ? 'guest'
                                        : activeTab === 2 || activeTab === 4
                                        ? 'user'
                                        : 'pro'
                                }
                            />
                        )}
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
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        windowSize={10}
                        removeClippedSubviews={true}
                    />
                </View>
            </View>
            <ModalComponent
                open={openModal}
                closeModal={() => setOpenModal(false)}
                centered
                bg="#334155"
                onlyCancel={true}
            >
                <UserForm
                    onSubmit={() => {
                        displaySuccess(
                            'Congrats!',
                            'The User has been Created. Password will be the name in CAPS without spaces.',
                        );
                        setOpenModal(false);
                    }}
                    userId=""
                />
            </ModalComponent>
        </View>
    );
};

export default ChatRooms;

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        height: 50,
        paddingLeft: 35,
        borderRadius: 20,
        fontFamily: 'regular',
        color: 'rgba(0,0,0,0.3)',
    },
    pos: {
        position: 'absolute',
        top: 14,
        left: 10,
    },
});
