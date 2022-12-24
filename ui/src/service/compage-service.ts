import {GeneratedCodeModel, GenerateCodeRequest} from '../models/redux-models';
import {createAsyncThunk} from "@reduxjs/toolkit";
import {CodeOperationsBackendApi} from "./backend-api";

// This type describes the error object structure:
type GenerateCodeError = {
    message: string;
};

export const generateCode = createAsyncThunk<GeneratedCodeModel[],
    GenerateCodeRequest,
    { rejectValue: GenerateCodeError }>(
    // The first argument is the action name:
    "compage/generateCode",
    // The second one is a function
    // called payload creator.
    // It contains async logic of a side effect.
    // We can perform requests here,
    // work with device API,
    // or any other async APIs we need to.
    async (generateCodeRequest: GenerateCodeRequest, thunkApi) => {
        try {
            // Fetch the backend endpoint:
            const response = await CodeOperationsBackendApi().post('/generate_code', generateCodeRequest);
            // Get the JSON from the response:
            const data: GeneratedCodeModel[] = await response.data;
            return data;
        } catch (e: any) {
            if (e.response.data.status === 401) {
                sessionStorage.clear()
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to generate code."
                });
            }
            // Check if status is not okay:
            if (e.response.status !== 200) {
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to generate code."
                });
            }
            const data: GeneratedCodeModel[] = []
            return data
        }
    }
);