import {UserBackendApi} from "../../utils/backendApi";
import {CreateUserRequest, GetUserRequest, ListUsersRequest} from "./model";

// Sync apis (async apis are in thunk)
export const createUser = (createUserRequest: CreateUserRequest) => {
    return UserBackendApi().post("/", createUserRequest);
};


// Sync apis (async apis are in thunk)
export const listUsers = (_listUsersRequest: ListUsersRequest) => {
    return UserBackendApi().get("/");
};

// Sync apis (async apis are in thunk)
export const getUser = (getUserRequest: GetUserRequest) => {
    return UserBackendApi().get("/"+getUserRequest.email);
};