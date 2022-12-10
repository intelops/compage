import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {addProject, getProjects} from "../util/project-store";
import {CreateProjectRequest} from "./models";

const projectsRouter = Router();

// list all projects for given user
projectsRouter.get("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const requestHeader = "X-User-Name";
    const userName = request.header(requestHeader);
    return response.status(200).json(await getProjects(<string>userName));
});

// create project with details given in request
projectsRouter.post("/", requireUserNameMiddleware, async (request: Request, response: Response) => {
    const requestHeader = "X-User-Name";
    const userName = request.header(requestHeader);
    const createProjectRequest: CreateProjectRequest = request.body;
    await addProject(<string>userName, createProjectRequest)
    return response.status(201).json("project created successfully");
});

export default projectsRouter;
