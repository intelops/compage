import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {createProjectAsync} from "./async-apis/createProject";

export interface ProjectState {
    data: any;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: ProjectState = {
    data: [],
    status: 'idle',
    error: null
};

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createProjectAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(createProjectAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.error = null
            state.data = action.payload;
        }).addCase(createProjectAsync.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload) state.error = JSON.stringify(action.payload);
        });
    },
});

export const selectData = (state: RootState) => state.projects.data;
export const selectError = (state: RootState) => state.projects.error;
export const selectStatus = (state: RootState) => state.projects.status;

export default projectsSlice.reducer;
