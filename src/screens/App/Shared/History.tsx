import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import bookService from '../../../redux/book/bookService';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import colors from '../../../utils/colors';
import textStyles from '../../../styles/textStyles';
import EachTransaction from '../../../components/Lists/EachTransaction';

const HistoryScreen = () => {
    const [list, setList] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        listTransactions();
    }, []);

    const listTransactions = async () => {
        try {
            setLoad(true);
            let res = await bookService.listTransactionHistory();
            if (Array.isArray(res)) {
                setList(res.reverse());
            }
        } catch (err) {
            setLoad(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        listTransactions();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <Layout>
            <GoBack
                bgColor={colors.dark}
                iconColor={colors.white}
                title="Transaction History"
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: '8%',
                    paddingVertical: 40,
                }}
            >
                {list.length > 0 ? (
                    <FlatList
                        data={list}
                        keyExtractor={(item: any) => item.id.toString()}
                        renderItem={({ item }) => (
                            <EachTransaction item={item} />
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
                    />
                ) : (
                    <Text
                        style={[
                            textStyles.text,
                            { marginTop: '50%', textAlign: 'center' },
                        ]}
                    >
                        You have no transactions yet
                    </Text>
                )}
            </View>
        </Layout>
    );
};

export default HistoryScreen;
