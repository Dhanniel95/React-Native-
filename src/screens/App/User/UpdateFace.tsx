import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch } from '../../../utils/hooks';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera';
import authService from '../../../redux/auth/authService';
import { displayError, displaySuccess } from '../../../utils/display';
import { getUserInfo } from '../../../redux/auth/authSlice';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import colors from '../../../utils/colors';
import textStyles from '../../../styles/textStyles';
import formStyles from '../../../styles/formStyles';
import { Permission, PERMISSION_TYPE } from '../../../utils/permission';

const UpdateFace = () => {
    const navigation = useNavigation();

    const dispatch = useAppDispatch();

    const device = useCameraDevice('front');

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [image, setImage] = useState('');
    const [screenState, setScreenState] = useState('');
    const [load, setLoad] = useState(false);

    const cameraRef = useRef<Camera>(null);

    const { hasPermission } = useCameraPermission();

    useEffect(() => {
        if (hasPermission) {
            setHasCameraPermission(true);
        } else {
            setHasCameraPermission(false);
        }
    }, []);

    const accessHandler = async () => {
        await Permission.requestMultiple([PERMISSION_TYPE.camera]);
    };

    const takePicture = async () => {
        try {
            const photo = await cameraRef.current?.takePhoto({ flash: 'off' });
            if (photo) {
                let photoFile = `file://${photo.path}`;
                setImage(photoFile);
                submitImage(photoFile);
            }
        } catch (err) {}
    };

    const submitImage = async (uri: any) => {
        try {
            const form = new FormData();
            form.append('faceid', {
                name: 'faceid.jpg',
                uri: uri,
                type: 'image/jpeg',
            });
            setLoad(true);
            await authService.uploadFaceId(form);
            displaySuccess('Congrats', 'Your Image has been Uploaded');
            let res = await dispatch(getUserInfo()).unwrap();
            setLoad(false);
            if (res) {
                navigation.goBack();
            }
        } catch (err) {
            setLoad(false);
            displayError(err, true);
        }
    };

    return (
        <Layout>
            <GoBack
                bgColor={colors.dark}
                iconColor={colors.white}
                title="Face Verification"
            />
            {screenState === 'failed' ? (
                <View style={styles.loadingScreen}>
                    <Image
                        source={require('../../../assets/images/no_face.png')}
                        style={{ height: 200, width: '80%', marginBottom: 30 }}
                    />

                    <Text
                        style={[
                            textStyles.text,
                            { fontSize: 14, textAlign: 'center', width: '90%' },
                        ]}
                    >
                        Sorry! We couldn't detect a face. please retake one
                        where your faces shows.
                    </Text>
                    <View style={{ width: '100%', paddingHorizontal: '10%' }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setScreenState('');
                                setImage('');
                            }}
                            style={[
                                formStyles.mainBtn,
                                {
                                    backgroundColor: colors.secondary,
                                    marginTop: 30,
                                },
                            ]}
                        >
                            <Text
                                style={[textStyles.textBold, { color: '#FFF' }]}
                            >
                                Retake
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : screenState === 'loading' ? (
                <View style={styles.loadingScreen}>
                    <Image
                        source={require('../../../assets/images/animation.gif')}
                        style={{ height: 300, width: 300, marginBottom: 25 }}
                    />
                    <Text
                        style={[
                            textStyles.text,
                            { fontSize: 14, textAlign: 'center', width: '90%' },
                        ]}
                    >
                        Please hold while we process your face biometrics
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.imgContainer}>
                        {hasCameraPermission ? (
                            image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={{
                                        transform: [{ scaleX: -1 }],
                                        height: '100%',
                                        width: '100%',
                                    }}
                                />
                            ) : device ? (
                                <Camera
                                    style={{ flex: 1 }}
                                    device={device}
                                    photo={true}
                                    isActive={true}
                                    ref={cameraRef}
                                />
                            ) : (
                                <></>
                            )
                        ) : (
                            <Image
                                source={require('../../../assets/images/camera2.jpg')}
                                style={{
                                    transform: [{ scaleX: -1 }],
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        )}
                    </View>
                    {!hasCameraPermission ? (
                        <>
                            <Text
                                style={[
                                    textStyles.textMid,
                                    {
                                        paddingHorizontal: 50,
                                        textAlign: 'center',
                                        marginTop: 20,
                                    },
                                ]}
                            >
                                Ensure you have enabled Camera permissions for
                                this app
                            </Text>
                            <TouchableOpacity
                                onPress={accessHandler}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 25,
                                }}
                            >
                                <Text style={[textStyles.textMid]}>Reload</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={{ width: '100%', paddingHorizontal: 30 }}>
                            <View style={styles.explanation}>
                                <Text
                                    style={[
                                        textStyles.text,
                                        { marginBottom: 15, fontSize: 13 },
                                    ]}
                                >
                                    * Make sure your face shows clearly and
                                    you're in a well-lit room
                                </Text>

                                <Text
                                    style={[textStyles.text, { fontSize: 13 }]}
                                >
                                    * This is to help create a secured
                                    environment for our beauty pros when they
                                    come into your private space.
                                </Text>
                            </View>
                        </View>
                    )}
                    {device && hasCameraPermission && (
                        <View
                            style={{ width: '100%', paddingHorizontal: '10%' }}
                        >
                            <TouchableOpacity
                                disabled={load}
                                style={[
                                    formStyles.mainBtn,
                                    {
                                        backgroundColor: colors.secondary,
                                        marginTop: 30,
                                    },
                                ]}
                                onPress={takePicture}
                            >
                                {load ? (
                                    <ActivityIndicator color={'#FFF'} />
                                ) : (
                                    <Text
                                        style={[
                                            textStyles.textBold,
                                            { color: '#FFF' },
                                        ]}
                                    >
                                        Scan my Face
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </Layout>
    );
};

export default UpdateFace;

const styles = StyleSheet.create({
    imgContainer: {
        alignSelf: 'center',
        width: 250,
        height: 250,
        overflow: 'hidden',
        borderRadius: 125,
        marginTop: 30,
        borderWidth: 2,
        borderColor: colors.lightGreen,
    },
    explanation: {
        backgroundColor: colors.appGray,
        padding: 15,
        width: '100%',
        borderRadius: 12,
        marginTop: 35,
        fontFamily: 'regular',
    },
    loadingScreen: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        paddingHorizontal: 30,
    },
});
