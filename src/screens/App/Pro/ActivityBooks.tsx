import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppStackParamList } from '../../../navigation/AppStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import SkeletonLoad from '../../../components/SkeletonLoad';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import colors from '../../../utils/colors';
import textStyles from '../../../styles/textStyles';
import Icon from '../../../components/Icon';
import { useAppSelector } from '../../../utils/hooks';
import bookService from '../../../redux/book/bookService';
import chatService from '../../../redux/chat/chatService';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/currency';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { formatTime } from '../../../utils/datetime';
import ModalComponent from '../../../components/ModalComponent';

const ActivityBooks = () => {
    const route = useRoute<RouteProp<AppStackParamList, 'ActivityBooks'>>();

    const { itemId } = route.params;

    const { user } = useAppSelector(state => state.auth);

    const navigation = useNavigation<any>();

    const [bookingData, setBookingData] = useState<any>({});
    const [transportation, setTransportation] = useState(0);
    const [sub, setSub] = useState<any>([]);
    const [price, setPrice] = useState(0);
    const [loadChat, setLoadChat] = useState(false);
    const [openCall, setOpenCall] = useState(false);

    useEffect(() => {
        loadBookingInfo();
        getTransport();
    }, []);

    const getTransport = async () => {
        try {
            let res = await bookService.transportInfo();
            if (res?.price) {
                setTransportation(res.price / 100);
            }
        } catch (err) {}
    };

    const loadBookingInfo = async () => {
        try {
            let res = await bookService.loadBookingData(itemId);
            if (res?.user) {
                setBookingData(res);
                setSub(res?.bookedSubServices);
                setPrice(
                    res?.invoice?.invoiceFees?.reduce(
                        (accumulator: any, object: any) => {
                            return accumulator + object.price / 100;
                        },
                        0,
                    ),
                );
            }
        } catch (err) {}
    };

    const isPermitted = () => {
        if (bookingData.pinDate) {
            const now = new Date();
            const target = new Date(bookingData.pinDate);

            const startTime = new Date(target.getTime() - 60 * 60 * 1000);
            const endTime = new Date(target.getTime() + 23 * 60 * 60 * 1000);

            if (now >= startTime && now <= endTime) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    const chatConsultant = async () => {
        try {
            setLoadChat(true);
            let res = await chatService.listChatRooms();
            setLoadChat(false);
            if (
                Array.isArray(res?.data?.chatRooms) &&
                res.data.chatRooms?.length > 0
            ) {
                let find = res.data.chatRooms.find((f: any) =>
                    f.participants.some(
                        (p: any) => p.userId == bookingData?.consultant?.userId,
                    ),
                );
                if (find) {
                    navigation.navigate('Chat', {
                        params: {
                            chatRoomId: find.chat?.chatRoomId,
                            user: find.name,
                            image: find.profilePhotoUrl,
                            newMsg: '1',
                            receiverId: user.userId,
                            isParticipant: `true`,
                        },
                    });
                } else {
                    navigation.navigate('Chat', {
                        params: {
                            chatRoomId: null,
                            user: bookingData.consultant?.name,
                            image: bookingData?.consultant?.profilePhotoUrl,
                            newMsg: '1',
                            receiverId: user.userId,
                            isParticipant: `true`,
                        },
                    });
                }
            } else {
                navigation.navigate('Chat', {
                    params: {
                        chatRoomId: null,
                        user: bookingData.consultant?.name,
                        image: bookingData?.consultant?.profilePhotoUrl,
                        newMsg: '1',
                        receiverId: user.userId,
                        isParticipant: `true`,
                    },
                });
            }
        } catch (err) {
            setLoadChat(false);
        }
    };

    const phoneHandler = () => {
        try {
            let phoneUrl = `tel:${bookingData.user?.phone}`;
            Linking.openURL(phoneUrl);
        } catch (err) {}
    };

    console.log(bookingData, 'bkd');

    return (
        <Layout>
            <GoBack
                bgColor={colors.dark}
                iconColor={colors.white}
                title={'Activity'}
            />
            {bookingData?.user ? (
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 20,
                        paddingVertical: 25,
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    >
                        <View style={styles.topContainer}>
                            <Image
                                style={{
                                    height: 70,
                                    width: 70,
                                    borderRadius: 35,
                                }}
                                source={
                                    bookingData?.user?.faceIdPhotoUrl == null
                                        ? require('../../../assets/images/profile.png')
                                        : {
                                              uri: bookingData?.user
                                                  ?.faceIdPhotoUrl,
                                          }
                                }
                            />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={[textStyles.textBold]}>
                                    {bookingData?.user?.name}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                {
                                    marginBottom: 20,
                                    flexDirection: 'row',
                                    justifyContent: isPermitted()
                                        ? 'center'
                                        : 'space-between',
                                    flexWrap: 'wrap',
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    isPermitted()
                                        ? setOpenCall(true)
                                        : Alert.alert(
                                              'Note:',
                                              'You can only reach customer one hour before the appointment date',
                                          );
                                }}
                            >
                                <Icon
                                    type="fontawesome"
                                    name="phone"
                                    size={22}
                                    color={'#FFF'}
                                />
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        {
                                            color: '#FFF',
                                            fontSize: 14,
                                            marginLeft: 10,
                                        },
                                    ]}
                                >
                                    {user.userId === bookingData?.pro?.userId
                                        ? 'Call Customer'
                                        : 'Call Head Braider'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.btn,
                                    { marginTop: isPermitted() ? 20 : 0 },
                                ]}
                                onPress={chatConsultant}
                                disabled={loadChat}
                            >
                                {loadChat ? (
                                    <ActivityIndicator color={'#FFF'} />
                                ) : (
                                    <Icon
                                        type="feather"
                                        color={'#FFF'}
                                        size={22}
                                        name={'message-square'}
                                    />
                                )}
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        {
                                            color: '#FFF',
                                            fontSize: 14,
                                            marginLeft: 10,
                                        },
                                    ]}
                                >
                                    Consultant
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}>
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        color: colors.mildGray,
                                        fontSize: 14,
                                        marginBottom: 2,
                                    },
                                ]}
                            >
                                Customer's Address:
                            </Text>
                            <Text style={[textStyles.textMid]}>
                                {bookingData?.address}
                            </Text>
                            <Text style={[textStyles.text, { marginTop: 3 }]}>
                                <Icon
                                    type="materialcommunityicons"
                                    name="map-marker"
                                    color={colors.primary}
                                    size={20}
                                />{' '}
                                {(
                                    bookingData?.invoice?.distance || 0 / 1000
                                ).toFixed(1)}{' '}
                                km away
                            </Text>
                        </View>
                        <View style={styles.line}>
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        color: colors.mildGray,
                                        fontSize: 14,
                                        marginBottom: 2,
                                    },
                                ]}
                            >
                                Booking Type:
                            </Text>
                            <Text style={[textStyles.textMid]}>
                                {bookingData?.assistants?.length > 0
                                    ? 'VIP Service'
                                    : 'Regular Premium'}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.line,
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                },
                            ]}
                        >
                            <View style={{ width: '50%' }}>
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        {
                                            color: colors.mildGray,
                                            fontSize: 14,
                                            marginBottom: 2,
                                        },
                                    ]}
                                >
                                    Head Braider:
                                </Text>
                                <Text style={[textStyles.textMid]}>
                                    {bookingData?.pro?.name}
                                </Text>
                            </View>
                            {bookingData?.assistants?.map(
                                (book: any, i: number) => (
                                    <View style={{ width: '50%' }} key={i + 1}>
                                        <Text
                                            style={[
                                                textStyles.textMid,
                                                {
                                                    color: colors.mildGray,
                                                    fontSize: 14,
                                                    marginBottom: 2,
                                                },
                                            ]}
                                        >
                                            Assistant:
                                        </Text>
                                        <Text style={[textStyles.textMid]}>
                                            {book?.assistant?.name}
                                        </Text>
                                    </View>
                                ),
                            )}
                        </View>
                        <View style={styles.line}>
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        color: colors.mildGray,
                                        fontSize: 14,
                                        marginBottom: 2,
                                    },
                                ]}
                            >
                                Service:
                            </Text>
                            {sub?.map((s: any, i: number) => (
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        { marginTop: 4 },
                                    ]}
                                    key={i + 1}
                                >
                                    {s?.subService?.name}
                                </Text>
                            ))}
                        </View>
                        <View style={[styles.line]}>
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        color: colors.mildGray,
                                        fontSize: 14,
                                        marginBottom: 2,
                                    },
                                ]}
                            >
                                Duration:
                            </Text>
                            <Text style={[textStyles.textMid]}>
                                {formatTime(
                                    sub.reduce(
                                        (a: any, b: any) =>
                                            a + b.subService.duration,
                                        0,
                                    ),
                                )}
                            </Text>
                        </View>
                        <View style={styles.line}>
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        color: colors.mildGray,
                                        fontSize: 14,
                                        marginBottom: 2,
                                    },
                                ]}
                            >
                                Price:
                            </Text>
                            <Text style={[textStyles.textMid]}>
                                ₦{formatCurrency(price)}
                            </Text>
                        </View>
                        {bookingData.pinDate && (
                            <View style={[styles.line]}>
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        {
                                            color: colors.mildGray,
                                            fontSize: 14,
                                            marginBottom: 2,
                                        },
                                    ]}
                                >
                                    Appointment Date:
                                </Text>
                                <Text style={[textStyles.textMid]}>
                                    {format(
                                        bookingData.pinDate,
                                        'do MMMM, yyyy hh:mm a',
                                    )}
                                </Text>
                            </View>
                        )}
                        {bookingData.description && (
                            <View style={[styles.line]}>
                                <Text
                                    style={[
                                        textStyles.textMid,
                                        {
                                            color: colors.mildGray,
                                            fontSize: 14,
                                            marginBottom: 2,
                                        },
                                    ]}
                                >
                                    Description:
                                </Text>
                                <Text style={[textStyles.textMid]}>
                                    {bookingData.description?.text || '--'}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            ) : (
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <SkeletonLoad count={6} />
                </View>
            )}
            <ModalComponent
                open={openCall}
                closeModal={() => setOpenCall(false)}
            >
                <View style={{ alignItems: 'center' }}>
                    <ZegoSendCallInvitationButton
                        invitees={[
                            user.userId === bookingData?.pro?.userId
                                ? {
                                      userID: `${bookingData?.user?.userId}`,
                                      userName: bookingData.user?.name,
                                  }
                                : {
                                      userID: `${bookingData?.pro?.userId}`,
                                      userName: bookingData.pro?.name,
                                  },
                        ]}
                        isVideoCall={false}
                        showWaitingPageWhenGroupCall={true}
                        text={'In-App Call'}
                        width={300}
                        height={50}
                        borderRadius={5}
                        backgroundColor={colors.secondary}
                        textColor={'#FFF'}
                        onPressed={(errorCode: any, errorMessage: any) => {
                            if (errorCode == 0) {
                                // Successful
                            } else {
                                // console.log({
                                //     type: ZegoToastType.error,
                                //     text: `error: ${errorCode}\n\n${errorMessage}`,
                                // });
                            }
                        }}
                    />
                    <TouchableOpacity
                        style={[styles.btn, { width: 300, marginTop: 20 }]}
                        onPress={phoneHandler}
                    >
                        <Icon
                            type="fontawesome"
                            name="phone"
                            size={22}
                            color={'#FFF'}
                        />
                        <Text
                            style={[
                                textStyles.textMid,
                                {
                                    color: '#FFF',
                                    fontSize: 14,
                                    marginLeft: 10,
                                },
                            ]}
                        >
                            Phone Call
                        </Text>
                    </TouchableOpacity>
                </View>
            </ModalComponent>
        </Layout>
    );
};

export default ActivityBooks;

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    btn: {
        backgroundColor: colors.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        justifyContent: 'center',
    },
    line: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        paddingVertical: 6,
    },
});
