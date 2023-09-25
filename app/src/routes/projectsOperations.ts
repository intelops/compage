import {requireEmailMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import Logger from '../utils/logger';
import {
    getCreateProjectError,
    getCreateProjectResponse,
    getDeleteProjectError,
    getGetProjectError,
    getGetProjectResponse,
    getListProjectsError,
    getListProjectsResponse,
    getProjectEntity,
    getUpdateProjectError,
    ProjectDTO,
    ProjectEntity
} from '../models/project';
import {createRepository} from '../integrations/git-platforms';
import {ProjectService} from '../services/projectService';

const projectsOperationsRouter = Router();
const projectService = new ProjectService();

// create project for owner_email with details given in request
projectsOperationsRouter.post('/users/:email/projects', requireEmailMiddleware, async (request: Request, response: Response) => {
    const ownerEmail = request.params.email;
    const projectDTO: ProjectDTO = request.body;
    // check if the received payload has same id as the one in the path.
    if ((ownerEmail.length === 0 || ownerEmail !== projectDTO.ownerEmail)) {
        return response.status(400).json(getUpdateProjectError('email in path and payload are not same'));
    }
    let savedProjectEntity: ProjectEntity = {} as ProjectEntity;
    try {
        // add createdAt and updatedAt
        projectDTO.createdAt = new Date().toISOString();
        projectDTO.updatedAt = new Date().toISOString();
        savedProjectEntity = await projectService.createProject(getProjectEntity(projectDTO));
        if (savedProjectEntity.id.length !== 0) {
            const resp = await createRepository(savedProjectEntity);
            Logger.debug(`createRepository Response: ${JSON.stringify(resp.data)}`);
            const successMessage = `[${savedProjectEntity.owner_email}] project[${savedProjectEntity.id}] created.`;
            Logger.info(successMessage);
            return response.status(201).json(getCreateProjectResponse(savedProjectEntity));
        }
        const message = `${projectDTO.ownerEmail} project [${projectDTO.displayName}] couldn't be created.`;
        Logger.error(message);
        return response.status(500).json(getCreateProjectError(message));
    } catch (e: any) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.includes('Repository creation failed.')) {
            if (savedProjectEntity?.id.length !== 0) {
                const isDeleted = await projectService.deleteProject(savedProjectEntity?.id);
                if (isDeleted) {
                    const successMessage = `'${ownerEmail}' project[${savedProjectEntity?.id}] deleted successfully.`;
                    Logger.info(successMessage);
                }
            }
        }
        const message = `${projectDTO.ownerEmail} project [${projectDTO.displayName}] couldn't be created[${e.message}]).`;
        Logger.error(message);
        return response.status(500).json(getCreateProjectError(message));
    }
});

// get project by owner_email and id for given project
projectsOperationsRouter.get('/users/:email/projects/:id', requireEmailMiddleware, async (request: Request, response: Response) => {
    const ownerEmail = request.params.email;
    const id = request.params.id;
    try {
        const projectEntity: ProjectEntity = await projectService.getProject(id as string);
        // check if there is id present in the object.
        if (projectEntity.id.length !== 0) {
            return response.status(200).json(getGetProjectResponse(projectEntity));
        }
        const message = `project couldn't be retrieved.`;
        Logger.error(message);
        return response.status(404).json();
    } catch (e: any) {
        const message = `project couldn't be retrieved[${e.message}].`;
        Logger.error(message);
        return response.status(500).json(getGetProjectError(message));
    }
});

// list all projects for given project
projectsOperationsRouter.get('/users/:email/projects', requireEmailMiddleware, async (request: Request, response: Response) => {
    const ownerEmail = request.params.email;
    try {
        const projectEntities = await projectService.listProjects(ownerEmail as string);
        return response.status(200).json(getListProjectsResponse(projectEntities));
    } catch (e: any) {
        const message = `projects couldn't be listed[${e.message}].`;
        Logger.error(message);
        return response.status(500).json(getListProjectsError(message));
    }
});

// update project with details given in request
projectsOperationsRouter.put('/users/:email/projects/:id', requireEmailMiddleware, async (request: Request, response: Response) => {
    const ownerEmail = request.params.email;
    const id = request.params.id;
    const projectDTO: ProjectDTO = request.body;
    // check if the received payload has same id as the one in the path.
    if ((ownerEmail.length === 0 || ownerEmail !== projectDTO.ownerEmail) || (id.length === 0 || id !== projectDTO.id)) {
        return response.status(400).json(getUpdateProjectError('email and id in path and payload are not same'));
    }
    try {
        const projectEntity: ProjectEntity = await projectService.getProject(projectDTO.id);
        if (projectEntity.owner_email.length === 0 || projectEntity.id.length === 0) {
            const errorMessage = `[${projectDTO.ownerEmail}] project[${projectDTO.id}] don't exist.`;
            Logger.error(errorMessage);
            return response.status(400).json(getUpdateProjectError(errorMessage));
        }
        projectDTO.updatedAt = new Date().toISOString();
        const isUpdated = await projectService.updateProject(id, getProjectEntity(projectDTO));
        if (isUpdated) {
            const successMessage = `[${projectDTO.ownerEmail}] project[${projectDTO.id}] updated.`;
            Logger.info(successMessage);
            return response.status(204).json();
        }
        const message = `[${projectDTO.ownerEmail}] project[${projectDTO.id}] couldn't be updated.`;
        Logger.error(message);
        return response.status(500).json(getUpdateProjectError(message));
    } catch (e: any) {
        const message = `[${projectDTO.ownerEmail}] project[${projectDTO.id}] couldn't be updated[${e.message}].`;
        Logger.error(message);
        return response.status(500).json(getUpdateProjectError(message));
    }
});

// delete project by id for given project
projectsOperationsRouter.delete('/users/:email/projects/:id', requireEmailMiddleware, async (request: Request, response: Response) => {
    const ownerEmail = request.params.email;
    const id = request.params.id;
    try {
        const isDeleted = await projectService.deleteProject(id);
        if (isDeleted) {
            const successMessage = `'${ownerEmail}' project[${id}] deleted successfully.`;
            Logger.info(successMessage);
            return response.status(204).json();
        }
        const errorMessage = `'${ownerEmail}' project[${id}] couldn't be deleted.`;
        Logger.error(errorMessage);
        return response.status(500).json(getDeleteProjectError(errorMessage));
    } catch (e: any) {
        const message = `'${ownerEmail}' project[${id}] couldn't be deleted[${e.message}].`;
        Logger.error(message);
        return response.status(500).json(getDeleteProjectError(message));
    }
});

export default projectsOperationsRouter;
