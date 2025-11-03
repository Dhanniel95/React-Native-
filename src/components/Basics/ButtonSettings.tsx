import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import colors from '../../utils/colors';
import textStyles from '../../styles/textStyles';

const ButtonSettings = ({
    iconName,
    name,
    onPress,
}: {
    iconName: string;
    name: string;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            style={styles.btn}
            delayPressIn={50}
            onPress={onPress}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View style={styles.icon}>
                    <Icon
                        type="materialcommunityicons"
                        name={iconName}
                        color={colors.dark}
                        size={20}
                    />
                </View>
                <Text style={[textStyles.textMid]}>{name}</Text>
            </View>
            <Icon
                type="materialcommunityicons"
                name="chevron-right"
                size={25}
            />
        </TouchableOpacity>
    );
};

export default ButtonSettings;

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.white,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        justifyContent: 'space-between',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.09)',
    },
    icon: {
        height: 40,
        width: 40,
        borderRadius: 10,
        backgroundColor: colors.appGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
});
