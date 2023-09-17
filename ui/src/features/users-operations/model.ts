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
export interface CreateUserRequest extends UserDTO{
}

export interface CreateUserResponse extends UserDTO {
}

// This type describes the error object structure:
export interface CreateUserError {
    message: string;
}

// create project models
export interface ListUsersRequest {
}

export interface ListUsersResponse {
}

// This type describes the error object structure:
export interface ListUsersError {
    message: string;
}
