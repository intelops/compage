import {requireUserNameMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {createProject, deleteProject, getProject, listProjects, updateProject} from '../util/project-client';
import {X_USER_NAME_HEADER} from '../util/constants';
import {
    CreateProjectError,
    CreateProjectResponse,
    DeleteProjectError,
    ProjectEntity,
    UpdateProjectError,
    UpdateProjectResponse
} from './models';
import {commitCompageJson, createRepository, pullCompageJson} from '../util/github-client';
import Logger from '../util/logger';

const projectsRouter = Router();

// delete project by id for given user
projectsRouter.delete('/:id', requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const isDeleted = await deleteProject(userName as string, projectId);
    if (isDeleted) {
        const msg = `'${projectId}' project deleted successfully.`;
        Logger.info(msg);
        return response.status(204).json({message: msg});
    }
    const message = `'${projectId}' project couldn't be deleted.`;
    Logger.warn(message);
    return response.status(500).json(getDeleteProjectError(message));
});

// get project by id for given user
projectsRouter.get('/:id', requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = await getProject(userName as string, projectId);
    // check if there is id present in the object.
    if (projectEntity.id.length !== 0) {
        return await updateFromGithub(projectEntity, response);
    }
    return response.status(404).json();
});

// list all projects for given user
projectsRouter.get('/', requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    return response.status(200).json(await listProjects(userName as string));
});

// create project with details given in request
projectsRouter.post('/', requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectEntity: ProjectEntity = request.body;
    const savedProjectEntity: ProjectEntity = await createProject(userName as string, projectEntity);
    if (savedProjectEntity.id.length !== 0) {
        // create repository on GitHub and .compage/config.json file/
        return await createOnGithub(savedProjectEntity, response);
    }
    const message = `${savedProjectEntity.displayName}[${savedProjectEntity.id}] project couldn't be created.`;
    Logger.warn(message);
    return response.status(500).json(getCreateProjectError(message));
});

// update project with details given in request
projectsRouter.put('/:id', requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = request.body;
    const updatedProjectEntity = await updateProject(projectId, userName as string, projectEntity);
    if (updatedProjectEntity.id.length !== 0) {
        // update GitHub with .compage/config.json
        return await updateToGithub(updatedProjectEntity, response);
    }
    // TODO this is coming null [not a compulsory field]
    // const message = `${projectEntity.displayName}[${projectEntity.id}] project couldn't be updated.`;
    const message = `[${projectEntity.id}] project couldn't be updated.`;
    Logger.warn(message);
    return response.status(500).json(getUpdateProjectError(message));
});

// commits first time changes in .compage/config.json in GitHub repository.
const addToGithub = (projectEntity: ProjectEntity, response: Response) => {
    const sha = '';
    // base64 the json as it's required for GitHub api.
    const buffer = Buffer.from(JSON.stringify(projectEntity.json));
    const base64Json = buffer.toString('base64');
    return commitCompageJson(
        projectEntity.user.name,
        projectEntity.user.email,
        projectEntity.repository.name,
        base64Json,
        'first commit',
        sha).then(resp => {
        const message = `The .compage/config.json in Repository for '${projectEntity.displayName}' is committed, ${projectEntity.displayName}[${projectEntity.id}] project is created successfully.`;
        Logger.info(message);
        return response.status(200).json(getCreateProjectResponse(projectEntity, message));
    }).catch(error => {
        const errorObject = JSON.parse(JSON.stringify(error));
        const msg = `The .compage/config.json in Repository for '${projectEntity.displayName}' couldn't be committed. Received error code while committing .compage/config.json in Github Repository: ${errorObject.status}`;
        Logger.error(msg);
        return response.status(500).json(getCreateProjectError(msg));
    });
};

// commits new changes to .compage/config.json in GitHub repository.
export const updateToGithub = (projectEntity: ProjectEntity, response: Response) => {
    // update GitHub repo and save json to GitHub (project's json to GitHub repo)
    return pullCompageJson(projectEntity.user.name, projectEntity.repository.name)
        .then(resp => {
            const sha = resp.data.sha;
            // base64 the json as it's required for GitHub api.
            const buffer = Buffer.from(JSON.stringify(projectEntity.json));
            const base64Json = buffer.toString('base64');
            return commitCompageJson(
                projectEntity.user.name,
                projectEntity.user.email,
                projectEntity.repository.name,
                base64Json,
                'updated project from ui',
                sha).then(res => {
                Logger.info('commitCompageJson Response: ', res.data);
                const message = `An update to .compage/config.json in Repository for '${projectEntity.displayName}' is committed, '${projectEntity.displayName}' is updated successfully`;
                Logger.info(message);
                return response.status(200).json(getUpdateProjectResponse(projectEntity, message));
            }).catch(error => {
                const errorObject = JSON.parse(JSON.stringify(error));
                const message = `An update to .compage/config.json in Repository for '${projectEntity.displayName}' couldn't be committed. Received error code while committing .compage/config.json in Github Repository: ${errorObject.status}`;
                Logger.error(message);
                return response.status(500).json(getUpdateProjectError(message));
            });
        })
        .catch(error => {
            const errorObject = JSON.parse(JSON.stringify(error));
            const message = `The .compage/config.json in Repository for '${projectEntity.displayName}' couldn't be pulled. Received error code while pulling .compage/config.json in Github Repository: ${errorObject.status}`;
            Logger.error(message);
            return response.status(500).json(getUpdateProjectError(message));
        });
};
// pulls .compage/config.json from GitHub repository and update it in k8s project.
const updateFromGithub = (projectEntity: ProjectEntity, response: Response) => {
    return pullCompageJson(projectEntity.user.name, projectEntity.repository.name)
        .then(resp => {
            const buff = Buffer.from(resp.data.content, 'base64');
            projectEntity.json = JSON.parse(buff.toString('ascii'));
            // updating project in k8s with latest json from GitHub.
            return updateProject(projectEntity.id, projectEntity.user.name as string, projectEntity)
                .then(updatedProjectEntity => {
                    if (updatedProjectEntity.id.length !== 0) {
                        const successMsg = `${updatedProjectEntity.displayName}[${updatedProjectEntity.id}] project is updated after pulling .compage/config.json in Github Repository.`;
                        Logger.info(successMsg);
                        return response.status(200).json(updatedProjectEntity);
                    }
                    const errorMsg = `${updatedProjectEntity.displayName}[${updatedProjectEntity.id}] project couldn't be updated after pulling .compage/config.json in Repository for '${projectEntity.id}'`;
                    Logger.warn(errorMsg);
                    return response.status(500).json({message: errorMsg});
                });
        }).catch(error => {
            const errorObject = JSON.parse(JSON.stringify(error));
            const errorMsg = `The .compage/config.json in Repository for '${projectEntity.id}' couldn't be pulled. Received error code while pulling .compage/config.json in Github Repository: ${errorObject.status}`;
            Logger.error(errorMsg);
            return response.status(500).json({message: errorMsg});
        });
};

// creates repository on GitHub and commits first version of yaml
const createOnGithub = (projectEntity: ProjectEntity, response: Response) => {
    // TODO change description
    return createRepository(projectEntity.user.name, projectEntity.repository.name, projectEntity.repository.name)
        .then(resp => {
            // create .compage/config.json file in GitHub repo
            return addToGithub(projectEntity, response);
        }).catch(error => {
            // delete project as it's going to be just there.
            deleteProject(projectEntity.user.name, projectEntity.id).then();
            const errorObject = JSON.parse(JSON.stringify(error));
            let message = `Repository for project '${projectEntity.displayName}' couldn't be created.`;
            if (errorObject.status === 422) {
                message = `${message} Please choose different Repository Name.`;
            } else {
                message = `${message} Received error code while creating GitHub repository: ${errorObject.status}`;
            }
            Logger.error(message);
            return response.status(500).json(getCreateProjectError(message));
        });
};

const getCreateProjectResponse = (projectEntity: ProjectEntity, message: string) => {
    const createProjectResponse: CreateProjectResponse = {
        project: projectEntity,
        message,
    };
    return createProjectResponse;
};

const getCreateProjectError = (message: string) => {
    const createProjectError: CreateProjectError = {
        message,
    };
    return createProjectError;
};

const getUpdateProjectResponse = (projectEntity: ProjectEntity, message: string) => {
    const updateProjectResponse: UpdateProjectResponse = {
        project: projectEntity,
        message,
    };
    return updateProjectResponse;
};

const getUpdateProjectError = (message: string) => {
    const updateProjectError: UpdateProjectError = {
        message,
    };
    return updateProjectError;
};

const getDeleteProjectError = (message: string) => {
    const deleteProjectError: DeleteProjectError = {
        message,
    };
    return deleteProjectError;
};

export default projectsRouter;
