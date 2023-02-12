import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {X_USER_NAME_HEADER} from "../util/constants";
import multer from "../middlewares/multer";
import * as fs from "fs";
import {CompageNode, ProjectEntity, UploadYamlError, UploadYamlRequest, UploadYamlResponse} from "./models";
import {getProject} from "../util/project-store";

const openApiYamlRouter = Router();

const getNode = (nodes: Map<string, CompageNode> | undefined, nodeId: string) => {
    if (nodes && nodes.size > 0) {
        const map = new Map(Object.entries(nodes));
        const compageNode = map.get(nodeId);
        if (compageNode) {
            return compageNode;
        }
    }
    return undefined;
};

// uploads openApiYaml file
openApiYamlRouter.post("/upload", requireUserNameMiddleware, multer.single('file'), async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const uploadYamlRequest: UploadYamlRequest = request.body;
    let projectEntity: ProjectEntity = await getProject(<string>userName, uploadYamlRequest.projectId);
    // projectEntity is not present on server side (which is hardly true, unless someone has deleted the project from backend while the user is logged in.)
    if (projectEntity.id.length === 0) {
        return response.status(404).json();
    }
    if (request.file) {
        try {
            const content = fs.readFileSync(request.file.path, 'utf8');
            // delete file once content is extracted
            fs.rmSync(request.file.path);
            const message = `File got uploaded.`;
            console.log(message);
            return response.status(200).json(getUploadYamlResponse(uploadYamlRequest.projectId, uploadYamlRequest.nodeId, content, message));
        } catch (e) {
            const message = `File couldn't be uploaded due to : ${e}`;
            console.log(message);
            return response.status(500).json(getUploadYamlError(message));
        }
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

const getUploadYamlResponse = (projectId: string, nodeId: string, content: string, message: string
) => {
    const uploadYamlResponse: UploadYamlResponse = {
        projectId: projectId,
        nodeId: nodeId,
        content: content,
        message: message,
    }
    return uploadYamlResponse;
}

export default openApiYamlRouter;
