import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {createGitPlatformAsync} from "./async-apis/create-git-platform";
import {CreateGitPlatformResponse, ListGitPlatformsResponse} from "./model";
import {listGitPlatformsAsync} from "./async-apis/list-git-platforms";

export interface GitPlatformState {
    createGitPlatform: {
        data: CreateGitPlatformResponse,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    listGitPlatforms: {
        data: ListGitPlatformsResponse,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
}

const initialState: GitPlatformState = {
    createGitPlatform: {
        data: {
            gitPlatforms: []
        },
        status: 'idle',
        error: null
    },
    listGitPlatforms: {
        data: {
            gitPlatforms: []
        },
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
            state.createGitPlatform.data = action.payload;
        }).addCase(createGitPlatformAsync.rejected, (state, action) => {
            state.createGitPlatform.status = 'failed';
            if (action.payload) state.createGitPlatform.error = JSON.stringify(action.payload);
        }).addCase(listGitPlatformsAsync.pending, (state) => {
            state.listGitPlatforms.status = 'loading';
            state.listGitPlatforms.error = null;
        }).addCase(listGitPlatformsAsync.fulfilled, (state, action) => {
            state.listGitPlatforms.status = 'idle';
            state.listGitPlatforms.error = null;
            state.listGitPlatforms.data = action.payload;
        }).addCase(listGitPlatformsAsync.rejected, (state, action) => {
            state.listGitPlatforms.status = 'failed';
            if (action.payload) state.listGitPlatforms.error = JSON.stringify(action.payload);
        });
    },
});

export const selectCreateGitPlatformData = (state: RootState) => state.gitPlatformsOperations.createGitPlatform.data;
export const selectCreateGitPlatformError = (state: RootState) => state.gitPlatformsOperations.createGitPlatform.error;
export const selectCreateGitPlatformStatus = (state: RootState) => state.gitPlatformsOperations.createGitPlatform.status;

export const selectListGitPlatformsData = (state: RootState) => state.gitPlatformsOperations.listGitPlatforms.data;
export const selectListGitPlatformsError = (state: RootState) => state.gitPlatformsOperations.listGitPlatforms.error;
export const selectListGitPlatformsStatus = (state: RootState) => state.gitPlatformsOperations.listGitPlatforms.status;

export default gitPlatformsSlice.reducer;
