import {requireEmailMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {createUser, deleteUser, getUser, listUsers, updateUser} from '../store/cassandra/user-dao';
import Logger from '../utils/logger';
import {
    getCreateUserError,
    getCreateUserResponse,
    getDeleteUserError,
    getGetUserError,
    getGetUserResponse,
    getListUsersError,
    getListUsersResponse,
    getUpdateUserError,
    getUserEntity,
    UserDTO,
    UserEntity
} from "../models/user";

const usersOperationsRouter = Router();

// create user with details given in request
usersOperationsRouter.post('/', requireEmailMiddleware, async (request: Request, response: Response) => {
    const userDTO: UserDTO = request.body;
    try {
        const userEntity: UserEntity = await getUser(userDTO.email);
        if (userEntity.email.length !== 0) {
            const message = `[${userDTO.email}] user already exists.`;
            Logger.error(message);
            return response.status(400).json(getCreateUserError(message));
        }
        userDTO.createdAt = new Date().toISOString();
        userDTO.updatedAt = new Date().toISOString();
        const savedUserEntity: UserEntity = await createUser(getUserEntity(userDTO));
        if (savedUserEntity.email.length !== 0) {
            const message = `[${userDTO.email}] user created.`;
            Logger.info(message);
            return response.status(201).json(getCreateUserResponse(savedUserEntity));
        }
        const message = `${userDTO.email} user couldn't be created.`;
        Logger.error(message);
        return response.status(500).json(getCreateUserError(message));
    } catch (e: any) {
        const message = `${userDTO.email} user couldn't be created.`;
        Logger.error(message);
        return response.status(500).json(getCreateUserError(message));
    }
});

// get user by email for given user
usersOperationsRouter.get('/:email', requireEmailMiddleware, async (request: Request, response: Response) => {
    const email = request.params.email;
    try {
        const userEntity: UserEntity = await getUser(email as string);
        // check if there is id present in the object.
        if (userEntity.email.length !== 0) {
            return response.status(200).json(getGetUserResponse(userEntity));
        }
        return response.status(404).json();
    } catch (e: any) {
        const message = `user couldn't be retrieved: ${e.message}.`;
        Logger.error(message);
        return response.status(500).json(getGetUserError(message));
    }
});

// list all users for given user
usersOperationsRouter.get('/', requireEmailMiddleware, async (_request: Request, response: Response) => {
    try {
        const userEntities = await listUsers();
        return response.status(200).json(getListUsersResponse(userEntities));
    } catch (e: any) {
        const message = `users couldn't be listed: ${e.message}.`;
        Logger.error(message);
        return response.status(500).json(getListUsersError(message));
    }
});

// update user with details given in request
usersOperationsRouter.put('/:email', requireEmailMiddleware, async (request: Request, response: Response) => {
    const email = request.params.email;
    const userDTO: UserDTO = request.body;
    // check if the received payload has same id as the one in the path.
    if (email.length === 0 || (email !== userDTO.email)) {
        return response.status(400).json(getUpdateUserError('email in path and payload are not same'));
    }
    try {
        const userEntity: UserEntity = await getUser(userDTO.email);
        if (userEntity.email.length === 0) {
            const message = `[${userDTO.email}] user doesn't exist.`;
            Logger.error(message);
            return response.status(400).json(getUpdateUserError(message));
        }
        userDTO.updatedAt = new Date().toISOString();
        const isUpdated: boolean = await updateUser(email, getUserEntity(userDTO));
        if (isUpdated) {
            const message = `[${userDTO.email}] user updated.`;
            Logger.info(message);
            return response.status(204).json();
        }
        const message: string = `[${userDTO.email}] user couldn't be updated.`;
        Logger.error(message);
        return response.status(500).json(getUpdateUserError(message));
    } catch (e: any) {
        const message = `[${userDTO.email}] user couldn't be updated.`;
        Logger.error(message);
        return response.status(500).json(getUpdateUserError(message));
    }
});

// delete user by id for given user
usersOperationsRouter.delete('/:email', requireEmailMiddleware, async (request: Request, response: Response) => {
    const email = request.params.email;
    try {
        const isDeleted = await deleteUser(email);
        if (isDeleted) {
            const msg = `'${email}' user deleted successfully.`;
            Logger.info(msg);
            return response.status(204).json({message: msg});
        }
        const message = `'${email}' user couldn't be deleted.`;
        Logger.error(message);
        return response.status(500).json(getDeleteUserError(message));
    } catch (e: any) {
        const message = `[${email}] user couldn't be deleted: ${e.message}.`;
        Logger.error(message);
        return response.status(500).json(getDeleteUserError(message));
    }
});

export default usersOperationsRouter;
