import {createAsyncThunk} from "@reduxjs/toolkit";
import {GenerateProjectRequest, GenerateProjectResponse, GenerateProjectError} from "../model";
import {generateProject} from "../api";
import {toastr} from 'react-redux-toastr'

export const generateProjectAsync = createAsyncThunk<GenerateProjectResponse, GenerateProjectRequest, { rejectValue: GenerateProjectError }>(
    'compage/generateProject',
    async (generateProjectRequest: GenerateProjectRequest, thunkApi) => {
        try {
            const response = await generateProject(generateProjectRequest);
            // Check if status is not okay:
            if (response.status !== 200) {
                console.log("Failed to generate project. Received : " + response.status)
                toastr.error('Failure : ' + generateProjectRequest.projectId, "Failed to generate project. Received : " + response.status);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to generate project. Received : " + response.status
                });
            }
            console.log("Successfully generated project-" + generateProjectRequest.projectId)
            toastr.info('Success : ' + generateProjectRequest.projectId, "Successfully generated project : " + generateProjectRequest.projectId);
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue({
                message: "Failed to generate project. Received :" + e
            });
        }
    }
);
