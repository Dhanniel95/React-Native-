import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';

const Icon = ({
    type,
    name,
    size,
    color,
}: {
    type:
        | 'feather'
        | 'antdesign'
        | 'entypo'
        | 'fontawesome6'
        | 'fontawesome'
        | 'materialicons'
        | 'ionicons'
        | 'materialcommunityicons';
    size?: number;
    color?: string;
    name: string;
}) => {
    const { colors } = useTheme();

    return type === 'feather' ? (
        <Feather name={name} size={size || 20} color={color || colors.text} />
    ) : type === 'entypo' ? (
        <Entypo name={name} size={size || 20} color={color || colors.text} />
    ) : type === 'antdesign' ? (
        <AntDesign name={name} size={size || 20} color={color || colors.text} />
    ) : type === 'fontawesome' ? (
        <FontAwesome
            name={name}
            size={size || 20}
            color={color || colors.text}
        />
    ) : type === 'fontawesome6' ? (
        <FontAwesome6
            name={name}
            size={size || 20}
            color={color || colors.text}
        />
    ) : type === 'materialicons' ? (
        <MaterialIcons
            name={name}
            size={size || 20}
            color={color || colors.text}
        />
    ) : type === 'ionicons' ? (
        <Ionicons name={name} size={size || 20} color={color || colors.text} />
    ) : type === 'materialcommunityicons' ? (
        <MaterialCommunityIcons
            name={name}
            size={size || 20}
            color={color || colors.text}
        />
    ) : (
        <></>
    );
};

export default Icon;
