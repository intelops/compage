import {requireUserNameMiddleware} from "../middlewares/auth";
import {Request, Response, Router} from "express";
import {X_USER_NAME_HEADER} from "../util/constants";
import multer from "../middlewares/multer";
import * as fs from "fs";
import {CompageNode, ProjectEntity, UploadYamlError, UploadYamlRequest, UploadYamlResponse} from "./models";
import {getProject, updateProject} from "../util/project-store";
import {updateToGithub} from "./projects";

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
    let compageNode;
    let projectEntity: ProjectEntity = await getProject(<string>userName, uploadYamlRequest.projectId);
    // projectEntity is not present on server side (which is hardly true, unless someone has deleted the project from backend while the user is logged in.)
    if (projectEntity.id.length === 0) {
        return response.status(404).json();
    } else {
        compageNode = getNode(projectEntity.json?.nodes, uploadYamlRequest.nodeId);
        if (!compageNode) {
            // no nodes in the projectEntity on server.
            if (uploadYamlRequest.projectEntity || uploadYamlRequest.projectEntity.length !== 0) {
                const requestProjectEntity = JSON.parse(uploadYamlRequest.projectEntity)
                compageNode = getNode(requestProjectEntity.json?.nodes, uploadYamlRequest.nodeId);
                if (!compageNode) {
                    const message = `File couldn't be uploaded, nodeId is not found.`;
                    console.log(message);
                    return response.status(404).json(getUploadYamlError(message));
                }
            } else {
                // no request ProjectEntity present.
                const message = `File couldn't be uploaded, required projectEntity is not supplied.`;
                console.log(message);
                return response.status(404).json(getUploadYamlError(message));
            }
        }
    }
    if (request.file) {
        const readFileSync = fs.readFileSync(request.file.path, 'utf8');
        // delete file once content is extracted
        fs.rmSync(request.file.path);
        if (compageNode) {
            for (let i = 0; i < compageNode.consumerData.serverTypes.length; i++) {
                if (compageNode.consumerData.serverTypes[i].protocol === "REST") {
                    const requestProjectEntity = JSON.parse(uploadYamlRequest.projectEntity)
                    const requestCompageNode = getNode(requestProjectEntity.json?.nodes, uploadYamlRequest.nodeId);
                    compageNode.consumerData.serverTypes[i].openApiFileYamlContent = readFileSync;
                    compageNode.consumerData.serverTypes[i].resources = [];
                    compageNode.consumerData.template = requestCompageNode.consumerData.template;
                    compageNode.consumerData.framework = requestCompageNode.consumerData.framework;
                    break;
                }
            }
        } else {
            const message = `File couldn't be uploaded, nodeId not found.`;
            console.log(message);
            return response.status(404).json(getUploadYamlError(message));
        }
        const updatedProjectEntity = await updateProject(uploadYamlRequest.projectId, <string>userName, projectEntity);
        if (updatedProjectEntity.id.length !== 0) {
            // update github with .compage/config.json
            return await updateToGithub(updatedProjectEntity, response);
            // todo below line doesnt get executed as the response was sent in last line only.
            // return getUploadYamlResponse(updatedProjectEntity, "File got uploaded.")
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

const getUploadYamlResponse = (projectEntity: ProjectEntity, message: string) => {
    const uploadYamlResponse: UploadYamlResponse = {
        project: projectEntity,
        message: message,
    }
    return uploadYamlResponse;
}

export default openApiYamlRouter;
