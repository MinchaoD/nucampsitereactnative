import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { campsites } from './campsites';
import { comments } from './comments';
import { promotions } from './promotions';
import { partners } from './partners';
import { favorites } from './favorites';
import { persistStore, persistCombineReducers } from 'redux-persist'; // need to install redux-persist first
import storage from 'redux-persist/es/storage'; // in order to make persist store so we can save data on the client side, we need to
// use redux-persist, we update this configureStore.js and App.js, that is it, no other files need to updated.


const config = {
    key: 'root',  // this is to connect App.js, root
    storage,
    debug: true  // this means turn on the debug logging
}

export const ConfigureStore = () => {
    const store = createStore(
        persistCombineReducers( config, {
            campsites,
            comments,
            partners,
            promotions,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store);

    return { persistor, store };
}