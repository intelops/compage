import {createAsyncThunk} from "@reduxjs/toolkit";
import {ExistsProjectError, ExistsProjectRequest, ExistsProjectResponse} from "../model";
import {getProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {
    removeCurrentConfig,
    removeCurrentProjectDetails,
    removeCurrentState,
    removeModifiedState
} from "../../../utils/localstorage-client";

// this is separately added even though this resembles to getProjectAsync. getProjectAsync updates the localstorage but existsProjectAsync doesn't.
export const existsProjectAsync = createAsyncThunk<ExistsProjectResponse, ExistsProjectRequest, { rejectValue: ExistsProjectError }>(
    'projects/existsProject',
    async (existsProjectRequest: ExistsProjectRequest, thunkApi) => {
        return getProject(existsProjectRequest).then(response => {
            if (response.status !== 200) {
                const message = `Failed to retrieve project.`;
                const errorMessage = `Status: ${response.status}, Message: ${message}`;
                console.log(errorMessage);
                toastr.error(`existsProject [Failure]`, errorMessage);
                removeCurrentConfig();
                removeCurrentState();
                removeModifiedState();
                removeCurrentProjectDetails();
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const message = `Successfully retrieved project.`;
            console.log(message);
            toastr.success(`existsProject [Success]`, message);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`existsProject [Failure]`, errorMessage);
            removeCurrentProjectDetails();
            removeCurrentConfig();
            removeCurrentState();
            removeModifiedState();
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);