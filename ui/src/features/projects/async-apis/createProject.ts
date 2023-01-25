import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectError, CreateProjectRequest, CreateProjectResponse} from "../model";
import {createProject} from "../api";
import {toastr} from 'react-redux-toastr'
import {setCurrentConfig, setCurrentProject, setCurrentState} from "../../../utils/localstorage-client";

export const createProjectAsync = createAsyncThunk<CreateProjectResponse, CreateProjectRequest, { rejectValue: CreateProjectError }>(
    'projects/createProject',
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        return createProject(createProjectRequest).then(response => {
            if (response.status !== 200) {
                const msg = `Failed to create project.`;
                const errorMessage = `Status: ${response.status}, Message: ${msg}`;
                console.log(errorMessage);
                toastr.error(`createProject [Failure]`, errorMessage);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const createProjectResponse: CreateProjectResponse = response.data;
            // update details to localstorage client
            setCurrentProject(createProjectResponse.project.id, createProjectResponse.project.version);
            setCurrentConfig(createProjectResponse.project.json);
            setCurrentState(createProjectResponse.project.json);
            const message = `Successfully created project: ${createProjectRequest.displayName}[${createProjectResponse.project.id}]`;
            console.log(message);
            toastr.success(`createProject [Success]`, message);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`createProject [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        })
    }
);
