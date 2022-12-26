import {createAsyncThunk} from "@reduxjs/toolkit";
import {ListProjectsError, ListProjectsRequest, ListProjectsResponse} from "../model";
import {listProjects} from "../api";
import {toastr} from 'react-redux-toastr'

export const listProjectsAsync = createAsyncThunk<ListProjectsResponse, ListProjectsRequest, { rejectValue: ListProjectsError }>(
    'projects/listProjects',
    async (listProjectsRequest: ListProjectsRequest, thunkApi) => {
        try {
            const response = await listProjects();
            // Check if status is not okay:
            if (response.status !== 200) {
                console.log("Failed to list projects. Received : " + response.status)
                toastr.error('Failure', "Failed to list projects. Received : " + response.status);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to list projects. Received : " + response.status
                });
            }
            console.log("Successfully listed projects :", JSON.stringify(response.data))
            toastr.success('Success', "Successfully listed projects");
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue({
                message: "Failed to create project. Received :" + e
            });
        }
    }
);
