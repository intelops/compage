import {UserEntity} from '../models/user';
import {UserDao} from '../store/userDao';
import {SqliteUserDaoImpl} from '../store/sqliteUserDaoImpl';
import {CassandraUserDaoImpl} from '../store/cassandraUserDaoImpl';
import config from '../utils/constants';

export class UserService {
    private userDao: UserDao;

    constructor() {
        // create the appropriate userDao based on the DB_TYPE
        if (config.db?.type === 'cassandra') {
            this.userDao = new CassandraUserDaoImpl();
        } else if (config.db?.type === 'sqlite') {
            this.userDao = new SqliteUserDaoImpl();
        } else {
            throw new Error('Invalid process.env.DB_TYPE');
        }
    }

    async createUser(user: UserEntity): Promise<UserEntity> {
        return await this.userDao.createUser(user);
    }

    async listUsers(): Promise<UserEntity[]> {
        return await this.userDao.listUsers();
    }

    async getUser(email: string): Promise<UserEntity> {
        return await this.userDao.getUser(email);
    }

    async updateUser(email: string, userEntity: UserEntity): Promise<boolean> {
        return await this.userDao.updateUser(email, userEntity);
    }

    async deleteUser(email: string): Promise<boolean> {
        return await this.userDao.deleteUser(email);
    }
}