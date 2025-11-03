import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Logo from '../assets/images/logo-dark.svg';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../utils/hooks';
import Icon from './Icon';
import colors from '../utils/colors';

const Header = () => {
    const navigation = useNavigation<any>();

    const { notiList } = useAppSelector(state => state.basic);

    return (
        <View style={styles.header}>
            <View>
                <Logo width={150} />
            </View>
            <TouchableOpacity
                style={{ position: 'relative' }}
                onPress={() => navigation.navigate('Notifications')}
            >
                <Icon type="fontawesome" name="bell" size={24} color={'#000'} />
                <View style={styles.badge}>
                    <Text style={{ color: colors.white, fontSize: 9 }}>
                        {notiList?.length || 0}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.midGray,
        height: 60,
    },
    badge: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        height: 14,
        width: 14,
        borderRadius: 7,
        right: -4,
        top: -4,
        backgroundColor: colors.danger,
    },
});
