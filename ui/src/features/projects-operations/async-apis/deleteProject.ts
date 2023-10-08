import {createAsyncThunk} from "@reduxjs/toolkit";
import {DeleteProjectError, DeleteProjectRequest} from "../model";
import {deleteProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {refreshProjectsList} from "./refresh";

export const deleteProjectAsync = createAsyncThunk<any, DeleteProjectRequest, {
    rejectValue: DeleteProjectError
}>(
    'projects/deleteProject',
    async (deleteProjectRequest: DeleteProjectRequest, thunkApi) => {
        return deleteProject(deleteProjectRequest).then(response => {
            if (response.status !== 204) {
                const details = `Failed to delete project.`;
                const errorMessage = `Status: ${response.status}, Message: ${details}`;
                console.log(errorMessage);
                toastr.error(`deleteProject [Failure]`, errorMessage);
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const message = `Successfully delete project.`;
            console.log(message);
            toastr.success(`deleteProject [Success]`, message);
            // no need to save state in localstorage for this type of request.
            // refresh the list of Projects
            thunkApi.dispatch(refreshProjectsList());
            return response.data;
        }).catch((e: any) => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`deleteProject [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);