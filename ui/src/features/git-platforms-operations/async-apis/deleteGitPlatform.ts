import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {DeleteGitPlatformError, DeleteGitPlatformRequest, GitPlatformDTO} from "../model";
import {deleteGitPlatform} from "../api";

export const deleteGitPlatformAsync = createAsyncThunk<GitPlatformDTO, DeleteGitPlatformRequest, {
    rejectValue: DeleteGitPlatformError
}>(
    'gitPlatform/deleteGitPlatform',
    async (deleteGitPlatformRequest: DeleteGitPlatformRequest, thunkApi) => {
        return deleteGitPlatform(deleteGitPlatformRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 201) {
                const errorMessage = `Failed to delete a git-platform. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`deleteGitPlatform [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const gitPlatformDTO: GitPlatformDTO = response.data;
            console.log(gitPlatformDTO);

            const successMessage = `[deleteGitPlatform] deleted a git-platform successfully.`;
            console.log(successMessage);
            toastr.success(`deleteGitPlatform [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`deleteGitPlatform [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
