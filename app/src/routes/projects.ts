import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {createProject, listProjects} from "../util/project-store";
import {X_USER_NAME_HEADER} from "../util/constants";
import {ProjectEntity} from "./models";

const projectsRouter = Router();

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
        console.log(`'${createdProjectResource.metadata.name}' project created successfully`)
        return response.status(201).json({message: `'${createdProjectResource.metadata.name}' project created successfully`});
    }
    console.log(`'${projectEntity.name}' project couldn't be created`)
    return response.status(201).json({message: `'${projectEntity.name}' project couldn't be created`});
});

export default projectsRouter;
