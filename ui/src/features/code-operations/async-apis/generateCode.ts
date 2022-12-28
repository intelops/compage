import {createAsyncThunk} from "@reduxjs/toolkit";
import {GenerateCodeError, GenerateCodeRequest, GenerateCodeResponse} from "../model";
import {generateCode} from "../api";
import {toastr} from 'react-redux-toastr'

export const generateCodeAsync = createAsyncThunk<GenerateCodeResponse, GenerateCodeRequest, { rejectValue: GenerateCodeError }>(
    'code-operations/generateCode',
    async (generateCodeRequest: GenerateCodeRequest, thunkApi) => {
        try {
            const response = await generateCode(generateCodeRequest);
            // Check if status is not okay:
            if (response.status !== 200) {
                console.log(`Failed to generate code. Received : ${response.status}`)
                toastr.error(`Failure : ${generateCodeRequest.projectId}`, `Failed to generate code. Received : ${response.status}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `Failed to generate code. Received : ${response.status}`
                });
            }
            console.log("Successfully generated code-" + generateCodeRequest.projectId)
            toastr.success('Success : ' + generateCodeRequest.projectId, "Successfully generated code : " + generateCodeRequest.projectId);
            return response.data;
        } catch (e) {
            const statusCode = e.response.status;
            const message = JSON.parse(JSON.stringify(e.response.data)).message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`Failure`, errorMessage);
            return thunkApi.rejectWithValue({
                message: "Failed to generate code. Received :" + e
            });
        }
    }
);
