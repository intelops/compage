export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

// entities
export interface UserEntity {
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    status?: Status;
    created_at?: string;
    updated_at?: string;
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

// requests
export interface CreateUserRequest extends UserDTO {

}

export interface DeleteUserRequest {

}

export interface UpdateUserRequest extends UserDTO {

}

export interface ListUsersRequest {

}

export const getCreateUserResponse = (userEntity: UserEntity) => {
    const userDTO: UserDTO = {
        email: userEntity.email,
        firstName: userEntity.first_name,
        lastName: userEntity.last_name,
        role: userEntity.role,
        status: userEntity.status,
        createdAt: userEntity.created_at,
        updatedAt: userEntity.updated_at,
    }
    return userDTO;
};

export const getGetUserResponse = (userEntity: UserEntity) => {
    const userDTO: UserDTO = {
        email: userEntity.email,
        firstName: userEntity.first_name,
        lastName: userEntity.last_name,
        role: userEntity.role,
        status: userEntity.status,
        createdAt: userEntity.created_at,
        updatedAt: userEntity.updated_at,
    }
    return userDTO;
};

export const getListUsersResponse = (userEntities: UserEntity[]) => {
    const userDTOs: UserDTO[] = [];
    userEntities.forEach((userEntity: UserEntity) => {
        const userDTO: UserDTO = {
            email: userEntity.email,
            firstName: userEntity.first_name,
            lastName: userEntity.last_name,
            role: userEntity.role,
            status: userEntity.status,
            createdAt: userEntity.created_at,
            updatedAt: userEntity.updated_at,
        }
        userDTOs.push(userDTO);
    });
    return userDTOs;
};

export const getUserEntity = (userDTO: UserDTO) => {
    const userEntity: UserEntity = {
        email: userDTO.email,
        first_name: userDTO.firstName,
        last_name: userDTO.lastName,
        role: userDTO.role,
        status: userDTO.status,
        created_at: userDTO.createdAt,
        updated_at: userDTO.updatedAt,
    };
    return userEntity;
}

// errors
interface CreateUserError {
    message: string;
}

interface DeleteUserError {
    message: string;
}

interface UpdateUserError {
    message: string;
}

interface ListUsersError {
    message: string;
}

interface GetUserError {
    message: string;
}

export const getCreateUserError = (message: string) => {
    const createUserError: CreateUserError = {
        message: message,
    };
    return createUserError;
};

export const getUpdateUserError = (message: string) => {
    const updateUserError: UpdateUserError = {
        message: message,
    };
    return updateUserError;
};

export const getDeleteUserError = (message: string) => {
    const deleteUserError: DeleteUserError = {
        message: message,
    };
    return deleteUserError;
};

export const getListUsersError = (message: string) => {
    const listUsersError: ListUsersError = {
        message: message,
    };
    return listUsersError;
};

export const getGetUserError = (message: string) => {
    const getUserError: GetUserError = {
        message: message,
    };
    return getUserError;
};