import {createAsyncThunk} from "@reduxjs/toolkit";
import {UpdateProjectError, UpdateProjectRequest} from "../model";
import {updateProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {refreshCurrentProject, refreshProjectsList} from "./refresh";

export const updateProjectAsync = createAsyncThunk<any, UpdateProjectRequest, {
    rejectValue: UpdateProjectError
}>(
    'projects/updateProject',
    async (updateProjectRequest: UpdateProjectRequest, thunkApi) => {
        return updateProject(updateProjectRequest).then(response => {
            if (response.status !== 204) {
                const details = `Failed to update project.`;
                const errorMessage = `Status: ${response.status}, Message: ${details}`;
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
            // refresh the list of Projects
            thunkApi.dispatch(refreshProjectsList());
            thunkApi.dispatch(refreshCurrentProject(updateProjectRequest.id));
            return response.data;
        }).catch((e: any) => {
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