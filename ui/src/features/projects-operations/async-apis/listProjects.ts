import {createAsyncThunk} from "@reduxjs/toolkit";
import {ListProjectsError, ListProjectsRequest, ListProjectsResponse} from "../model";
import {listProjects} from "../api";
import {toastr} from 'react-redux-toastr';

export const listProjectsAsync = createAsyncThunk<ListProjectsResponse, ListProjectsRequest, {
    rejectValue: ListProjectsError
}>(
    'projects/listProjects',
    async (listProjectsRequest: ListProjectsRequest, thunkApi) => {
        return listProjects(listProjectsRequest).then(response => {
            if (response.status !== 200) {
                if (response.status === 401) {
                    sessionStorage.clear();
                }
                const details = `Failed to list projects.`;
                const errorMessage = `Status: ${response.status}, Message: ${details}`;
                console.log(errorMessage);
                toastr.error(`listProjects [Failure]`, errorMessage);
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const successMessage = `Successfully listed projects.`;
            console.log(successMessage);
            toastr.success(`listProjects [Success]`, successMessage);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            if (statusCode === 401) {
                sessionStorage.clear();
            }
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`listProjects [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);
