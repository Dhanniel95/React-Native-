import { StatusBar, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar barStyle={'dark-content'} />
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFF',
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                {children}
            </View>
        </>
    );
};

export default Layout;
