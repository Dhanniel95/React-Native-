import React from 'react';
import { Image } from 'react-native';

const Thumbnail = ({ video }: { video: any }) => {
    return (
        <Image
            source={{ uri: video.thumbnail }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
        />
    );
};

export default Thumbnail;
