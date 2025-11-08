import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Icon from '../Icon';
import bookService from '../../redux/book/bookService';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../utils/hooks';

const ActivePlayer = ({
    video,
    isActive,
}: {
    video: any;
    isActive: boolean;
}) => {
    const { user } = useAppSelector(state => state.auth);

    const navigation = useNavigation<any>();

    const videoRef = useRef<any>(null);

    const [loadC, setLoadC] = useState(false);
    const [paused, setPaused] = useState(!isActive);
    const [muted, setMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [load, setLoad] = useState(false);

    // useEffect(() => {
    //     setPaused(!isActive);
    // }, [isActive]);

    const handleLoad = (meta: any) => {
        setLoad(false);
        setDuration(meta.duration);
    };

    const handleProgress = (progress: any) => {
        setCurrentTime(progress.currentTime);
    };

    const handleEnd = () => {
        videoRef.current?.seek(0);
        setPaused(true);
    };

    const handleSeek = (value: any) => {
        videoRef.current?.seek(value);
        setCurrentTime(value);
    };

    const seekHandler = async () => {
        try {
            setLoadC(true);
            await bookService.seekConsultation({
                userId: user.userId,
                galleryId: video.galleryId,
                galleryItemId: video.galleryId,
            });
            setLoadC(false);
            setPaused(true);
            navigation.navigate('AppTabs', { screen: 'Consult' });
        } catch (err) {
            setLoadC(false);
        }
    };

    return (
        <View style={{ height: '100%', backgroundColor: '#000', flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => setPaused(!paused)}>
                <Video
                    ref={videoRef}
                    source={{ uri: video.mediaUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    paused={paused}
                    muted={muted}
                    onLoad={handleLoad}
                    onProgress={handleProgress}
                    onEnd={handleEnd}
                    repeat={false}
                    onLoadStart={() => setLoad(true)}
                />
            </TouchableWithoutFeedback>
            <View style={styles.textArea}>
                <TouchableOpacity
                    onPress={() => {
                        seekHandler();
                    }}
                    activeOpacity={0.8}
                    disabled={loadC}
                    style={{
                        backgroundColor: '#14A79F',
                        alignItems: 'center',
                        paddingVertical: 15,
                        borderRadius: 10,
                        position: 'relative',
                        zIndex: 9999991,
                    }}
                >
                    {loadC ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={{ fontFamily: 'regular', color: '#FFF' }}>
                            Seek Consultation
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.controlsContainer}>
                <Slider
                    style={{ flex: 1 }}
                    value={currentTime}
                    minimumValue={0}
                    maximumValue={duration}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="rgba(255,255,255,0.4)"
                    thumbTintColor="#fff"
                />
                <Pressable
                    onPress={() => setMuted(!muted)}
                    style={styles.muteButton}
                >
                    <Icon
                        type="ionicons"
                        name={muted ? 'volume-mute' : 'volume-high'}
                        size={24}
                        color="white"
                    />
                </Pressable>
            </View>
            {load && (
                <View
                    style={{
                        ...StyleSheet.absoluteFill,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        zIndex: 9999993,
                    }}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
        </View>
    );
};

export default ActivePlayer;

const styles = StyleSheet.create({
    textArea: {
        position: 'absolute',
        bottom: 80,
        width: '100%',
        paddingHorizontal: 30,
    },
    muteButton: {
        marginLeft: 10,
        padding: 5,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        zIndex: 991,
    },
});
