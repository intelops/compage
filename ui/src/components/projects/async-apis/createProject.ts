import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectRequest, CreateProjectResponse, CreateProjectError} from "../model";
import {createProject} from "../api";
import {toastr} from 'react-redux-toastr'

export const createProjectAsync = createAsyncThunk<CreateProjectResponse, CreateProjectRequest, { rejectValue: CreateProjectError }>(
    'projects/createProject',
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        try {
            const response = await createProject(createProjectRequest);
            // Check if status is not okay:
            if (response.status !== 201) {
                console.log("Failed to create project. Received : " + response.status)
                toastr.error('Failure : ' + createProjectRequest.displayName, "Failed to create project. Received : " + response.status);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to create project. Received : " + response.status
                });
            }
            console.log("Successfully created project-" + createProjectRequest.displayName)
            toastr.success('Success : ' + createProjectRequest.displayName, "Successfully created project : " + createProjectRequest.displayName);
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue({
                message: "Failed to create project. Received :" + e
            });
        }
    }
);
