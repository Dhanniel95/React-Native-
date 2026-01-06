import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import textStyles from '../../styles/textStyles';
import formStyles from '../../styles/formStyles';

const GalleryCheck = ({ onClick }: { onClick: () => void }) => {
    const navigation = useNavigation<any>();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 500,
                paddingHorizontal: '10%',
            }}
        >
            <Text
                style={[textStyles.text, { textAlign: 'center', fontSize: 14 }]}
            >
                Kindly send a video of your prefered style to start the
                conversation
            </Text>
            <TouchableOpacity
                onPress={() => {
                    onClick();
                    navigation.navigate('Gallery');
                }}
                style={[
                    formStyles.mainBtn,
                    { marginTop: 25, borderRadius: 15 },
                ]}
            >
                <Text
                    style={[textStyles.text, { color: '#FFF', fontSize: 14 }]}
                >
                    Check Gallery
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default GalleryCheck;
