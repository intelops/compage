import {UserEntity} from "../../models/user";
import {cassandraClient} from "./cassandraClient";

export const createUser = async (userEntity: UserEntity) => {
    const query = `INSERT INTO users (email, first_name, last_name, role, status, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS`;
    const params = [userEntity.email, userEntity.first_name, userEntity.last_name, userEntity.role, userEntity.status, userEntity.created_at, userEntity.updated_at];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    if (resultSet.wasApplied()) {
        return userEntity;
    }
    const userEntityError: UserEntity = {
        email: '',
    }
    return userEntityError;
}

export const updateUser = async (email: string, userEntity: UserEntity) => {
    const query = `UPDATE users
                   SET first_name = ?,
                       last_name  = ?,
                       role       = ?,
                       status     = ?,
                       updated_at = ?
                   WHERE email = ?`;
    const params = [userEntity.first_name, userEntity.last_name, userEntity.role, userEntity.status, userEntity.updated_at, email];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    return resultSet.wasApplied();
}

export const deleteUser = async (email: string) => {
    const query = `DELETE
                   FROM users
                   WHERE email = ?`;
    const params = [email];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    return resultSet.wasApplied();

}

export const listUsers = async () => {
    const query = `SELECT *
                   FROM users`;
    const resultSet = await cassandraClient.execute(query);
    const rows = resultSet.rows;
    const userEntities: UserEntity[] = [];
    rows.forEach((row) => {
        const userEntity: UserEntity = {
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            role: row.role,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
        userEntities.push(userEntity);
    });
    return userEntities;
}

export const getUser = async (email: string) => {
    const query = `SELECT *
                   FROM users
                   WHERE email = ?`;
    const params = [email];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    const row = resultSet.first();
    if (!row) {
        const userEntity: UserEntity = {
            email: '',
        }
        return userEntity;
    }

    const userEntity: UserEntity = {
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        role: row.role,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };

    return userEntity;
}
