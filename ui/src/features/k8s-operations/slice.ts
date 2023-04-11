import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {getCurrentContextAsync} from "./async-apis/getCurrentContext";

export interface K8sOperationsState {
    getCurrentContext: {
        data: any;
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
}

const initialState: K8sOperationsState = {
    getCurrentContext: {
        data: {},
        status: 'idle',
        error: null
    }
};

export const k8sOperationsSlice = createSlice({
    name: 'k8sOperations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCurrentContextAsync.pending, (state) => {
            state.getCurrentContext.status = 'loading';
            state.getCurrentContext.error = null;
        }).addCase(getCurrentContextAsync.fulfilled, (state, action) => {
            state.getCurrentContext.status = 'idle';
            state.getCurrentContext.error = null;
            state.getCurrentContext.data = action.payload;
        }).addCase(getCurrentContextAsync.rejected, (state, action) => {
            state.getCurrentContext.status = 'failed';
            if (action.payload) state.getCurrentContext.error = JSON.stringify(action.payload);
        });
    },
});

export const selectGetCurrentContextData = (state: RootState) => state.k8sOperations.getCurrentContext.data;
export const selectGetCurrentContextError = (state: RootState) => state.k8sOperations.getCurrentContext.error;
export const selectGetCurrentContextStatus = (state: RootState) => state.k8sOperations.getCurrentContext.status;

export default k8sOperationsSlice.reducer;
