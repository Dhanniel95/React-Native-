import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { PERMISSION_TYPE, Permission } from '../../utils/permission';
import chatService from '../../redux/chat/chatService';
import { displayError } from '../../utils/display';

const UploadField = ({
    children,
    setLoad,
    setUrl,
    type,
    blockApi,
    style,
}: {
    children: React.ReactNode;
    setLoad: (arg: boolean) => void;
    setUrl: (arg: string) => void;
    type: 'images' | 'videos';
    blockApi?: boolean;
    style?: StyleProp<ViewStyle>;
}) => {
    const selectImageHandler = async () => {
        try {
            await Permission.requestMultiple([
                PERMISSION_TYPE.photo,
                PERMISSION_TYPE.read_photo,
            ]);

            let result = await launchImageLibrary({
                mediaType: type === 'images' ? 'photo' : 'video',
            });
            if (!result.didCancel && result.assets) {
                setLoad(true);
                let sourceFile = result.assets[0];

                const formData = new FormData();
                formData.append(type == 'images' ? 'chatphoto' : 'chatvideo', {
                    uri: sourceFile.uri,
                    type: type == 'images' ? 'image/jpeg' : 'video/mp4',
                    name: type == 'images' ? 'chatphoto.jpg' : 'chatvideo.mp4',
                } as any);
                if (blockApi) {
                    setUrl(sourceFile.uri || '');
                } else {
                    let res;
                    if (type === 'images') {
                        res = await chatService.uploadImage(formData);
                    } else {
                        res = await chatService.uploadVideo(formData);
                    }
                    setLoad(false);
                    setUrl(res?.data?.url);
                }
            }
        } catch (err) {
            setLoad(false);
            displayError(err, true);
        }
    };

    return (
        <TouchableOpacity onPress={selectImageHandler} style={style}>
            {children}
        </TouchableOpacity>
    );
};

export default UploadField;
