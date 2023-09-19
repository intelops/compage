import {getProjectGrpcClient} from '../grpc/project';
import {Router} from 'express';
import * as fs from 'fs';
import * as os from 'os';
import {
    cloneExistingProjectFromGitServer,
    pushToExistingProjectOnGitServer,
} from '../integrations/simple-git/existingProject';
import {requireEmailMiddleware} from '../middlewares/auth';
import Logger from '../utils/logger';
import {rimraf} from 'rimraf';
import tar from 'tar';
import {X_EMAIL_HEADER} from '../utils/constants';
import {GenerateCodeRequest, getGenerateCodeError, getGenerateCodeResponse, Project} from "../models/code";
import {getGitPlatform} from "../store/cassandra/gitPlatformDao";
import {GitPlatformEntity} from "../models/gitPlatform";
import {getProject, updateProject} from "../store/cassandra/projectDao";
import {OldVersion, ProjectEntity} from "../models/project";
import {ExistingProjectGitServerRequest} from "../integrations/simple-git/models";

const codeOperationsRouter = Router();
const projectGrpcClient = getProjectGrpcClient();

// generateCode (grpc calls to core)
codeOperationsRouter.post('/generate', requireEmailMiddleware, async (request, resource) => {
    // TODO the below || op is not required, as the check is already done in middleware.
    const ownerEmail = request.header(X_EMAIL_HEADER) || '';
    const generateCodeRequest: GenerateCodeRequest = request.body;
    const projectId = generateCodeRequest.projectId;
    const nextVersion = (version: string): string => {
        const versionNumber = parseInt(version.substring(1, version.length), 10) + 1;
        return 'v' + versionNumber;
    };

    const previousVersion = (version: string): string => {
        const versionNumber = parseInt(version.substring(1, version.length), 10) - 1;
        return 'v' + versionNumber;
    };

    const cleanup = (downloadedPrjPath: string) => {
        // remove directory created, delete directory recursively
        rimraf(downloadedPrjPath).then((result: any) => {
            Logger.debug(`Result: ${result}`);
            Logger.debug(`${downloadedPrjPath} is cleaned up`);
        });
    };

    // retrieve project from k8s
    const projectEntity: ProjectEntity = await getProject(projectId);
    if (!projectEntity.id) {
        const message = `unable to generate code, no project found for id: ${projectId}`;
        return resource.status(500).json(getGenerateCodeError(message));
    }

    const hasNodes = (projectEntity: ProjectEntity) => {
        return !projectEntity.json
            || projectEntity.json === '{}'
            || projectEntity.json.length === 0
            || !JSON.parse(projectEntity.json)?.nodes
            || JSON.parse(projectEntity.json)?.nodes?.length === 0;
    };

    if (!hasNodes(projectEntity)) {
        const message = `unable to generate code, have at least a node added to your project: ${projectEntity.display_name}[${projectId}].`;
        return resource.status(500).json(getGenerateCodeError(message));
    }

    // check to decide whether to call core or not. This means that user has done no changes in this version since last code generation. Re-generating code for same diagram is not a good idea.
    if (projectEntity.version !== 'v1') {
        const currentVersion = projectEntity.version;
        const lastVersion = previousVersion(currentVersion);
        const oldVersions = projectEntity.old_versions;
        // iterate over all oldVersions to find the last version in it.
        for (const oldVersion of oldVersions as string[]) {
            const oldVersionJson = JSON.parse(oldVersion);
            // check if the lastVersion matches with current version
            if (oldVersionJson.version === lastVersion) {
                // remove unwanted keys and then do the equality check. This is needed to avoid keys used to render ui.
                if (JSON.stringify(removeUnwantedKeys(oldVersionJson.json)) === JSON.stringify(removeUnwantedKeys(projectEntity.json))) {
                    const message = `unable to generate code, No new changes found since last generation: ${projectEntity.display_name}[${projectId}].`;
                    return resource.status(500).json(getGenerateCodeError(message));
                }
            }
        }
    }

    // create directory hierarchy here itself as creating it after receiving data will not be proper.
    const originalProjectPath = `${os.tmpdir()}/${projectEntity.display_name}`;
    const downloadedProjectPath = `${originalProjectPath}_downloaded`;
    try {
        fs.mkdirSync(downloadedProjectPath, {recursive: true});
    } catch (err: any) {
        if (err.code !== 'EEXIST') {
            const message = `unable to generate code for ${projectEntity.display_name}[${projectEntity.id}] => ${err}`;
            return resource.status(500).json(getGenerateCodeError(message));
        } else {
            // first clean up and then recreate (it might be a residue of previous run)
            cleanup(downloadedProjectPath);
            fs.mkdirSync(downloadedProjectPath, {recursive: true});
        }
    }
    const projectTarFilePath = `${downloadedProjectPath}/${projectEntity.id}_downloaded.tar.gz`;

    const gitPlatformEntity: GitPlatformEntity = await getGitPlatform(projectEntity.owner_email as string, projectEntity.git_platform_name as string);

    // save project metadata (in compage db or somewhere)
    // need to save project-name, compage-json version, github repo and latest commit to the db
    const payload: Project = {
        projectName: projectEntity.display_name,
        userName: projectEntity.git_platform_user_name,
        json: projectEntity.json,
        repositoryName: projectEntity.repository_name,
        metadata: projectEntity.metadata as string,
        repositoryIsPublic: projectEntity.is_repository_public,
        repositoryBranch: projectEntity.repository_branch,
        platformName: projectEntity.git_platform_name,
        platformUrl: gitPlatformEntity.url,
        platformUserName: projectEntity.git_platform_user_name,
        platformPersonalAccessToken: gitPlatformEntity.personal_access_token,
        platformEmail: projectEntity.owner_email,
    };

    // call to grpc server to generate the project
    const call = projectGrpcClient.GenerateCode(payload);
    // receive the data(tar file) in chunks.
    call.on('data', async (response: { fileChunk: any }) => {
        // chunk is available, append it to the given path.
        if (response.fileChunk) {
            fs.appendFileSync(projectTarFilePath, response.fileChunk);
            Logger.debug(`writing tar file chunk to: ${projectTarFilePath}`);
        }
    });

    // error while receiving the file from core component
    call.on('error', async (response: any) => {
        cleanup(downloadedProjectPath);
        const message = `unable to generate code for ${projectEntity.display_name}[${projectEntity.id}] => ${response.details}`;
        return resource.status(500).json(getGenerateCodeError(message));
    });

    // file has been transferred, lets save it to github.
    call.on('end', () => {
        // extract tar file
        const extract = tar.extract({
            strip: 1,
            C: downloadedProjectPath
        });
        // stream on extraction on tar file
        const fscrs = fs.createReadStream(projectTarFilePath);
        fscrs.on('error', (err: any) => {
            Logger.error(JSON.stringify(err));
        });
        fscrs.pipe(extract);

        extract.on('finish', async () => {
            // clone existing repository
            const existingProjectGitServerRequest: ExistingProjectGitServerRequest = {
                clonedProjectPath: `${downloadedProjectPath}`,
                gitProviderDetails: {
                    repositoryBranch: projectEntity.repository_branch as string,
                    repositoryName: projectEntity.repository_name as string,
                    repositoryIsPublic: projectEntity.is_repository_public as boolean,
                    platformUserName: projectEntity.git_platform_user_name as string,
                    platformPersonalAccessToken: gitPlatformEntity.personal_access_token as string,
                    platformEmail: projectEntity.owner_email as string,
                    platformUrl: gitPlatformEntity.url,
                    platformName: gitPlatformEntity.name,
                },
                projectVersion: projectEntity.version,
                generatedProjectPath: `${downloadedProjectPath}` + `${originalProjectPath}`,
                existingProject: `${downloadedProjectPath}/projectEntity.repository_name`,
            };

            let error: string = await cloneExistingProjectFromGitServer(existingProjectGitServerRequest);
            if (error.length > 0) {
                cleanup(downloadedProjectPath);
                // send status back to ui
                const message = `unable to generate code for ${projectEntity.display_name}[${projectEntity.id}] => ${error}.`;
                Logger.error(message);
                return resource.status(500).json(getGenerateCodeError(message));
            }

            error = await pushToExistingProjectOnGitServer(existingProjectGitServerRequest);
            if (error.length > 0) {
                cleanup(downloadedProjectPath);
                // send status back to ui
                const message = `unable to generate code for ${projectEntity.display_name}[${projectEntity.id}] => ${error}.`;
                Logger.error(message);
                return resource.status(500).json(getGenerateCodeError(message));
            }

            Logger.debug(`saved ${downloadedProjectPath} to github.`);
            cleanup(downloadedProjectPath);

            // update status in k8s
            const metadata = JSON.parse(projectEntity.metadata as string);
            metadata.isGenerated = true;
            metadata.version = projectEntity.version;
            // add metadata back to projectEntity.spec
            projectEntity.metadata = JSON.stringify(metadata);
            // change version now
            if (projectEntity.old_versions) {
                const oldVersion: OldVersion = {
                    version: projectEntity.version,
                    json: projectEntity.json
                };
                projectEntity.version = nextVersion(projectEntity.version);
                projectEntity.old_versions.push(JSON.stringify(oldVersion));
            }
            const isUpdated = await updateProject(projectId, projectEntity);
            if (isUpdated) {
                // send status back to ui
                const message = `successfully generated project for ${projectEntity.display_name}[${projectEntity.id}] and saved in repository '${projectEntity.repository_name}'.`;
                return resource.status(200).json(getGenerateCodeResponse(ownerEmail, projectId, message));
            }
            // send error status back to ui
            const message = `generated project: ${projectEntity.display_name}[${projectEntity.id}] and saved successfully in repository '${projectEntity.repository_name}' but project couldn't get updated.`;
            return resource.status(500).json(getGenerateCodeError(message));
        });
    });
});

// updateProject (grpc calls to core)
codeOperationsRouter.post('/regenerate', requireEmailMiddleware, async (req, res) => {
    const {repositoryName, json, projectName, userName} = req.body;
    try {
        const payload = {
            'projectName': projectName,
            'userName': userName,
            'json': json,
            'repositoryName': repositoryName
        };
        projectGrpcClient.RegenerateCode(payload, (err: any, response: { fileChunk: any; }) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({fileChunk: response.fileChunk.toString()});
        });
    } catch (err: any) {
        return res.status(500).json(err);
    }
});

const removeUnwantedKeys = (state: string) => {
    if (state === undefined || state === null || (!state || state === '{}')) {
        // happens at the beginning with value '{}'
        return state;
    }
    const isObject = (obj: any) => {
        return obj.constructor === Object;
    };
    Logger.debug(state);
    let stateJson;
    if (!isObject(state)) {
        stateJson = JSON.parse(state);
    } else {
        stateJson = state;
    }
    // delete unwanted stuff from state.
    delete stateJson.panels;
    delete stateJson.plugins;
    delete stateJson?.potentialEdge;
    delete stateJson.potentialNode;
    delete stateJson.editor;
    delete stateJson?.undoHistory;
    delete stateJson.workspace;
    // nodes
    // tslint:disable-next-line: forin
    for (const key in stateJson.nodes) {
        delete stateJson.nodes[key]?.diagramMakerData;
    }
    // edges
    // tslint:disable-next-line: forin
    for (const key in stateJson.edges) {
        delete stateJson.edges[key]?.diagramMakerData;
    }
    return stateJson;
};

export default codeOperationsRouter;
