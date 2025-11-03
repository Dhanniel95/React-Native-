import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAppSelector } from '../../../utils/hooks';
import { getCurrentLocation } from '../../../utils/location';
import basicService from '../../../redux/basic/basicService';
import bookService from '../../../redux/book/bookService';
import Header from '../../../components/Header';

const HomeScreen = () => {
    const navigation = useNavigation<any>();

    const [appointments, setAppointments] = useState<any>([]);
    const [markedDates, setMarkedDates] = useState({});

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        updateLocation();
        listBookings();
    }, []);

    useEffect(() => {
        loadMarkedDates();
    }, [appointments]);

    const loadMarkedDates = () => {
        const groupedByDateWithColor = appointments.reduce(
            (acc: Record<string, { total: number }>, item: any) => {
                const date = new Date(item.pinDate).toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = { total: 0 };
                }
                acc[date].total += item?.invoice?.invoiceFees[0]?.price / 100;
                return acc;
            },
            {},
        );

        const result = Object.entries(groupedByDateWithColor).reduce(
            (
                acc: Record<
                    string,
                    { selected: boolean; selectedColor: string; total: number }
                >,
                [date, value],
            ) => {
                const total = (value as { total: number }).total;
                acc[date] = {
                    selected: total > 0 ? true : false,
                    selectedColor: total >= 50000 ? 'green' : 'red',
                    total: total,
                };
                return acc;
            },
            {},
        );

        setMarkedDates(result);
    };

    const updateLocation = async () => {
        try {
            let coords = await getCurrentLocation();

            if (coords?.coords) {
                await basicService.updateLocation({
                    longitude: coords.coords.longitude,
                    latitude: coords.coords.latitude,
                    phone: user.phone,
                });
            }
        } catch (err) {}
    };

    const listBookings = async () => {
        try {
            let res = await bookService.listBookings();
            if (Array.isArray(res?.data)) {
                let appoints = res.data.filter((item: any) => {
                    return item.pinStatus != null;
                });
                setAppointments(appoints);
            }
        } catch (err) {}
    };

    const scrollToDate = (selectedDate: any) => {
        let find = appointments.filter(
            (book: any) =>
                new Date(book.pinDate).toISOString().split('T')[0] ===
                selectedDate,
        );
        if (find.length > 0) {
            navigation.navigate('BookingList', {
                date: selectedDate,
            });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header />
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                <Calendar
                    onDayPress={day => {
                        scrollToDate(day.dateString);
                    }}
                    markedDates={markedDates}
                />
            </View>
        </View>
    );
};

export default HomeScreen;
