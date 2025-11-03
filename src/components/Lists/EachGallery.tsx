import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../Icon';

const EachGallery = ({
    gallery,
    itemSize,
}: {
    gallery: any;
    itemSize: number;
    videos: any;
}) => {
    const navigation = useNavigation<any>();

    const item = gallery?.items[0];

    const reelHandler = () => {
        navigation.navigate('Reel', {
            params: { startFrom: item.galleryId },
        });
    };

    return item.itemId ? (
        <>
            <Pressable
                onPress={reelHandler}
                style={{
                    width: itemSize,
                    height: 180,
                    borderRadius: 10,
                    position: 'relative',
                }}
            >
                <Image
                    source={{ uri: item.thumbnail }}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                    // placeholder={{ blurhash: item.thumbnail }}
                />
                <View style={styles.pos}>
                    <Icon type="entypo" name="video" color={'#FFF'} />
                </View>
            </Pressable>
        </>
    ) : (
        <></>
    );
};

export default EachGallery;

const styles = StyleSheet.create({
    pos: {
        backgroundColor: '#0A0A0A4D',
        position: 'absolute',
        height: 30,
        width: 30,
        right: 5,
        top: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    pos2: {
        position: 'absolute',
        right: '40%',
        top: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});
