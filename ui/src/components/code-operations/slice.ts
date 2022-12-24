import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {generateCodeAsync} from "./async-apis/generate";
import {GenerateCodeResponse} from "./model";

export interface GenerateCodeState {
    data: GenerateCodeResponse;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: GenerateCodeState = {
    data: {
        "projectId": "",
        "userName": "",
        "message": "",
        "error": ""
    },
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

export const selectData = (state: RootState) => state.codeOperations.data;
export const selectError = (state: RootState) => state.codeOperations.error;
export const selectStatus = (state: RootState) => state.codeOperations.status;

export default codeOperationsSlice.reducer;
