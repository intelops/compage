export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface UserDTO {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    status?: Status;
    createdAt?: string;
    updatedAt?: string;
}

// create project models
export interface CreateUserRequest extends UserDTO {
}

// This type describes the error object structure:
export interface CreateUserError {
    message: string;
}

// create user models
export interface ListUsersRequest {
}

// This type describes the error object structure:
export interface ListUsersError {
    message: string;
}

// create user models
export interface GetUserRequest {
    email: string;
}

// This type describes the error object structure:
export interface GetUserError {
    message: string;
}
