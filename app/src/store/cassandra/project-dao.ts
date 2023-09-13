import {ProjectEntity} from "../../models/project";
import {cassandraClient} from "./cassandra-client";

const lengthOfChars = 5;

const containsSpecialChars = (character: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/;
    return specialChars.test(character);
};

export const getSanitizedName = (name: string) => {
    const sanitizedName = name.substring(0, lengthOfChars);
    // check if last char is non-alphanumeric
    const lastCharacter = sanitizedName.charAt(sanitizedName.length - 1);
    if (containsSpecialChars(lastCharacter)) {
        // remove last character in sanitizedUserName.
        const slicedSanitizedName = name.slice(0, sanitizedName.length - 1);
        // append x to make it 5 characters string.
        return slicedSanitizedName + 'x';
    }
    return sanitizedName;
};

// generateProjectId generates unique id for project.
const generateProjectId = (projectEntity: ProjectEntity) => {
    const userName = projectEntity.git_platform_user_name;
    const projectName = projectEntity.display_name;
    // truncate userName if its length is greater than 5
    let sanitizedUserName = userName;
    if (userName.length > lengthOfChars) {
        sanitizedUserName = getSanitizedName(userName);
    }

    // truncate projectResourceSpec.name if its length is greater than 5
    let sanitizedProjectName;
    if (projectName.length > lengthOfChars) {
        sanitizedProjectName = getSanitizedName(projectName);
    } else {
        let appended = '';
        const count = lengthOfChars - projectName.length;
        for (let i = 0; i < count; i++) {
            appended += 'x';
        }
        sanitizedProjectName = getSanitizedName(projectName) + appended;
    }

    return sanitizedUserName.toLowerCase() + '-' + sanitizedProjectName.toLowerCase() + '-' + (Math.floor(Math.random() * 90000) + 10000);
};

export const createProject = async (projectEntity: ProjectEntity) => {
    const query = `INSERT INTO projects (id, display_name, version, json, git_platform_name, git_platform_user_name,
                                         is_repository_public, repository_branch, repository_name, owner_email,
                                         created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS`;
    const params = [generateProjectId(projectEntity), projectEntity.display_name, projectEntity.version, projectEntity.json, projectEntity.git_platform_name, projectEntity.git_platform_user_name, projectEntity.is_repository_public, projectEntity.repository_branch, projectEntity.repository_name, projectEntity.owner_email, projectEntity.created_at, projectEntity.updated_at];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    if (resultSet.wasApplied()) {
        return projectEntity;
    }
    const projectEntityError: ProjectEntity = {
        id: "",
        display_name: "",
        version: "",
        json: "",
        git_platform_name: "",
        git_platform_user_name: "",
        is_repository_public: false,
        repository_branch: "",
        repository_name: "",
        owner_email: "",
        created_at: "",
        updated_at: "",
    }
    return projectEntityError;
}

export const updateProject = async (id: string, projectEntity: ProjectEntity) => {
    const query = `UPDATE projects
                   SET display_name = ?,
                       version      = ?,
                       json         = ?,
                       updated_at   = ?
                   WHERE id = ? IF EXISTS`;
    const params = [projectEntity.display_name, projectEntity.version, projectEntity.json, projectEntity.updated_at, id];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    return resultSet.wasApplied();
}

export const deleteProject = async (id: string) => {
    const query = `DELETE
                   FROM projects
                   WHERE id = ?`;
    const params = [id];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    return resultSet.wasApplied();

}

export const listProjects = async (ownerEmail: string) => {
    const query = `SELECT *
                   FROM projects
                   where owner_email = ? ALLOW FILTERING`;
    const params = [ownerEmail];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    const rows = resultSet.rows;
    const projectEntities: ProjectEntity[] = [];
    rows.forEach((row) => {
        const projectEntity: ProjectEntity = {
            id: row.id,
            display_name: row.display_name,
            git_platform_name: row.git_platform_name,
            git_platform_user_name: row.git_platform_user_name,
            is_repository_public: row.is_repository_public,
            repository_branch: row.repository_branch,
            repository_name: row.repository_name,
            version: row.version,
            json: row.json,
            owner_email: row.owner_email,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
        projectEntities.push(projectEntity);
    });

    return projectEntities;
}

export const getProject = async (id: string) => {
    const query = `SELECT *
                   FROM projects
                   WHERE id = ? ALLOW FILTERING`;
    const params = [id];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    const row = resultSet.first();
    if (!row) {
        const projectEntity: ProjectEntity = {
            id: "",
            display_name: "",
            version: "",
            json: "",
            git_platform_name: "",
            git_platform_user_name: "",
            is_repository_public: false,
            repository_branch: "",
            repository_name: "",
            owner_email: "",
            created_at: "",
            updated_at: "",
        }
        return projectEntity;
    }

    const projectEntity: ProjectEntity = {
        id: row.id,
        display_name: row.display_name,
        git_platform_name: row.git_platform_name,
        git_platform_user_name: row.git_platform_user_name,
        is_repository_public: row.is_repository_public,
        repository_branch: row.repository_branch,
        repository_name: row.repository_name,
        version: row.version,
        json: row.json,
        owner_email: row.owner_email,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };

    return projectEntity;
}
