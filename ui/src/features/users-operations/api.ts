import {UserBackendApi} from "../../utils/backend-api";
import {CreateUserRequest, ListUsersRequest} from "./model";

// Sync apis (async apis are in thunk)
export const createUser = (createUserRequest: CreateUserRequest) => {
    return UserBackendApi().post("/users", createUserRequest);
};


// Sync apis (async apis are in thunk)
export const listUsers = (_listUsersRequest: ListUsersRequest) => {
    return UserBackendApi().get("/users");
};