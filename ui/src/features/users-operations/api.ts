import {UserBackendApi} from "../../utils/backendApi";
import {CreateUserRequest, GetUserRequest, ListUsersRequest} from "./model";

// Sync apis (async apis are in thunk)
export const createUser = (createUserRequest: CreateUserRequest) => {
    return UserBackendApi().post("/users", createUserRequest);
};


// Sync apis (async apis are in thunk)
export const listUsers = (_listUsersRequest: ListUsersRequest) => {
    return UserBackendApi().get("/users");
};

// Sync apis (async apis are in thunk)
export const getUser = (getUserRequest: GetUserRequest) => {
    return UserBackendApi().get("/users/"+getUserRequest.email);
};