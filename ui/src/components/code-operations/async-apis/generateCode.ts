import {createAsyncThunk} from "@reduxjs/toolkit";
import {GenerateCodeRequest, GenerateCodeResponse, GenerateCodeError} from "../model";
import {generateCode} from "../api";
import {toastr} from 'react-redux-toastr'

export const generateCodeAsync = createAsyncThunk<GenerateCodeResponse, GenerateCodeRequest, { rejectValue: GenerateCodeError }>(
    'code-operations/generateCode',
    async (generateCodeRequest: GenerateCodeRequest, thunkApi) => {
        try {
            const response = await generateCode(generateCodeRequest);
            // Check if status is not okay:
            if (response.status !== 200) {
                console.log("Failed to generate code. Received : " + response.status)
                toastr.error('Failure : ' + generateCodeRequest.projectId, "Failed to generate code. Received : " + response.status);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to generate code. Received : " + response.status
                });
            }
            console.log("Successfully generated code-" + generateCodeRequest.projectId)
            toastr.success('Success : ' + generateCodeRequest.projectId, "Successfully generated code : " + generateCodeRequest.projectId);
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue({
                message: "Failed to generate code. Received :" + e
            });
        }
    }
);
