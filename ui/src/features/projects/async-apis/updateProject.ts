import {createAsyncThunk} from "@reduxjs/toolkit";
import {UpdateProjectError, UpdateProjectRequest, UpdateProjectResponse} from "../model";
import {updateProject} from "../api";
import {toastr} from 'react-redux-toastr';

export const updateProjectAsync = createAsyncThunk<UpdateProjectResponse, UpdateProjectRequest, { rejectValue: UpdateProjectError }>(
    'projects/updateProject',
    async (updateProjectRequest: UpdateProjectRequest, thunkApi) => {
        return updateProject(updateProjectRequest).then(response => {
            if (response.status !== 200) {
                const msg = `Failed to update project.`;
                const errorMessage = `Status: ${response.status}, Message: ${msg}`;
                console.log(errorMessage);
                toastr.error(`updateProject [Failure]`, errorMessage);
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const message = `Successfully update project.`;
            console.log(message);
            toastr.success(`updateProject [Success]`, message);
            // no need to save state in localstorage for this type of request.
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`updateProject [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);