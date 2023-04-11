import {requireUserNameMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {X_USER_NAME_HEADER} from '../util/constants';
import multer from '../middlewares/multer';
import * as fs from 'fs';
import {ProjectEntity, UploadYamlError, UploadYamlRequest, UploadYamlResponse} from './models';
import {getProject} from '../util/project-client';
import Logger from '../util/logger';

const openApiYamlOperationsRouter = Router();

// uploads openApiYaml file
openApiYamlOperationsRouter.post('/upload', requireUserNameMiddleware, multer.single('file'), async (request: Request, response: Response) => {
    const userName = request.header(X_USER_NAME_HEADER);
    const uploadYamlRequest: UploadYamlRequest = request.body;
    const projectEntity: ProjectEntity = await getProject(userName as string, uploadYamlRequest.projectId);
    // projectEntity is not present on server side (which is hardly true, unless someone has deleted the project from backend while the user is logged in.)
    if (projectEntity.id.length === 0) {
        return response.status(404).json();
    }
    if (request.file) {
        try {
            const content = fs.readFileSync(request.file.path, 'utf8');
            // delete file once content is extracted
            fs.rmSync(request.file.path);
            const msg = `File got uploaded.`;
            Logger.info(msg);
            // TODO the upload happens so quickly that artificial delay is required and it will help for better experience.
            await new Promise(r => setTimeout(r, 1000));
            return response.status(200).json(getUploadYamlResponse(uploadYamlRequest.projectId, uploadYamlRequest.nodeId, content, msg));
        } catch (error) {
            const msg = `File couldn't be uploaded due to : ${error}`;
            Logger.error(msg);
            return response.status(500).json(getUploadYamlError(msg));
        }
    }
    const message = `File couldn't be uploaded.`;
    Logger.warn(message);
    return response.status(500).json(getUploadYamlError(message));
});

const getUploadYamlError = (message: string) => {
    const uploadYamlError: UploadYamlError = {
        message,
    };
    return uploadYamlError;
};

const getUploadYamlResponse = (projectId: string, nodeId: string, content: string, message: string
) => {
    const uploadYamlResponse: UploadYamlResponse = {
        projectId,
        nodeId,
        content,
        message,
    };
    return uploadYamlResponse;
};

export default openApiYamlOperationsRouter;
