import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectRequest, CreateProjectResponse, CreateProjectError} from "../model";
import {createProject} from "../api";
import {toastr} from 'react-redux-toastr'

export const createProjectAsync = createAsyncThunk<CreateProjectResponse, CreateProjectRequest, { rejectValue: CreateProjectError }>(
    'projects/all',
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        try {
            const response = await createProject(createProjectRequest);
            // Check if status is not okay:
            if (response.status !== 200) {
                console.log("Failed to create project. Received : " + response.status)
                toastr.error('Failure : ' + createProjectRequest.projectId, "Failed to create project. Received : " + response.status);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to create project. Received : " + response.status
                });
            }
            console.log("Successfully created project-" + createProjectRequest.projectId)
            toastr.info('Success : ' + createProjectRequest.projectId, "Successfully created project : " + createProjectRequest.projectId);
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue({
                message: "Failed to create project. Received :" + e
            });
        }
    }
);
