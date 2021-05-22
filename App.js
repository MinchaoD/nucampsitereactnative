import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import Loading from './components/LoadingComponent';

const { persistor, store} = ConfigureStore();

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate
                loading={<Loading />}  // this is to when rehydrate/get data from client side store, show loading while waiting
                persistor={persistor}>
                <Main />
            </PersistGate>  
        </Provider>
    );
}


