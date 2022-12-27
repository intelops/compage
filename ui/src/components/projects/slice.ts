import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {createProjectAsync} from "./async-apis/createProject";
import {listProjectsAsync} from "./async-apis/listProjects";

export interface ProjectState {
    createProjectData: any;
    listProjectsData: any;
    getProjectData: any;

    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: ProjectState = {
    getProjectData: {},
    listProjectsData: [],
    createProjectData: {},
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
            state.error = null;
            state.createProjectData = action.payload;
        }).addCase(createProjectAsync.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload) state.error = JSON.stringify(action.payload);
        }).addCase(listProjectsAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(listProjectsAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.error = null;
            state.listProjectsData = action.payload;
        }).addCase(listProjectsAsync.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload) state.error = JSON.stringify(action.payload);
        });
    },
});

export const selectCreateProjectData = (state: RootState) => state.projects.createProjectData;
export const selectListProjectsData = (state: RootState) => state.projects.listProjectsData;
export const selectGetProjectData = (state: RootState) => state.projects.getProjectData;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectProjectsStatus = (state: RootState) => state.projects.status;

export default projectsSlice.reducer;
