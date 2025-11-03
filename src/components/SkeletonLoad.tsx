import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonLoad = ({ count }: { count: number }) => {
    return (
        <View style={{ flex: 1 }}>
            <SkeletonPlaceholder borderRadius={4}>
                <SkeletonPlaceholder.Item>
                    {Array.from({ length: count }).map((_, i) => (
                        <SkeletonPlaceholder.Item
                            key={i}
                            width={'100%'}
                            height={25}
                            marginBottom={10}
                        />
                    ))}
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
};

export default SkeletonLoad;
