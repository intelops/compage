import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {createProjectAsync} from "./async-apis/createProject";
import {listProjectsAsync} from "./async-apis/listProjects";
import {getProjectAsync} from "./async-apis/getProject";
import {updateProjectAsync} from './async-apis/updateProject';
import {JsonStringify} from "../../utils/json-helper";

export interface ProjectState {
    createProject: {
        data: any,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    listProjects: {
        data: any,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    }
    getProject: {
        data: any,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    }
    updateProject: {
        data: any,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    }
}

const initialState: ProjectState = {
    updateProject: {
        data: {},
        status: 'idle',
        error: null
    },
    getProject: {
        data: {},
        status: 'idle',
        error: null
    },
    listProjects: {
        data: [],
        status: 'idle',
        error: null
    },
    createProject: {
        data: {},
        status: 'idle',
        error: null
    },
};

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createProjectAsync.pending, (state) => {
            state.createProject.status = 'loading';
            state.createProject.error = null;
        }).addCase(createProjectAsync.fulfilled, (state, action) => {
            state.createProject.status = 'idle';
            state.createProject.error = null;
            state.createProject.data = action.payload;
        }).addCase(createProjectAsync.rejected, (state, action) => {
            state.createProject.status = 'failed';
            if (action.payload) state.createProject.error = JsonStringify(action.payload);
        }).addCase(listProjectsAsync.pending, (state) => {
            state.listProjects.status = 'loading';
            state.listProjects.error = null;
        }).addCase(listProjectsAsync.fulfilled, (state, action) => {
            state.listProjects.status = 'idle';
            state.listProjects.error = null;
            state.listProjects.data = action.payload;
        }).addCase(listProjectsAsync.rejected, (state, action) => {
            state.listProjects.status = 'failed';
            if (action.payload) state.listProjects.error = JsonStringify(action.payload);
        }).addCase(getProjectAsync.pending, (state) => {
            state.getProject.status = 'loading';
            state.getProject.error = null;
        }).addCase(getProjectAsync.fulfilled, (state, action) => {
            state.getProject.status = 'idle';
            state.getProject.error = null;
            state.getProject.data = action.payload;
        }).addCase(getProjectAsync.rejected, (state, action) => {
            state.getProject.status = 'failed';
            if (action.payload) state.getProject.error = JsonStringify(action.payload);
        }).addCase(updateProjectAsync.pending, (state) => {
            state.updateProject.status = 'loading';
            state.updateProject.error = null;
        }).addCase(updateProjectAsync.fulfilled, (state, action) => {
            state.updateProject.status = 'idle';
            state.updateProject.error = null;
            state.updateProject.data = action.payload;
        }).addCase(updateProjectAsync.rejected, (state, action) => {
            state.updateProject.status = 'failed';
            if (action.payload) state.updateProject.error = JsonStringify(action.payload);
        });
    },
});

export const selectCreateProjectData = (state: RootState) => state.projects.createProject.data;
export const selectCreateProjectError = (state: RootState) => state.projects.createProject.error;
export const selectCreateProjectStatus = (state: RootState) => state.projects.createProject.status;

export const selectListProjectsData = (state: RootState) => state.projects.listProjects.data;
export const selectListProjectsError = (state: RootState) => state.projects.listProjects.error;
export const selectListProjectsStatus = (state: RootState) => state.projects.listProjects.status;

export const selectGetProjectData = (state: RootState) => state.projects.getProject.data;
export const selectGetProjectError = (state: RootState) => state.projects.getProject.error;
export const selectGetProjectStatus = (state: RootState) => state.projects.getProject.status;

export const selectUpdateProjectData = (state: RootState) => state.projects.updateProject.data;
export const selectUpdateProjectError = (state: RootState) => state.projects.updateProject.error;
export const selectUpdateProjectStatus = (state: RootState) => state.projects.updateProject.status;

export default projectsSlice.reducer;
