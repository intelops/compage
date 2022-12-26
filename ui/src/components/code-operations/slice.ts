import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {generateCodeAsync} from "./async-apis/generateCode";

export interface CodeOperationsState {
    data: any;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: CodeOperationsState = {
    data: [],
    status: 'idle',
    error: null
};

export const codeOperationsSlice = createSlice({
    name: 'codeOperations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(generateCodeAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(generateCodeAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.error = null
            state.data = action.payload;
        }).addCase(generateCodeAsync.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload) state.error = JSON.stringify(action.payload);
        });
    },
});

export const selectCodeOperationsData = (state: RootState) => state.codeOperations.data;
export const selectCodeOperationsError = (state: RootState) => state.codeOperations.error;
export const selectCodeOperationsStatus = (state: RootState) => state.codeOperations.status;

export default codeOperationsSlice.reducer;
