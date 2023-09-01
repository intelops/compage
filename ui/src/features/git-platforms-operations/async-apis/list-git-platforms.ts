import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {ListGitPlatformsError, ListGitPlatformsRequest, ListGitPlatformsResponse} from "../model";
import {listGitPlatforms} from "../api";

export const listGitPlatformsAsync = createAsyncThunk<ListGitPlatformsResponse, ListGitPlatformsRequest, {
    rejectValue: ListGitPlatformsError
}>(
    'gitPlatform/listGitPlatforms',
    async (listGitPlatformsRequest: ListGitPlatformsRequest, thunkApi) => {
        return listGitPlatforms(listGitPlatformsRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const msg = `Failed to get a git-platform. Received: ${response.status}`;
                console.log(msg);
                toastr.error(`listGitPlatforms [Failure]`, `${msg}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${msg}`
                });
            }

            const listGitPlatformsResponse: ListGitPlatformsResponse = response.data;
            console.log(listGitPlatformsResponse);
            const message = `[listGitPlatforms] listed a git-platform successfully.`;
            console.log(message);
            toastr.success(`listGitPlatforms [Success]`, `${message}`);
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
