import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../../utils/hooks';
import textStyles from '../../../styles/textStyles';
import Icon from '../../../components/Icon';
import colors from '../../../utils/colors';
import ModalComponent from '../../../components/ModalComponent';
import UpdateFields from '../../../components/User/UpdateFields';

const UserProfile = () => {
    const navigation = useNavigation<any>();

    const { user } = useAppSelector(state => state.auth);

    const [openModal, setOpenModal] = useState(false);
    const [editType, setEditType] = useState('');

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Text
                style={[
                    textStyles.textBold,
                    { textAlign: 'center', paddingVertical: 10, fontSize: 17 },
                ]}
            >
                Profile
            </Text>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <View
                    style={{
                        position: 'relative',
                    }}
                >
                    <Image
                        source={
                            user.faceIdPhotoUrl
                                ? { uri: user.faceIdPhotoUrl }
                                : require('../../../assets/images/profile.png')
                        }
                        style={styles.img}
                    />
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => navigation.navigate('UpdateFace')}
                    >
                        <Icon
                            type="ionicons"
                            name="camera"
                            size={20}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>
                <Text
                    style={[
                        textStyles.textBold,
                        { fontSize: 20, marginTop: 20 },
                    ]}
                >
                    {user.name}
                </Text>
            </View>
            <View style={{ paddingHorizontal: '10%', marginTop: 30 }}>
                <View style={styles.divider}>
                    <View>
                        <Text style={[textStyles.textBold]}>Email:</Text>
                        <Text style={[textStyles.text]}>
                            {user?.email || 'Email not set'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            setEditType('email');
                            setOpenModal(true);
                        }}
                    >
                        <Icon
                            type="materialcommunityicons"
                            name="pencil"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}>
                    <View>
                        <Text style={[textStyles.textBold]}>Phone:</Text>
                        <Text style={[textStyles.text]}>
                            {user?.phone || 'Phone not set'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            setEditType('phone');
                            setOpenModal(true);
                        }}
                    >
                        <Icon
                            type="materialcommunityicons"
                            name="pencil"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ModalComponent
                open={openModal}
                closeModal={() => setOpenModal(false)}
                centered={true}
            >
                <UpdateFields
                    closeModal={() => setOpenModal(false)}
                    editType={editType}
                />
            </ModalComponent>
        </View>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    img: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: colors.lightGreen,
    },
    iconContainer: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        right: 0,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.appGray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15,
        marginBottom: 20,
    },
    btn: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: colors.appGray,
    },
});
