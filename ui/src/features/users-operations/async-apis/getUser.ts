import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr';
import {GetUserError, GetUserRequest, UserDTO} from "../model";
import {getUser} from "../api";

export const getUserAsync = createAsyncThunk<UserDTO, GetUserRequest, {
    rejectValue: GetUserError
}>(
    'user/getUser',
    async (getUserRequest: GetUserRequest, thunkApi) => {
        return getUser(getUserRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const errorMessage = `Failed to get a user. Received: ${response.status}`;
                console.log(errorMessage);
                toastr.error(`getUser [Failure]`, `${errorMessage}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${errorMessage}`
                });
            }

            const userDTO: UserDTO = response.data;
            console.log(userDTO);
            const successMessage = `[getUser] got a user successfully.`;
            console.log(successMessage);
            toastr.success(`getUser [Success]`, `${successMessage}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`getUser [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
