import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {ListUsersError, ListUsersRequest, ListUsersResponse} from "../model";
import {listUsers} from "../api";

export const listUsersAsync = createAsyncThunk<ListUsersResponse, ListUsersRequest, {
    rejectValue: ListUsersError
}>(
    'user/listUsers',
    async (listUsersRequest: ListUsersRequest, thunkApi) => {
        return listUsers(listUsersRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const errorMessage = `Failed to get a user. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`listUsers [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const listUsersResponse: ListUsersResponse = response.data;
            console.log(listUsersResponse);
            const successMessage = `[listUsers] listed a user successfully.`;
            console.log(successMessage);
            toastr.success(`listUsers [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`listUsers [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
