import { RouteProp, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { AppStackParamList } from '../../../navigation/AppStack';
import bookService from '../../../redux/book/bookService';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import colors from '../../../utils/colors';
import textStyles from '../../../styles/textStyles';
import SkeletonLoad from '../../../components/SkeletonLoad';
import EachAccepted from '../../../components/Lists/EachAccepted';

const BookingList = () => {
    const route = useRoute<RouteProp<AppStackParamList, 'BookingList'>>();

    const { date } = route.params;

    const [load, setLoad] = useState(false);
    const [list, setList] = useState<any>([]);

    useEffect(() => {
        listBookings();
    }, []);

    const listBookings = async () => {
        try {
            setLoad(true);
            let res = await bookService.listBookings();
            if (Array.isArray(res?.data)) {
                let filter = res.data.filter(
                    (book: any) =>
                        new Date(book.pinDate).toISOString().split('T')[0] ===
                        date,
                );
                setList(filter);
            }
            setLoad(false);
        } catch (err) {
            setLoad(false);
        }
    };

    return (
        <Layout>
            <GoBack
                bgColor={colors.dark}
                iconColor={colors.white}
                title={'Accepted Bookings'}
            />
            <View
                style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 25 }}
            >
                {date ? (
                    <Text
                        style={[
                            textStyles.textMid,
                            { textAlign: 'center', marginBottom: 25 },
                        ]}
                    >
                        {format(date, 'do MMMM, yyyy')}
                    </Text>
                ) : (
                    <></>
                )}
                {load ? (
                    <SkeletonLoad count={5} />
                ) : (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={list}
                            keyExtractor={(item: any) =>
                                item.bookingId.toString()
                            }
                            renderItem={({ item }) => (
                                <EachAccepted booking={item} />
                            )}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )}
            </View>
        </Layout>
    );
};

export default BookingList;
