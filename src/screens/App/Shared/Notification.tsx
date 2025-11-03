import { FlatList, Text, View } from 'react-native';
import React from 'react';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import { useAppSelector } from '../../../utils/hooks';
import textStyles from '../../../styles/textStyles';
import EachNotification from '../../../components/Lists/EachNotification';

const Notification = () => {
    const { notiList } = useAppSelector(state => state.basic);

    return (
        <Layout>
            <GoBack title="Notifications" />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: '8%',
                    paddingVertical: 40,
                }}
            >
                {notiList?.length > 0 ? (
                    <FlatList
                        data={notiList}
                        keyExtractor={(item: any) => item.id.toString()}
                        renderItem={({ item }) => (
                            <EachNotification item={item} />
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <Text
                        style={[
                            textStyles.text,
                            { marginTop: '30%', textAlign: 'center' },
                        ]}
                    >
                        You have no notifications yet
                    </Text>
                )}
            </View>
        </Layout>
    );
};

export default Notification;
