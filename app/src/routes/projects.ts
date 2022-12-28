import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {createProject, deleteProject, getProject, listProjects, updateProject} from "../util/project-store";
import {X_USER_NAME_HEADER} from "../util/constants";
import {ProjectEntity} from "./models";
import {commitCompageJson, createRepository, pullCompageJson} from "../store/github-client";

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
        return await updateFromGithub(projectEntity, response);
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
        // create repository on github and .compage/config.json file/
        return await createOnGithub(projectEntity, response)
    }
    const message = `'${projectEntity.id}' project couldn't be created.`;
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
        // update github with .compage/config.json
        return await updateToGithub(projectEntity, response);
    }
    const message = `'${projectEntity.id}' project couldn't be updated.`;
    console.log(message);
    return response.status(500).json({message: message});
});

// commits first time changes in .compage/config.json in github repository.
const addToGithub = (projectEntity: ProjectEntity, response: Response) => {
    const sha = "";
    // base64 the json as it's required for github api.
    const buffer = new Buffer(JSON.stringify(projectEntity.json));
    const base64Json = buffer.toString('base64');
    return commitCompageJson(
        projectEntity.user.name,
        projectEntity.user.email,
        projectEntity.repository.name,
        base64Json,
        "first commit",
        sha).then(resp => {
        console.log("commitCompageJson Response: ", resp.data);
        const message = `The .compage/config.json in Repository for '${projectEntity.repository.name}' is committed, '${projectEntity.id}' project is created successfully`;
        console.log(message);
        return response.status(200).json(message);
    }).catch(error => {
        const errorObject = JSON.parse(JSON.stringify(error));
        const message = `The .compage/config.json in Repository for '${projectEntity.repository.name}' couldn't be committed. Received error code while committing .compage/config.json in github repository for '${projectEntity.id}': ${errorObject.status}`
        console.log(message)
        return response.status(500).json({message: message});
    });
}

// commits new changes to .compage/config.json in github repository.
const updateToGithub = (projectEntity: ProjectEntity, response: Response) => {
    // update github repo and save json to github (project's json to github repo)
    return pullCompageJson(projectEntity.user.name, projectEntity.repository.name)
        .then(resp => {
            console.log("pullCompageJson Response: ", resp);
            const sha = JSON.parse(resp.data).sha
            // base64 the json as it's required for github api.
            const buffer = new Buffer(JSON.stringify(projectEntity.json));
            const base64Json = buffer.toString('base64');
            return commitCompageJson(
                projectEntity.user.name,
                projectEntity.user.email,
                projectEntity.repository.name,
                base64Json,
                "updated project from ui",
                sha).then(resp => {
                console.log("commitCompageJson Response: ", resp.data);
                const message = `An update to .compage/config.json in Repository for '${projectEntity.repository.name}' is committed, '${projectEntity.id}' project is created/updated successfully`;
                console.log(message);
                return response.status(200).json(message);
            }).catch(error => {
                const errorObject = JSON.parse(JSON.stringify(error));
                const message = `An update to .compage/config.json in Repository for '${projectEntity.repository.name}' couldn't be committed. Received error code while committing .compage/config.json in github repository for '${projectEntity.id}': ${errorObject.status}`
                console.log(message)
                return response.status(500).json({message: message});
            });
        })
        .catch(error => {
            const errorObject = JSON.parse(JSON.stringify(error));
            const message = `The .compage/config.json in Repository for '${projectEntity.repository.name}' couldn't be pulled.. Received error code while pulling .compage/config.json in github repository for '${projectEntity.id}': ${errorObject.status}`
            console.log(message)
            return response.status(500).json({message: message});
        });
}
// pulls .compage/config.json from github repository and update it in k8s project.
const updateFromGithub = (projectEntity: ProjectEntity, response: Response) => {
    return pullCompageJson(projectEntity.user.name, projectEntity.repository.name)
        .then(resp => {
            console.log("pullCompageJson Response: ", JSON.stringify(resp.data));
            projectEntity.json = JSON.parse(JSON.stringify(resp.data));
            // updating project in k8s with latest json from github.
            return updateProject(projectEntity.id, <string>projectEntity.user.name, projectEntity)
                .then(isUpdated => {
                    if (isUpdated) {
                        const message = `'${projectEntity.id}' project is updated after pulling 
                .compage/config.json in Repository for '${projectEntity.repository.name}'`;
                        console.log(message);
                        return response.status(200).json(projectEntity);
                    }
                    const message = `'${projectEntity.id}' project couldn't be updated after pulling 
                .compage/config.json in Repository for '${projectEntity.repository.name}'`;
                    console.log(message);
                    return response.status(500).json({message: message});
                });
        }).catch(error => {
            const errorObject = JSON.parse(JSON.stringify(error));
            const message = `The .compage/config.json in Repository for '${projectEntity.repository.name}' couldn't be pulled.
                 Received error code while pulling .compage/config.json in github repository for '${projectEntity.id}': ${errorObject.status}`
            console.log(message);
            return response.status(500).json({message: message});
        });
}

// creates repository on github and commits first version of yaml
const createOnGithub = (projectEntity: ProjectEntity, response: Response) => {
    return createRepository(projectEntity.user.name, projectEntity.repository.name, projectEntity.repository.name)
        .then(resp => {
            console.log("createRepository Response: ", JSON.stringify(resp.data))
            // create .compage/config.json file in github repo
            return addToGithub(projectEntity, response);
        }).catch(error => {
            const errorObject = JSON.parse(JSON.stringify(error));
            let message = `Repository for '${projectEntity.id}' couldn't be created.`
            if (errorObject.status === 422) {
                message = `${message} Please choose different Repository Name.`;
            } else {
                message = `${message} Received error code while creating github repository for '${projectEntity.id}': ${errorObject.status}`;
            }
            console.log(message)
            return response.status(500).json({message: message});
        });
}

export default projectsRouter;
