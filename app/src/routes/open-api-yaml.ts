import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {X_USER_NAME_HEADER} from "../util/constants";
import multer from "../middlewares/multer";
import * as fs from "fs";
import {ProjectEntity, UploadYamlError, UploadYamlRequest, UploadYamlResponse} from "./models";
import {getProject} from "../util/project-store";

const openApiYamlRouter = Router();

// uploads openApiYaml file
openApiYamlRouter.post("/upload", requireUserNameMiddleware, multer.single('file'), async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const uploadYamlRequest: UploadYamlRequest = request.body;
    const projectEntity: ProjectEntity = await getProject(<string>userName, uploadYamlRequest.projectId);
    if (projectEntity.id.length === 0) {
        return response.status(404).json();
    }
    if (request.file) {
        const readFileSync = fs.readFileSync(request.file.path, 'utf8');
        // delete file once content is extracted
        fs.rmSync(request.file.path);
        console.log("json : ", projectEntity.json?.nodes);
        console.log("readFileSync : ", readFileSync);
        // const compageNode = projectEntity.json?.nodes.get(uploadYamlRequest.nodeId);
        // if (compageNode) {
        //     for (let i = 0; i < compageNode.consumerData.serverTypes.length; i++) {
        //         if (compageNode.consumerData.serverTypes[i].protocol === "REST") {
        //             compageNode.consumerData.serverTypes[i].openApiFileYamlContent = readFileSync;
        //             break;
        //         }
        //     }
        // }
        // const updatedProjectEntity = await updateProject(uploadYamlRequest.projectId, <string>userName, projectEntity);
        // if (updatedProjectEntity.id.length !== 0) {
        //     // update github with .compage/config.json
        //     await updateToGithub(updatedProjectEntity, response);
        //     return getUploadYamlResponse(updatedProjectEntity, "File got uploaded.")
        // }
    }
    const message = `File couldn't be uploaded.`;
    console.log(message);
    return response.status(500).json(getUploadYamlError(message));
});

const getUploadYamlError = (message: string) => {
    const uploadYamlError: UploadYamlError = {
        message: message,
    }
    return uploadYamlError;
}

const getUploadYamlResponse = (projectEntity: ProjectEntity, message: string) => {
    const uploadYamlResponse: UploadYamlResponse = {
        project: projectEntity,
        message: message,
    }
    return uploadYamlResponse;
}

export default openApiYamlRouter;
