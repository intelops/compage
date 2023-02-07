import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {X_USER_NAME_HEADER} from "../util/constants";
import multer from "../middlewares/multer";
import * as fs from "fs";
import {ProjectEntity} from "./models";
import {getProject, updateProject} from "../util/project-store";
import {updateToGithub} from "./projects";

const openApiYamlRouter = Router();

// uploads openApiYaml file
openApiYamlRouter.post("/upload", requireUserNameMiddleware, multer.single('file'), async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const {nodeId, projectId} = request.body;
    const projectEntity: ProjectEntity = await getProject(<string>userName, projectId);
    if (projectEntity.id.length === 0) {
        return response.status(404).json();
    }
    if (request.file) {
        const readFileSync = fs.readFileSync(request.file.path, 'utf8');
        // delete file once content is extracted
        fs.rmSync(request.file.path);
        console.log("json : ", projectEntity.json?.nodes)
        const compageNode = projectEntity.json?.nodes.get(nodeId);
        if (compageNode) {
            // compageNode.consumerData.openApiYaml = readFileSync;
        }
        const updatedProjectEntity = await updateProject(projectId, <string>userName, projectEntity);
        if (updatedProjectEntity.id.length !== 0) {
            // update github with .compage/config.json
            return await updateToGithub(updatedProjectEntity, response);
        }
    }
    const message = `File couldn't be uploaded.`;
    console.log(message);
    return response.status(500).json(message);
});

export default openApiYamlRouter;
