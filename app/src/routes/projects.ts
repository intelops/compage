import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {createProject, getProjects} from "../util/project-store";
import {CreateProjectRequest} from "./models";
import {X_USER_NAME_HEADER} from "../util/constants";

const projectsRouter = Router();

// list all projects for given user
projectsRouter.get("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    return response.status(200).json(await getProjects(<string>userName));
});

// create project with details given in request
projectsRouter.post("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const createProjectRequest: CreateProjectRequest = request.body;
    await createProject(<string>userName, createProjectRequest)
    return response.status(201).json("project created successfully");
});

export default projectsRouter;
