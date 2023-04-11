import {combineReducers, configureStore, ThunkAction} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
// import thunk from 'redux-thunk';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "reduxjs-toolkit-persist";
import {reducer as toastrReducer} from 'react-redux-toastr';
import {Action, Reducer} from "redux";
import codeOperationsReducer from "../features/code-operations/slice";
import projectsReducer from "../features/projects/slice";
import authReducer from "../features/auth/slice";
import {unauthenticatedMiddleware} from "./unauthenticatedMiddleware";
import {RESET_STATE_ACTION_TYPE} from "./reset-state-action";
import openApiYamlOperationsReducer from "../features/open-api-yaml-operations/slice";
import k8sOperationsReducer from "../features/k8s-operations/slice";

const rootPersistConfig = {
    key: 'root',
    storage,
    // stateReconciler: autoMergeLevel2,
};

const authenticationPersistConfig = {
    key: 'user',
    storage: storageSession,
};

const persistedRootReducer = combineReducers({
    k8sOperations: persistReducer(rootPersistConfig, k8sOperationsReducer),
    openApiYamlOperations: persistReducer(rootPersistConfig, openApiYamlOperationsReducer),
    codeOperations: persistReducer(rootPersistConfig, codeOperationsReducer),
    projects: persistReducer(rootPersistConfig, projectsReducer),
    auth: persistReducer(authenticationPersistConfig, authReducer),
    toastr: toastrReducer,
});


export const rootReducer: Reducer<RootState> = (
    state,
    action
) => {
    if (action.type === RESET_STATE_ACTION_TYPE) {
        state = {} as RootState;
    }

    return persistedRootReducer(state, action);
};

export const store = configureStore(
    {
        devTools: process.env.NODE_ENV !== 'production',
        reducer: rootReducer,
        // middleware: [thunk]
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }).concat([
                unauthenticatedMiddleware
            ]),
    }
);

export type RootState = ReturnType<typeof persistedRootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;