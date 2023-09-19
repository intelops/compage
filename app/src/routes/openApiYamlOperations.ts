import {requireEmailMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import multer from '../middlewares/multer';
import * as fs from 'fs';
import Logger from '../utils/logger';
import {X_EMAIL_HEADER} from '../utils/constants';
import {getUploadYamlError, getUploadYamlResponse, UploadYamlRequest} from '../models/openApiYaml';
import {ProjectEntity} from '../models/project';
import {getProject} from '../store/cassandra/projectDao';

const openApiYamlOperationsRouter = Router();

// uploads openApiYaml file
openApiYamlOperationsRouter.post('/upload', requireEmailMiddleware, async (request: Request, response: Response) => {
    const ownerEmail = request.header(X_EMAIL_HEADER);
    const uploadYamlRequest: UploadYamlRequest = request.body;
    const projectEntity: ProjectEntity = await getProject(uploadYamlRequest.projectId);
    // projectEntity is not present on server side (which is hardly true, unless someone has deleted the project from backend while the user is logged in.)
    if (projectEntity.id.length === 0) {
        return response.status(404).json();
    }
    if (request.file) {
        try {
            const content = fs.readFileSync(request.file.path, 'utf8');
            // delete file once content is extracted
            fs.rmSync(request.file.path);
            const successMessage = `File got uploaded.`;
            Logger.info(successMessage);
            // TODO the upload happens so quickly that artificial delay is required and it will help for better experience.
            await new Promise(r => setTimeout(r, 1000));
            return response.status(200).json(getUploadYamlResponse(uploadYamlRequest.projectId, uploadYamlRequest.nodeId, content, successMessage));
        } catch (e: any) {
            const errorMessage = `File couldn't be uploaded[${e.message}].`;
            Logger.error(errorMessage);
            return response.status(500).json(getUploadYamlError(errorMessage));
        }
    }
    const message = `File couldn't be uploaded.`;
    Logger.warn(message);
    return response.status(500).json(getUploadYamlError(message));
}, multer.single('file'));

export default openApiYamlOperationsRouter;
