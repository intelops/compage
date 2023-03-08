import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {generateCodeAsync} from "./async-apis/generateCode";

export interface CodeOperationsState {
    generateCode: {
        data: any;
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
}

const initialState: CodeOperationsState = {
    generateCode: {
        data: [],
        status: 'idle',
        error: null
    }
};

export const codeOperationsSlice = createSlice({
    name: 'codeOperations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(generateCodeAsync.pending, (state) => {
            state.generateCode.status = 'loading';
            state.generateCode.error = null;
        }).addCase(generateCodeAsync.fulfilled, (state, action) => {
            state.generateCode.status = 'idle';
            state.generateCode.error = null;
            state.generateCode.data = action.payload;
        }).addCase(generateCodeAsync.rejected, (state, action) => {
            state.generateCode.status = 'failed';
            if (action.payload) state.generateCode.error = JSON.stringify(action.payload);
        });
    },
});

export const selectGenerateCodeData = (state: RootState) => state.codeOperations.generateCode.data;
export const selectGenerateCodeError = (state: RootState) => state.codeOperations.generateCode.error;
export const selectGenerateCodeStatus = (state: RootState) => state.codeOperations.generateCode.status;

export default codeOperationsSlice.reducer;
