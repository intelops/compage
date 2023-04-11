import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetCurrentContextError, GetCurrentContextRequest, GetCurrentContextResponse} from "../model";
import {toastr} from 'react-redux-toastr';
import {getCurrentContext} from "../api";

export const getCurrentContextAsync = createAsyncThunk<GetCurrentContextResponse, GetCurrentContextRequest, {
    rejectValue: GetCurrentContextError
}>(
    'k8s-operations/getCurrentContext',
    async (getCurrentContextRequest: GetCurrentContextRequest, thunkApi) => {
        return getCurrentContext().then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const msg = `Failed to retrieve context. Received: ${response.status}`;
                console.log(msg);
                toastr.error(`getCurrentContext [Failure]`, msg);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: msg
                });
            }
            const message = `Successfully retrieved current context`;
            console.log(message);
            toastr.success(`getCurrentContext [Success]`, `${message}`);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`getCurrentContext [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);
