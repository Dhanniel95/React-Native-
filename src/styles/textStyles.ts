import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const textStyles = StyleSheet.create({
    textMid: {
        fontFamily: 'Roboto-Medium',
        color: colors.dark,
        fontSize: 16,
    },
    textBold: {
        fontFamily: 'Roboto-Bold',
        color: colors.dark,
        fontSize: 16,
    },
    text: {
        fontFamily: 'Roboto-Regular',
        color: colors.dark,
        fontSize: 16,
    },
});

export default textStyles;
