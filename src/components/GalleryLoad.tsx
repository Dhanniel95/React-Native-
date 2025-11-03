import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import React from 'react';
import { View } from 'react-native';

const GalleryLoad = () => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <View style={{ marginBottom: 10, width: '32%' }} key={i}>
                    <SkeletonPlaceholder.Item
                        key={i}
                        width={'100%'}
                        height={25}
                        marginBottom={10}
                    />
                </View>
            ))}
        </View>
    );
};

export default GalleryLoad;
