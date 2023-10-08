import {createAsyncThunk} from "@reduxjs/toolkit";
import {UploadYamlError, UploadYamlRequest, UploadYamlResponse} from "../model";
import {uploadYaml} from "../api";
import {toastr} from 'react-redux-toastr';

export const uploadYamlAsync = createAsyncThunk<UploadYamlResponse, UploadYamlRequest, {
    rejectValue: UploadYamlError
}>(
    'openapi/uploadYaml',
    async (uploadYamlRequest: UploadYamlRequest, thunkApi) => {
        return uploadYaml(uploadYamlRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const errorMessage = `Failed to upload for '${uploadYamlRequest.projectId}'. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`uploadYaml [Failure]`, errorMessage);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const successMessage = `Successfully uploaded file '${uploadYamlRequest.projectId}'`;
            console.log(successMessage);
            toastr.success(`uploadYaml [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`uploadYaml [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);
