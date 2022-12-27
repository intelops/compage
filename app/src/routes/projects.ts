import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {createProject, deleteProject, getProject, listProjects, updateProject} from "../util/project-store";
import {X_USER_NAME_HEADER} from "../util/constants";
import {ProjectEntity} from "./models";
import {createRepository, pullCompageJson} from "../store/github-client";

const projectsRouter = Router();


// delete project by id for given user
projectsRouter.delete("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const isDeleted = await deleteProject(<string>userName, projectId);
    if (isDeleted) {
        const message = `'${projectId}' project deleted successfully.`;
        console.log(message);
        return response.status(204).json({message: message});
    }
    const message = `'${projectId}' project couldn't be deleted.`;
    console.log(message);
    return response.status(500).json({message: message});
});

// get project by id for given user
projectsRouter.get("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = await getProject(<string>userName, projectId);
    // check if there is id present in the object.
    if (projectEntity.id.length !== 0) {
        try {
            // pull .compage/config.json from github repository.
            const axiosResponse = await pullCompageJson(projectEntity.user.name, projectEntity.repository.name);
            if (axiosResponse.data) {
                console.log("pulled compageJson : ", axiosResponse.data);
                projectEntity.json = JSON.parse(axiosResponse.data);

                // updating project with latest json from github.
                const isUpdated = await updateProject(projectId, <string>userName, projectEntity);
                if (isUpdated) {
                    const message = `'${projectEntity.displayName}' project is updated after pulling 
                .compage/config.json in Repository for '${projectEntity.repository.name}'`;
                    console.log(message);
                    return response.status(200).json(projectEntity);
                }

                const message = `'${projectEntity.displayName}' project couldn't be updated after pulling 
                .compage/config.json in Repository for '${projectEntity.repository.name}'`;
                console.log(message);
                return response.status(500).json({message: message});
            } else if (axiosResponse.status !== 200) {
                const message = `The .compage/config.json in Repository for '${projectEntity.repository.name}' couldn't be pulled.
                 Received error code while committing .compage/config.json in github repository for '${projectEntity.displayName}': ${axiosResponse.status}`
                console.log(message);
                return response.status(500).json({message: message});
            }
        } catch (e) {
            const error = JSON.parse(JSON.stringify(e));
            const message = `The .compage/config.json in Repository for '${projectEntity.repository.name}' couldn't be pulled. 
            Received error code while committing .compage/config.json in github repository for '${projectEntity.displayName}':${error.status}`
            console.log(message)
            return response.status(500).json({message: message});
        }
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
        try {
            const axiosResponse = await createRepository(projectEntity.user.name, projectEntity.repository.name, projectEntity.repository.name);
            if (axiosResponse.data) {
                // TODO create .compage/config.json file in github repo
                // copy above code here
                const message = `'${createdProjectResource.metadata.name}' project and repository created successfully.`;
                console.log(message);
                return response.status(201).json({message: message});
            } else if (axiosResponse.status !== 200) {
                const message = `Repository for '${createdProjectResource.metadata.name}' couldn't be created.
                 Received error code while creating github repository for '${createdProjectResource.metadata.name}': 
                 ${axiosResponse.status}`;
                console.log(message);
                return response.status(500).json({message: message});
            }
        } catch (e) {
            let message = `Repository for '${createdProjectResource.metadata.name}' couldn't be created.`
            const error = JSON.parse(JSON.stringify(e));
            if (error.status === 422) {
                message = `${message} Please choose different Repository Name.`;
            } else {
                message = `${message} Received error code while creating github repository for '${createdProjectResource.metadata.name}': ${error.status}`;
            }
            console.log(message)
            return response.status(500).json({message: message});
        }
    }
    const message = `'${projectEntity.displayName}' project couldn't be created.`;
    console.log(message);
    return response.status(500).json({message: message});
});

// update project with details given in request
projectsRouter.put("/:id", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const projectId = request.params.id;
    const projectEntity: ProjectEntity = request.body;
    const isUpdated = await updateProject(projectId, <string>userName, projectEntity);
    if (isUpdated) {
        // TODO update github repo and save json to github (project's json to github repo)
        const message = `'${projectEntity.displayName}' project updated successfully.`;
        console.log(message);
        return response.status(200).json({message: message});
    }
    const message = `'${projectEntity.displayName}' project couldn't be updated.`;
    console.log(message);
    return response.status(500).json({message: message});
});

export default projectsRouter;
