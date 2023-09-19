import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {CreateGitPlatformError, CreateGitPlatformRequest, GitPlatformDTO} from "../model";
import {createGitPlatform} from "../api";

export const createGitPlatformAsync = createAsyncThunk<GitPlatformDTO, CreateGitPlatformRequest, {
    rejectValue: CreateGitPlatformError
}>(
    'gitPlatform/createGitPlatform',
    async (createGitPlatformRequest: CreateGitPlatformRequest, thunkApi) => {
        return createGitPlatform(createGitPlatformRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 201) {
                const errorMessage = `Failed to create a git-platform. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`createGitPlatform [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const gitPlatformDTO: GitPlatformDTO = response.data;
            console.log(gitPlatformDTO);

            const successMessage = `[createGitPlatform] created a git-platform successfully.`;
            console.log(successMessage);
            toastr.success(`createGitPlatform [Success]`, `${successMessage}`);
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
