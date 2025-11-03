import React from 'react';
import NavContainer from './src/navigation/NavContainer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner-native';
import persistStore from 'redux-persist/es/persistStore';
import store from './src/redux/store';

const persistor = persistStore(store);

const App = () => {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <NavContainer />
                        <Toaster />
                    </PersistGate>
                </Provider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};

export default App;
