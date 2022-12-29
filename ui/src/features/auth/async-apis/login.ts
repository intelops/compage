import {createAsyncThunk} from "@reduxjs/toolkit";
import {LoginError, LoginRequest, LoginResponse} from "../model";
import {toastr} from 'react-redux-toastr'
import {login} from "../api";
import {setCurrentUserName} from "../../../utils/localstorage-client";

export const loginAsync = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: LoginError }>(
    'auth/login',
    async (loginRequest: LoginRequest, thunkApi) => {
        return login(loginRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const message = `Failed to login. Received: ${response.status}`
                console.log(message);
                toastr.error(`login [Failure]`, `${message}`);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: `${message}`
                });
            }

            const loginResponse: LoginResponse = response.data;

            // TODO This is temporary, need to replace with code extracting from localstorage.
            setCurrentUserName(loginResponse.login);
            const message = `${loginResponse.login} logged in successfully.`;
            console.log(message)
            toastr.success(`login [Success]`, `${message}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = JSON.parse(JSON.stringify(e.response.data)).message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`login [Failure]`, `${errorMessage}`);
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: `${message}`
            });
        });
    }
);
