import React, { useRef, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    Image,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import Video from 'react-native-video';
import Icon from '../Icon';

interface ChatVideoProps {
    uri: string;
    others: any;
    load?: boolean;
}

const ChatVideo = ({ uri, others, load = false }: ChatVideoProps) => {
    const videoRef = useRef<any>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setFullscreen(true);
                    setPaused(false);
                }}
            >
                <Image
                    source={{ uri: others.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
                <View style={styles.playOverlay}>
                    <Icon type="ionicons" name="play" size={32} color="white" />
                </View>
            </TouchableOpacity>

            {load && (
                <ActivityIndicator
                    size="small"
                    color="white"
                    style={styles.inlineLoader}
                />
            )}

            <Modal visible={fullscreen} animationType="fade">
                <View style={styles.fullscreenContainer}>
                    <Video
                        ref={videoRef}
                        source={{ uri }}
                        style={styles.fullscreenVideo}
                        resizeMode="contain"
                        repeat={false}
                        paused={paused}
                        onLoadStart={() => setLoading(true)}
                        onLoad={() => setLoading(false)}
                        onEnd={() => setPaused(true)}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setPaused(true);
                            setFullscreen(false);
                        }}
                        style={styles.closeBtn}
                    >
                        <Icon
                            type="ionicons"
                            name="close"
                            size={28}
                            color="white"
                        />
                    </TouchableOpacity>
                    {loading && (
                        <ActivityIndicator
                            size="large"
                            color="white"
                            style={styles.loaderCenter}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 260,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'black',
    },
    thumbnail: {
        width: '100%',
        height: 180,
        borderRadius: 12,
    },
    playOverlay: {
        position: 'absolute',
        top: '40%',
        left: '40%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 40,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    inlineLoader: {
        position: 'absolute',
        top: '45%',
        left: '45%',
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenVideo: {
        width: '100%',
        height: '100%',
    },
    closeBtn: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 6,
    } as ViewStyle,
    loaderCenter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
});

export default ChatVideo;
