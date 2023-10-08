import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {GitPlatformDTO, ListGitPlatformsError, ListGitPlatformsRequest} from "../model";
import {listGitPlatforms} from "../api";

export const listGitPlatformsAsync = createAsyncThunk<GitPlatformDTO[], ListGitPlatformsRequest, {
    rejectValue: ListGitPlatformsError
}>(
    'gitPlatform/listGitPlatforms',
    async (listGitPlatformsRequest: ListGitPlatformsRequest, thunkApi) => {
        return listGitPlatforms(listGitPlatformsRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const errorMessage = `Failed to get a git-platform. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`listGitPlatforms [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const gitPlatformDTOs: GitPlatformDTO[] = response.data;
            console.log(gitPlatformDTOs);
            const successMessage = `[listGitPlatforms] listed a git-platform successfully.`;
            console.log(successMessage);
            toastr.success(`listGitPlatforms [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`listGitPlatforms [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
