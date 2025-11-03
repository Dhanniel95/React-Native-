import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalComponent from '../ModalComponent';
import Video from 'react-native-video';
import InputField from '../Basics/InputField';
import Icon from '../Icon';
import textStyles from '../../styles/textStyles';
import UploadField from '../Basics/UploadField';
import colors from '../../utils/colors';

const FileMenu = ({ onSend }: { onSend: (arg: any) => void }) => {
    const [media, setMedia] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [openMedia, setOpenMedia] = useState(false);
    const [text, setText] = useState('');

    useEffect(() => {
        if (media) {
            setOpenMedia(true);
        }
    }, [media]);

    const sendHandler = () => {
        let payload = {
            url: media,
            text,
            type: mediaType,
        };
        onSend(payload);
    };

    return (
        <View style={styles.box}>
            <UploadField
                setLoad={() => console.log('')}
                setUrl={arg => {
                    setMedia(arg);
                    setMediaType('images');
                }}
                type="images"
                style={{ marginHorizontal: 15, alignItems: 'center' }}
            >
                <View style={styles.innerBox}>
                    <Icon
                        type="feather"
                        name="image"
                        size={20}
                        color={'#FFF'}
                    />
                </View>
                <Text
                    style={[
                        textStyles.textMid,
                        { fontSize: 12, color: '#FFF', marginTop: 6 },
                    ]}
                >
                    Select Image
                </Text>
            </UploadField>

            <UploadField
                setLoad={() => console.log('')}
                setUrl={arg => {
                    setMedia(arg);
                    setMediaType('videos');
                }}
                type="videos"
                style={{ marginHorizontal: 15, alignItems: 'center' }}
            >
                <View style={styles.innerBox}>
                    <Icon
                        type="feather"
                        name="video"
                        size={20}
                        color={'#FFF'}
                    />
                </View>
                <Text
                    style={[
                        textStyles.textMid,
                        { fontSize: 12, color: '#FFF', marginTop: 6 },
                    ]}
                >
                    Select Video
                </Text>
            </UploadField>

            <ModalComponent
                open={openMedia}
                closeModal={() => setOpenMedia(false)}
                centered
            >
                <KeyboardAwareScrollView
                    enableAutomaticScroll={true}
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{}}
                >
                    <View style={{ width: '100%', height: 350 }}>
                        <View style={{ position: 'relative', height: 250 }}>
                            {mediaType === 'images' ? (
                                <Image
                                    source={{ uri: media }}
                                    style={{ width: '100%', height: 250 }}
                                />
                            ) : (
                                <Video
                                    source={{ uri: media }}
                                    style={{ flex: 1 }}
                                    resizeMode="contain"
                                    paused={true}
                                    repeat={false}
                                    controls
                                />
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 20,
                            }}
                        >
                            <View style={{ width: '80%' }}>
                                <InputField
                                    val={text}
                                    setVal={setText}
                                    placeholder="Type Message"
                                />
                            </View>
                            <View style={{ marginLeft: 10, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={styles.sendBtn}
                                    onPress={sendHandler}
                                >
                                    <Icon
                                        type="ionicons"
                                        name="send"
                                        size={20}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ModalComponent>
        </View>
    );
};

export default FileMenu;

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#334155',
        borderRadius: 4,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    innerBox: {
        backgroundColor: '#E5E5E533',
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45 / 2,
    },
    sendBtn: {
        backgroundColor: colors.primary,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
