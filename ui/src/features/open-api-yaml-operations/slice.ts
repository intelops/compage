import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {uploadYamlAsync} from "./async-apis/uploadYaml";

export interface OpenApiYamlOperationsState {
    uploadYaml: {
        data: any;
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    }
}

const initialState: OpenApiYamlOperationsState = {
    uploadYaml: {
        data: {},
        status: 'idle',
        error: null
    }
};

export const openApiYamlSlice = createSlice({
    name: 'openApiYamlSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(uploadYamlAsync.pending, (state) => {
            state.uploadYaml.status = 'loading';
            state.uploadYaml.error = null;
        }).addCase(uploadYamlAsync.fulfilled, (state, action) => {
            state.uploadYaml.status = 'idle';
            state.uploadYaml.error = null
            state.uploadYaml.data = action.payload;
        }).addCase(uploadYamlAsync.rejected, (state, action) => {
            state.uploadYaml.status = 'failed';
            if (action.payload) state.uploadYaml.error = JSON.stringify(action.payload);
        });
    },
});

export const selectUploadYamlData = (state: RootState) => state.openApiYamlOperations.uploadYaml.data;
export const selectUploadYamlError = (state: RootState) => state.openApiYamlOperations.uploadYaml.error;
export const selectUploadYamlStatus = (state: RootState) => state.openApiYamlOperations.uploadYaml.status;

export default openApiYamlSlice.reducer;
