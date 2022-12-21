import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {createProject, deleteProject, getProject, listProjects, updateProject} from "../util/project-store";
import {X_USER_NAME_HEADER} from "../util/constants";
import {ProjectEntity} from "./models";

const projectsRouter = Router();


// delete project by id for given user
projectsRouter.delete("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const isDeleted = await deleteProject(<string>userName, projectId);
    if (isDeleted) {
        const message = `'${projectId}' project deleted successfully`
        console.log(message)
        return response.status(204).json({message: message});
    }
    const message = `'${projectId}' project couldn't be deleted`
    console.log(message)
    return response.status(500).json({message: message});
});

// get project by id for given user
projectsRouter.get("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const projectResource = await getProject(<string>userName, projectId);
    // check if there is any keys in the object.
    if (Object.keys(projectResource).length !== 0) {
        return response.status(200).json(projectResource);
    }
    return response.status(404).json();
});

// list all projects for given user
projectsRouter.get("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    return response.status(200).json(await listProjects(<string>userName));
});

// create project with details given in request
projectsRouter.post("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectEntity: ProjectEntity = request.body;
    const createdProjectResource = await createProject(<string>userName, projectEntity);
    if (createdProjectResource.apiVersion) {
        const message = `'${createdProjectResource.metadata.name}' project created successfully`
        console.log(message)
        return response.status(201).json({message: message});
    }
    const message = `'${projectEntity.displayName}' project couldn't be created`
    console.log(message)
    return response.status(500).json({message: message});
});

// update project with details given in request
projectsRouter.put("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = request.body;
    const isUpdated = await updateProject(projectId, <string>userName, projectEntity);
    if (isUpdated) {
        const message = `'${projectEntity.displayName}' project updated successfully`
        console.log(message)
        return response.status(201).json({message: message});
    }
    const message = `'${projectEntity.displayName}' project couldn't be updated`
    console.log(message)
    return response.status(500).json({message: message});
});

export default projectsRouter;
