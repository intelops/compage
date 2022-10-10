import {combineReducers, configureStore} from '@reduxjs/toolkit';
import todoSlice from './todo-slice'
import authenticationSlice from "./authentication-slice";
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
// import thunk from 'redux-thunk';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "reduxjs-toolkit-persist";
import {reducer as toastrReducer} from 'react-redux-toastr'

const rootPersistConfig = {
    key: 'root',
    storage,
    // stateReconciler: autoMergeLevel2,
}

const authenticationPersistConfig = {
    key: 'user',
    storage: storageSession,
}

const persistedRootReducer = combineReducers({
    todo: persistReducer(rootPersistConfig, todoSlice.reducer),
    authentication: persistReducer(authenticationPersistConfig, authenticationSlice.reducer),
    toastr: toastrReducer
})

export const store = configureStore(
    {
        devTools: process.env.NODE_ENV !== 'production',
        reducer: persistedRootReducer,
        // middleware: [thunk]
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    }
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);