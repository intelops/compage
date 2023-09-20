import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {createGitPlatformAsync} from "./async-apis/createGitPlatform";
import {GitPlatformDTO} from "./model";
import {listGitPlatformsAsync} from "./async-apis/listGitPlatforms";
import {updateGitPlatformAsync} from "./async-apis/updateGitPlatform";
import {deleteGitPlatformAsync} from "./async-apis/deleteGitPlatform";

export interface GitPlatformState {
    createGitPlatform: {
        data: GitPlatformDTO,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    listGitPlatforms: {
        data: GitPlatformDTO[],
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    updateGitPlatform: {
        data: {},
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    deleteGitPlatform: {
        data: {},
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
}

const initialState: GitPlatformState = {
    createGitPlatform: {
        data: {} as GitPlatformDTO,
        status: 'idle',
        error: null
    },
    listGitPlatforms: {
        data: [] as GitPlatformDTO[],
        status: 'idle',
        error: null
    },
    updateGitPlatform: {
        data: {},
        status: 'idle',
        error: null
    },
    deleteGitPlatform: {
        data: {},
        status: 'idle',
        error: null
    }
};

export const gitPlatformsSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createGitPlatformAsync.pending, (state) => {
            state.createGitPlatform.status = 'loading';
            state.createGitPlatform.error = null;
        }).addCase(createGitPlatformAsync.fulfilled, (state, action) => {
            state.createGitPlatform.status = 'idle';
            state.createGitPlatform.error = null;
            state.createGitPlatform.data = action.payload as GitPlatformDTO;
        }).addCase(createGitPlatformAsync.rejected, (state, action) => {
            state.createGitPlatform.status = 'failed';
            if (action.payload) state.createGitPlatform.error = JSON.stringify(action.payload);
        }).addCase(listGitPlatformsAsync.pending, (state) => {
            state.listGitPlatforms.status = 'loading';
            state.listGitPlatforms.error = null;
        }).addCase(listGitPlatformsAsync.fulfilled, (state, action) => {
            state.listGitPlatforms.status = 'idle';
            state.listGitPlatforms.error = null;
            state.listGitPlatforms.data = action.payload as GitPlatformDTO[];
        }).addCase(listGitPlatformsAsync.rejected, (state, action) => {
            state.listGitPlatforms.status = 'failed';
            if (action.payload) state.listGitPlatforms.error = JSON.stringify(action.payload);
        }).addCase(updateGitPlatformAsync.pending, (state) => {
            state.updateGitPlatform.status = 'loading';
            state.updateGitPlatform.error = null;
        }).addCase(updateGitPlatformAsync.fulfilled, (state, action) => {
            state.updateGitPlatform.status = 'idle';
            state.updateGitPlatform.error = null;
            state.updateGitPlatform.data = action.payload;
        }).addCase(updateGitPlatformAsync.rejected, (state, action) => {
            state.updateGitPlatform.status = 'failed';
            if (action.payload) state.updateGitPlatform.error = JSON.stringify(action.payload);
        }).addCase(deleteGitPlatformAsync.pending, (state) => {
            state.deleteGitPlatform.status = 'loading';
            state.deleteGitPlatform.error = null;
        }).addCase(deleteGitPlatformAsync.fulfilled, (state, action) => {
            state.deleteGitPlatform.status = 'idle';
            state.deleteGitPlatform.error = null;
            state.deleteGitPlatform.data = action.payload;
        }).addCase(deleteGitPlatformAsync.rejected, (state, action) => {
            state.deleteGitPlatform.status = 'failed';
            if (action.payload) state.deleteGitPlatform.error = JSON.stringify(action.payload);
        });
    },
});

export const selectCreateGitPlatformData = (state: RootState) => state.gitPlatformsOperations.createGitPlatform.data;
export const selectCreateGitPlatformError = (state: RootState) => state.gitPlatformsOperations.createGitPlatform.error;
export const selectCreateGitPlatformStatus = (state: RootState) => state.gitPlatformsOperations.createGitPlatform.status;

export const selectListGitPlatformsData = (state: RootState) => state.gitPlatformsOperations.listGitPlatforms.data;
export const selectListGitPlatformsError = (state: RootState) => state.gitPlatformsOperations.listGitPlatforms.error;
export const selectListGitPlatformsStatus = (state: RootState) => state.gitPlatformsOperations.listGitPlatforms.status;

export const selectUpdateGitPlatformData = (state: RootState) => state.gitPlatformsOperations.updateGitPlatform.data;
export const selectUpdateGitPlatformError = (state: RootState) => state.gitPlatformsOperations.updateGitPlatform.error;
export const selectUpdateGitPlatformStatus = (state: RootState) => state.gitPlatformsOperations.updateGitPlatform.status;

export const selectDeleteGitPlatformData = (state: RootState) => state.gitPlatformsOperations.deleteGitPlatform.data;
export const selectDeleteGitPlatformError = (state: RootState) => state.gitPlatformsOperations.deleteGitPlatform.error;
export const selectDeleteGitPlatformStatus = (state: RootState) => state.gitPlatformsOperations.deleteGitPlatform.status;

export default gitPlatformsSlice.reducer;
