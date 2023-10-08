import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {createUserAsync} from "./async-apis/createUser";
import {UserDTO} from "./model";
import {listUsersAsync} from "./async-apis/listUsers";
import {getUserAsync} from "./async-apis/getUser";

export interface UserState {
    createUser: {
        data: UserDTO,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    listUsers: {
        data: UserDTO[],
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
    getUser: {
        data: UserDTO,
        status: 'idle' | 'loading' | 'failed';
        error: string | null;
    };
}

const initialState: UserState = {
    createUser: {
        data: {} as UserDTO,
        status: 'idle',
        error: null
    },
    listUsers: {
        data: [],
        status: 'idle',
        error: null
    },
    getUser: {
        data: {} as UserDTO,
        status: 'idle',
        error: null
    }
};

export const usersSlice = createSlice({
    name: 'usersOperations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createUserAsync.pending, (state) => {
            state.createUser.status = 'loading';
            state.createUser.error = null;
        }).addCase(createUserAsync.fulfilled, (state, action) => {
            state.createUser.status = 'idle';
            state.createUser.error = null;
            state.createUser.data = action.payload;
        }).addCase(createUserAsync.rejected, (state, action) => {
            state.createUser.status = 'failed';
            if (action.payload) state.createUser.error = JSON.stringify(action.payload);
        }).addCase(listUsersAsync.pending, (state) => {
            state.listUsers.status = 'loading';
            state.listUsers.error = null;
        }).addCase(listUsersAsync.fulfilled, (state, action) => {
            state.listUsers.status = 'idle';
            state.listUsers.error = null;
            state.listUsers.data = action.payload as UserDTO[];
        }).addCase(listUsersAsync.rejected, (state, action) => {
            state.listUsers.status = 'failed';
            if (action.payload) state.listUsers.error = JSON.stringify(action.payload);
        }).addCase(getUserAsync.pending, (state) => {
            state.getUser.status = 'loading';
            state.getUser.error = null;
        }).addCase(getUserAsync.fulfilled, (state, action) => {
            state.getUser.status = 'idle';
            state.getUser.error = null;
            state.getUser.data = action.payload as UserDTO;
        }).addCase(getUserAsync.rejected, (state, action) => {
            state.getUser.status = 'failed';
            if (action.payload) state.getUser.error = JSON.stringify(action.payload);
        });
    },
});

export const selectCreateUserData = (state: RootState) => state.usersOperations.createUser.data;
export const selectCreateUserError = (state: RootState) => state.usersOperations.createUser.error;
export const selectCreateUserStatus = (state: RootState) => state.usersOperations.createUser.status;

export const selectListUsersData = (state: RootState) => state.usersOperations.listUsers.data;
export const selectListUsersError = (state: RootState) => state.usersOperations.listUsers.error;
export const selectListUsersStatus = (state: RootState) => state.usersOperations.listUsers.status;

export const selectGetUserData = (state: RootState) => state.usersOperations.getUser.data;
export const selectGetUserError = (state: RootState) => state.usersOperations.getUser.error;
export const selectGetUserStatus = (state: RootState) => state.usersOperations.getUser.status;

export default usersSlice.reducer;
