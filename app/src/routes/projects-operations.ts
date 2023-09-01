import {requireEmailMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {createProject, deleteProject, getProject, listProjects, updateProject} from '../utils/project-client';
import {
    CompageEdge,
    CompageNode,
    CreateProjectError,
    CreateProjectResponse,
    DeleteProjectError,
    ProjectEntity,
    UpdateProjectError,
    UpdateProjectResponse
} from './models';
import {commitCompageJson, createRepository, pullCompageJson} from '../integrations/git-providers/github';
import Logger from '../utils/logger';
import {X_EMAIL_HEADER} from '../utils/constants';
import {
    getCreateProjectError,
    getCreateProjectResponse,
    getDeleteProjectError,
    getUpdateProjectError
} from "../models/project";

const projectsOperationsRouter = Router();

// delete project by id for given user
projectsOperationsRouter.delete('/:id', requireEmailMiddleware, async (request: Request, response: Response) => {
    const email = request.header(X_EMAIL_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = {
        repository: {
            gitPlatformUserName: '',
            gitPlatformName: '',
            name: '',
            branch: '',
            isPublic: false
        },
        id: projectId,
        displayName: '',
        version: '',
        ownerEmail: email as string,
        json: {
            edges: new Map<string, CompageEdge>(),
            nodes: new Map<string, CompageNode>()
        },
    };
    const isDeleted = await deleteProject(projectEntity);
    if (isDeleted) {
        const msg = `'${projectId}' project deleted successfully.`;
        Logger.info(msg);
        return response.status(204).json();
    }
    const message = `'${projectId}' project couldn't be deleted.`;
    Logger.warn(message);
    return response.status(500).json(getDeleteProjectError(message));
});

// get project by id for given user
projectsOperationsRouter.get('/:id', requireEmailMiddleware, async (request: Request, response: Response) => {
    const email = request.header(X_EMAIL_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = await getProject(email as string, projectId);
    // check if there is id present in the object.
    if (projectEntity.id.length !== 0) {
        return await updateFromGithub(projectEntity, response);
    }
    return response.status(404).json();
});

// list all projects for given user
projectsOperationsRouter.get('/', requireEmailMiddleware, async (request: Request, response: Response) => {
    const email = request.header(X_EMAIL_HEADER);
    return response.status(200).json(await listProjects(email as string));
});

// create project with details given in request
projectsOperationsRouter.post('/', requireEmailMiddleware, async (request: Request, response: Response) => {
    const projectEntity: ProjectEntity = request.body;
    const savedProjectEntity: ProjectEntity = await createProject(projectEntity);
    if (savedProjectEntity.id.length !== 0) {
        // create repository on GitHub and .compage/config.json file/
        return await createOnGithub(savedProjectEntity, response);
    }
    const message = `${savedProjectEntity.displayName}[${savedProjectEntity.id}] project couldn't be created.`;
    Logger.warn(message);
    return response.status(500).json(getCreateProjectError(message));
});

// update project with details given in request
projectsOperationsRouter.put('/:id', requireEmailMiddleware, async (request: Request, response: Response) => {
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = request.body;
    // check if the received payload has same id as the one in the path.
    if (projectId.length === 0 || (projectId !== projectEntity.id)) {
        return response.status(400).json('id and payload aren\'t same.');
    }
    const updatedProjectEntity = await updateProject(projectEntity);
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
const addToGithub = async (projectEntity: ProjectEntity, response: Response) => {
    const sha = '';
    try {
        const resp = await commitCompageJson(projectEntity, 'first commit', sha);
        Logger.debug(`commitCompageJson Response: ${JSON.stringify(resp.data)}`);
        const message = `The .compage/config.json in Repository for '${projectEntity.displayName}' is committed, ${projectEntity.displayName}[${projectEntity.id}] project is created successfully.`;
        Logger.info(message);
        return response.status(201).json(getCreateProjectResponse(projectEntity));
    } catch (error) {
        const errorObject = JSON.parse(JSON.stringify(error));
        const msg = `The .compage/config.json in Repository for '${projectEntity.displayName}' couldn't be committed. Received error code while committing .compage/config.json in Github Repository: ${errorObject.status}`;
        Logger.error(msg);
        return response.status(500).json(getCreateProjectError(msg));
    }
};

// commits new changes to .compage/config.json in GitHub repository.
export const updateToGithub = async (projectEntity: ProjectEntity, response: Response) => {
    // update GitHub repo and save json to GitHub (project's json to GitHub repo)
    try {
        const resp = await pullCompageJson(projectEntity);
        const sha = resp.data.sha;
        try {
            const res = await commitCompageJson(
                projectEntity,
                'updated project from ui',
                sha);
            Logger.debug(`commitCompageJson Response: ${JSON.stringify(res.data)}`);
            const message = `An update to .compage/config.json in Repository for '${projectEntity.displayName}' is committed, '${projectEntity.displayName}' is updated successfully`;
            Logger.info(message);
            return response.status(204).json();
        } catch (error) {
            const errorObject = JSON.parse(JSON.stringify(error));
            const message = `An update to .compage/config.json in Repository for '${projectEntity.displayName}' couldn't be committed. Received error code while committing .compage/config.json in Github Repository: ${errorObject.status}`;
            Logger.error(message);
            return response.status(500).json(getUpdateProjectError(message));
        }
    } catch (error) {
        const errorObject = JSON.parse(JSON.stringify(error));
        const message = `The .compage/config.json in Repository for '${projectEntity.displayName}' couldn't be pulled. Received error code while pulling .compage/config.json in Github Repository: ${errorObject.status}`;
        Logger.error(message);
        return response.status(500).json(getUpdateProjectError(message));
    }
};
// pulls .compage/config.json from GitHub repository and update it in k8s project.
const updateFromGithub = async (projectEntity: ProjectEntity, response: Response) => {
    try {
        const resp = await pullCompageJson(projectEntity);
        const buff = Buffer.from(resp.data.content, 'base64');
        projectEntity.json = JSON.parse(buff.toString('ascii'));
        // updating project in k8s with latest json from GitHub.
        const updatedProjectEntity = await updateProject(projectEntity);
        if (updatedProjectEntity.id.length !== 0) {
            const successMsg = `${updatedProjectEntity.displayName}[${updatedProjectEntity.id}] project is updated after pulling .compage/config.json in Github Repository.`;
            Logger.info(successMsg);
            return response.status(200).json(updatedProjectEntity);
        }
        const errorMsg = `${updatedProjectEntity.displayName}[${updatedProjectEntity.id}] project couldn't be updated after pulling .compage/config.json in Repository for '${projectEntity.id}'`;
        Logger.warn(errorMsg);
        return response.status(500).json({message: errorMsg});

    } catch (error) {
        const errorObject = JSON.parse(JSON.stringify(error));
        const errorMsg = `The .compage/config.json in Repository for '${projectEntity.id}' couldn't be pulled. Received error code while pulling .compage/config.json in Github Repository: ${errorObject.status}`;
        Logger.error(errorMsg);
        return response.status(500).json({message: errorMsg});
    }
};

// creates repository on GitHub and commits first version of yaml
const createOnGithub = async (projectEntity: ProjectEntity, response: Response) => {
    // TODO change description
    try {
        const resp = await createRepository(projectEntity);
        Logger.debug(`createRepository Response: ${JSON.stringify(resp.data)}`);
        return await addToGithub(projectEntity, response);
    } catch (error) {
        Logger.debug('Error while creating repository on GitHub: ' + JSON.stringify(error));
        // delete project as it's going to be just there.
        deleteProject(projectEntity).then();
        const errorObject = JSON.parse(JSON.stringify(error));
        let message = `Repository for project '${projectEntity.displayName}' couldn't be created.`;
        if (errorObject.status === 422) {
            message = `${message} Please choose different Repository Name.`;
        } else {
            message = `${message} Received error code while creating GitHub repository: ${errorObject.status}`;
        }
        Logger.error(message);
        return response.status(500).json(getCreateProjectError(message));
    }
};


export default projectsOperationsRouter;
