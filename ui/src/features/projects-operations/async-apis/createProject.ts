import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectError, CreateProjectRequest, CreateProjectResponse} from "../model";
import {createProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {setCurrentConfig, setCurrentProjectDetails, setCurrentState} from "../../../utils/localstorage-client";

export const createProjectAsync = createAsyncThunk<CreateProjectResponse, CreateProjectRequest, { rejectValue: CreateProjectError }>(
    'projects/createProject',
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        return createProject(createProjectRequest).then(response => {
            if (response.status !== 200) {
                const details = `Failed to create project.`;
                const errorMessage = `Status: ${response.status}, Message: ${details}`;
                console.log(errorMessage);
                toastr.error(`createProject [Failure]`, errorMessage);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const createProjectResponse: CreateProjectResponse = response.data;
            // update details to localstorage client
            setCurrentProjectDetails(createProjectResponse.id, createProjectResponse.version, createProjectResponse.repositoryName);
            setCurrentConfig(createProjectResponse.json);
            setCurrentState(createProjectResponse.json);
            const successMessage = `Successfully created project: ${createProjectRequest.displayName}[${createProjectResponse.id}]`;
            console.log(successMessage);
            toastr.success(`createProject [Success]`, successMessage);
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
        });
    }
);
