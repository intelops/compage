import {GeneratedProjectModel, GenerateProjectRequest} from '../models/redux-models';
import {createAsyncThunk} from "@reduxjs/toolkit";
import {CompageBackendApi} from "./backend-api";

// This type describes the error object structure:
type GenerateProjectError = {
    message: string;
};

export const generateProject = createAsyncThunk<GeneratedProjectModel[],
    GenerateProjectRequest,
    { rejectValue: GenerateProjectError }>(
    // The first argument is the action name:
    "compage/generateProject",
    // The second one is a function
    // called payload creator.
    // It contains async logic of a side effect.
    // We can perform requests here,
    // work with device API,
    // or any other async APIs we need to.
    async (generateProjectRequest: GenerateProjectRequest, thunkApi) => {
        try {
            // Fetch the backend endpoint:
            const response = await CompageBackendApi().post('/generate_project', generateProjectRequest);
            // Get the JSON from the response:
            const data: GeneratedProjectModel[] = await response.data;
            return data;
        } catch (e: any) {
            if (e.response.data.status === 401) {
                sessionStorage.clear()
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to generate project."
                });
            }
            // Check if status is not okay:
            if (e.response.status !== 200) {
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to generate project."
                });
            }
            const data: GeneratedProjectModel[] = []
            return data
        }
    }
);