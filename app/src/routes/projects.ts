import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {createProject, deleteProject, getProject, listProjects, updateProject} from "../util/project-store";
import {X_USER_NAME_HEADER} from "../util/constants";
import {ProjectEntity} from "./models";
import {createRepository} from "./github";

const projectsRouter = Router();


// delete project by id for given user
projectsRouter.delete("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const isDeleted = await deleteProject(<string>userName, projectId);
    if (isDeleted) {
        const message = `'${projectId}' project deleted successfully.`
        console.log(message)
        return response.status(204).json({message: message});
    }
    const message = `'${projectId}' project couldn't be deleted.`
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
        //TODO fetch latest yaml from github and replace the project's yaml with it.
        // Update project resource
        return response.status(200).json(projectResource);
    }
    return response.status(404).json();
});

// list all projects for given user
projectsRouter.get("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    // TODO remove it later
    await new Promise(r => setTimeout(r, 5000));
    return response.status(200).json(await listProjects(<string>userName));
});

// create project with details given in request
projectsRouter.post("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectEntity: ProjectEntity = request.body;
    const createdProjectResource = await createProject(<string>userName, projectEntity);
    if (createdProjectResource.apiVersion) {
        // TODO Create github repo and save yaml to github (project's yaml to github repo)
        try {
            const axiosResponse = await createRepository(projectEntity.user.name, projectEntity.repository.name, projectEntity.repository.name);
            if (axiosResponse.data) {
                console.log("data : ", axiosResponse.data)
                const message = `'${createdProjectResource.metadata.name}' project created successfully.`
                console.log(message)
                return response.status(201).json({message: message});
            } else if (axiosResponse.status !== 200) {
                const message = `Repository for '${createdProjectResource.metadata.name}' couldn't be created. Received error code while creating github repository for '${createdProjectResource.metadata.name}': ` + axiosResponse.status
                console.log(message)
                return response.status(500).json({message: message});
            }
        } catch (e) {
            let message = `Repository for '${createdProjectResource.metadata.name}' couldn't be created.`
            const error = JSON.parse(JSON.stringify(e));
            if (error.status === 422) {
                message = message + " Please choose different Repository Name."
            } else {
                message = message + `Received error code while creating github repository for '${createdProjectResource.metadata.name}': ` + error.status
            }
            console.log(message)
            return response.status(500).json({message: message});
        }
    }
    const message = `'${projectEntity.displayName}' project couldn't be created.`
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
        // TODO update github repo and save yaml to github (project's yaml to github repo)
        const message = `'${projectEntity.displayName}' project updated successfully.`
        console.log(message)
        return response.status(201).json({message: message});
    }
    const message = `'${projectEntity.displayName}' project couldn't be updated.`
    console.log(message)
    return response.status(500).json({message: message});
});

export default projectsRouter;
