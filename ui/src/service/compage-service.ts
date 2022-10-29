import {CreatedProjectModel, CreateProjectRequest} from '../models/redux-models';
import {createAsyncThunk} from "@reduxjs/toolkit";
import {CompageBackendApi} from "./backend-api";

// This type describes the error object structure:
type CreateProjectError = {
    message: string;
};

export const createProject = createAsyncThunk<CreatedProjectModel[],
    CreateProjectRequest,
    { rejectValue: CreateProjectError }>(
    // The first argument is the action name:
    "compage/createProject",
    // The second one is a function
    // called payload creator.
    // It contains async logic of a side effect.
    // We can perform requests here,
    // work with device API,
    // or any other async APIs we need to.
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        // Fetch the backend endpoint:
        const response = await CompageBackendApi().post('/create_project', createProjectRequest);
        // Check if status is not okay:
        if (response.status !== 200) {
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: "Failed to create project."
            });
        }
        // Get the JSON from the response:
        const data: CreatedProjectModel[] = await response.data;
        console.log(data)

        return data;
    }
);