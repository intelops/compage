import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {UpdateGitPlatformError, UpdateGitPlatformRequest, GitPlatformDTO} from "../model";
import {updateGitPlatform} from "../api";

export const updateGitPlatformAsync = createAsyncThunk<GitPlatformDTO, UpdateGitPlatformRequest, {
    rejectValue: UpdateGitPlatformError
}>(
    'gitPlatform/updateGitPlatform',
    async (updateGitPlatformRequest: UpdateGitPlatformRequest, thunkApi) => {
        return updateGitPlatform(updateGitPlatformRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 201) {
                const errorMessage = `Failed to update a git-platform. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`updateGitPlatform [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const gitPlatformDTO: GitPlatformDTO = response.data;
            console.log(gitPlatformDTO);

            const successMessage = `[updateGitPlatform] updated a git-platform successfully.`;
            console.log(successMessage);
            toastr.success(`updateGitPlatform [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`updateGitPlatform [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
