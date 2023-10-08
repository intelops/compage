import {UserEntity} from '../models/user';

export interface UserDao {
    createUser(userEntity: UserEntity): Promise<UserEntity>;

    listUsers(): Promise<UserEntity[]>;

    getUser(email: string): Promise<UserEntity>;

    updateUser(email: string, userEntity: UserEntity): Promise<boolean>;

    deleteUser(email: string): Promise<boolean>;
}