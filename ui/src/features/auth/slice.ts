import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {loginAsync} from "./async-apis/login";

export interface AuthState {
    data: any;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    data: {},
    status: 'idle',
    error: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(loginAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.error = null
            state.data = action.payload;
        }).addCase(loginAsync.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload) state.error = JSON.stringify(action.payload);
        });
    },
});

export const selectAuthData = (state: RootState) => state.auth.data;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
