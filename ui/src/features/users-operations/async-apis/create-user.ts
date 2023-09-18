import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {CreateUserError, CreateUserRequest, CreateUserResponse} from "../model";
import {createUser} from "../api";

export const createUserAsync = createAsyncThunk<CreateUserResponse, CreateUserRequest, {
    rejectValue: CreateUserError
}>(
    'user/createUser',
    async (createUserRequest: CreateUserRequest, thunkApi) => {
        return createUser(createUserRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 201) {
                const errorMessage = `Failed to create a user. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`createUser [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const createUserResponse: CreateUserResponse = response.data;
            console.log(createUserResponse);
            const successMessage = `[createUser] created a user successfully.`;
            console.log(successMessage);
            toastr.success(`createUser [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`createUser [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
