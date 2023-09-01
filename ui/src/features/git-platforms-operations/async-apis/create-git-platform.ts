import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {setCurrentUserName} from "../../../utils/sessionstorage-client";
import {CreateGitPlatformError, CreateGitPlatformRequest, CreateGitPlatformResponse} from "../model";
import {createGitPlatform} from "../api";

export const createGitPlatformAsync = createAsyncThunk<CreateGitPlatformResponse, CreateGitPlatformRequest, {
    rejectValue: CreateGitPlatformError
}>(
    'gitPlatform/createGitPlatform',
    async (createGitPlatformRequest: CreateGitPlatformRequest, thunkApi) => {
        return createGitPlatform(createGitPlatformRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const msg = `Failed to create a git-platform. Received: ${response.status}`;
                console.log(msg);
                toastr.error(`createGitPlatform [Failure]`, `${msg}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${msg}`
                });
            }

            const createGitPlatformResponse: CreateGitPlatformResponse = response.data;
            console.log(createGitPlatformResponse);

            const message = `[createGitPlatform] created a git-platform successfully.`;
            console.log(message);
            toastr.success(`createGitPlatform [Success]`, `${message}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`createGitPlatform [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
