import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectError, CreateProjectRequest, CreateProjectResponse} from "../model";
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
        } catch (e: any) {
            console.log(JSON.parse(JSON.stringify(e)))
            const statusCode = e.response.status // 400
            const statusText = e.response.statusText // Bad Request
            const message = e.response.data.message[0] // id should not be empty
            console.log(`e : ${e}`)

            toastr.error('Failure : ' + createProjectRequest.displayName, "Failed to create project. Received : " + JSON.parse(JSON.stringify(e)).status);
            return thunkApi.rejectWithValue({
                message: "Failed to create project. Received :" + e
            });
        }
    }
);
