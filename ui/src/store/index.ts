import {combineReducers, configureStore, ThunkAction} from '@reduxjs/toolkit';
import authenticationSlice from "./authentication-slice";
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
// import thunk from 'redux-thunk';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "reduxjs-toolkit-persist";
import {reducer as toastrReducer} from 'react-redux-toastr'
import {Action} from "redux";
import compageReducer from "../components/generate-project/slice";

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
    compage: persistReducer(rootPersistConfig, compageReducer),
    authentication: persistReducer(authenticationPersistConfig, authenticationSlice.reducer),
    toastr: toastrReducer,
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
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;