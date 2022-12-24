import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {generateProjectAsync} from "./async-apis/generateProject";
import {GenerateProjectResponse} from "./model";

export interface GenerateProjectState {
    data: GenerateProjectResponse;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: GenerateProjectState = {
    data: {
        "projectId": "",
        "userName": "",
        "message": "",
        "error": ""
    },
    status: 'idle',
    error: null
};

export const compageSlice = createSlice({
    name: 'compage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(generateProjectAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(generateProjectAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.error = null
            state.data = action.payload;
        }).addCase(generateProjectAsync.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload) state.error = JSON.stringify(action.payload);
        });
    },
});

export const selectData = (state: RootState) => state.compage.data;
export const selectError = (state: RootState) => state.compage.error;
export const selectStatus = (state: RootState) => state.compage.status;

export default compageSlice.reducer;
