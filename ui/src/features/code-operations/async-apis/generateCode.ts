import {createAsyncThunk} from "@reduxjs/toolkit";
import {GenerateCodeError, GenerateCodeRequest, GenerateCodeResponse} from "../model";
import {generateCode} from "../api";
import {toastr} from 'react-redux-toastr'

export const generateCodeAsync = createAsyncThunk<GenerateCodeResponse, GenerateCodeRequest, { rejectValue: GenerateCodeError }>(
    'code-operations/generateCode',
    async (generateCodeRequest: GenerateCodeRequest, thunkApi) => {
        return generateCode(generateCodeRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const message = `Failed to generate code for '${generateCodeRequest.projectId}'. Received: ${response.status}`;
                console.log(message);
                toastr.error(`generateCode [Failure]`, message);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: message
                });
            }
            const message = `Successfully generated code for '${generateCodeRequest.projectId}'`;
            console.log(message);
            toastr.success(`generateCode [Success]`, `${message}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`generateCode [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        })
    }
);
