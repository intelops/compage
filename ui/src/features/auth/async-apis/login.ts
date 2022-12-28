import {createAsyncThunk} from "@reduxjs/toolkit";
import {LoginError, LoginRequest, LoginResponse} from "../model";
import {login} from "../api";
import {toastr} from 'react-redux-toastr'
import {setCurrentUserName} from "../../../utils/localstorage-client";

export const loginAsync = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: LoginError }>(
    'auth/login',
    async (loginRequest: LoginRequest, thunkApi) => {
        try {
            const response = await login(loginRequest);

            // Check if status is not okay:
            if (response.status !== 200) {
                console.log("Failed to login. Received : " + response.status);
                toastr.error('Failure', "Failed to login. Received : " + response.status);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: "Failed to login. Received : " + response.status
                });
            }

            const loginResponse: LoginResponse = response.data;

            // TODO This is temporary, need to replace with code extracting from localstorage.
            setCurrentUserName(loginResponse.login);
            console.log("Successfully logged in : " + loginResponse.login);
            toastr.success('Success : ' + loginResponse.login, "Successfully logged in.");
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue({
                message: "Failed to logged in. Received :" + e
            });
        }
    }
);
