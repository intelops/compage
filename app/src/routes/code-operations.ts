import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";
import * as fs from "fs";
import * as os from "os";
import {pushToExistingProjectOnGithub, PushToExistingProjectOnGithubRequest} from "../util/simple-git/existing-project";
import {getToken} from "../util/user-store";
import {cloneExistingProjectFromGithub, CloneExistingProjectFromGithubRequest} from "../util/simple-git/clone";
import {GenerateCodeError, GenerateCodeRequest, GenerateCodeResponse, Project} from "./models";
import {requireUserNameMiddleware} from "../middlewares/auth";
import {getProjectResource, patchProjectResource} from "../store/project-client";
import {NAMESPACE, X_USER_NAME_HEADER} from "../util/constants";
import {OldVersion} from "../store/models";

const rimraf = require("rimraf");
const tar = require('tar')
const codeOperationsRouter = Router();
const projectGrpcClient = getProjectGrpcClient();

// generateCode (grpc calls to core)
codeOperationsRouter.post("/generate_code", requireUserNameMiddleware, async (request, resource) => {
    // TODO the below || op is not required, as the check is already done in middleware.
    const userName = request.header(X_USER_NAME_HEADER) || "";
    const generateCodeRequest: GenerateCodeRequest = request.body;
    const projectId = generateCodeRequest.projectId
    const cleanup = (downloadedProjectPath: string) => {
        // remove directory created, delete directory recursively
        rimraf(downloadedProjectPath, () => {
            console.debug(`${downloadedProjectPath} is cleaned up`);
        });
    }

    // retrieve project from k8s
    const projectResource = await getProjectResource(NAMESPACE, projectId);
    if (!projectResource.apiVersion) {
        const message = `unable to generate code, no project found for id: ${projectId}`
        return resource.status(500).json(getGenerateCodeError(message));
    }

    if (!projectResource.spec.json
        || projectResource.spec.json === "{}"
        || projectResource.spec.json.length === 0
        || !JSON.parse(projectResource.spec.json).nodes
        || JSON.parse(projectResource.spec.json).nodes?.length === 0) {
        const message = `unable to generate code, have at least a node added to your project: ${projectResource.spec.displayName}[${projectId}].`
        return resource.status(500).json(getGenerateCodeError(message));
    }
    // create directory hierarchy here itself as creating it after receiving data will not be proper.
    const originalProjectPath = `${os.tmpdir()}/${projectResource.spec.displayName}`;
    const downloadedProjectPath = `${originalProjectPath}_downloaded`;
    try {
        fs.mkdirSync(downloadedProjectPath, {recursive: true});
    } catch (err: any) {
        if (err.code !== 'EEXIST') {
            const message = `unable to generate code for ${projectResource.spec.displayName}[${projectResource.metadata.name}] => ${err}`
            return resource.status(500).json(getGenerateCodeError(message));
        } else {
            // first clean up and then recreate (it might be a residue of previous run)
            cleanup(downloadedProjectPath);
            fs.mkdirSync(downloadedProjectPath, {recursive: true});
        }
    }
    const projectTarFilePath = `${downloadedProjectPath}/${projectResource.metadata.name}_downloaded.tar.gz`;

    // save project metadata (in compage db or somewhere)
    // need to save project-name, compage-json version, github repo and latest commit to the db
    const payload: Project = {
        projectName: projectResource.spec.displayName,
        userName: projectResource.spec.user.name,
        json: projectResource.spec.json,
        repositoryName: projectResource.spec.repository.name,
        metadata: projectResource.spec.metadata
    }

    // call to grpc server to generate the project
    let call = projectGrpcClient.GenerateCode(payload);
    // receive the data(tar file) in chunks.
    call.on('data', async (response: { fileChunk: any }) => {
        // chunk is available, append it to the given path.
        if (response.fileChunk) {
            fs.appendFileSync(projectTarFilePath, response.fileChunk);
            console.debug(`writing tar file chunk to: ${projectTarFilePath}`);
        }
    });

    // error while receiving the file from core component
    call.on('error', async (response: any) => {
        cleanup(downloadedProjectPath);
        const message = `unable to generate code for ${projectResource.spec.displayName}[${projectResource.metadata.name}] => ${response.details}`
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
        let fscrs = fs.createReadStream(projectTarFilePath)
        fscrs.on('error', function (err: any) {
            console.log(JSON.stringify(err))
        });
        fscrs.pipe(extract)

        extract.on('finish', async () => {
            let password = <string>await getToken(<string>projectResource.spec.user?.name);
            // clone existing repository
            const cloneExistingProjectFromGithubRequest: CloneExistingProjectFromGithubRequest = {
                clonedProjectPath: `${downloadedProjectPath}`,
                userName: <string>projectResource.spec.user.name,
                password: password,
                repository: projectResource.spec.repository
            }

            let error: string = await cloneExistingProjectFromGithub(cloneExistingProjectFromGithubRequest)
            if (error.length > 0) {
                cleanup(downloadedProjectPath);
                // send status back to ui
                const message = `unable to generate code for ${projectResource.spec.displayName}[${projectResource.metadata.name}] => ${error}.`
                return resource.status(500).json(getGenerateCodeError(message));
            }

            // save to GitHub
            const pushToExistingProjectOnGithubRequest: PushToExistingProjectOnGithubRequest = {
                projectVersion: projectResource.spec.version,
                generatedProjectPath: `${downloadedProjectPath}` + `${originalProjectPath}`,
                existingProject: cloneExistingProjectFromGithubRequest.clonedProjectPath + "/" + projectResource.spec.repository?.name,
                userName: projectResource.spec.user.name,
                email: projectResource.spec.user.email,
                password: password,
                repository: projectResource.spec.repository
            }

            error = await pushToExistingProjectOnGithub(pushToExistingProjectOnGithubRequest)
            if (error.length > 0) {
                cleanup(downloadedProjectPath);
                // send status back to ui
                const message = `unable to generate code for ${projectResource.spec.displayName}[${projectResource.metadata.name}] => ${error}.`
                return resource.status(500).json(getGenerateCodeError(message));
            }

            console.log(`saved ${downloadedProjectPath} to github.`)
            cleanup(downloadedProjectPath);

            // update status in k8s
            const metadata = JSON.parse(projectResource.spec.metadata);
            metadata.isGenerated = true;
            metadata.version = projectResource.spec.version;
            // add metadata back to projectResource.spec
            projectResource.spec.metadata = JSON.stringify(metadata)
            const nextVersion = (version: string): string => {
                const number = parseInt(version.substring(1, version.length)) + 1;
                return "v" + number;
            };
            // change version now
            if (projectResource.spec.oldVersions) {
                const oldVersion: OldVersion = {
                    version: projectResource.spec.version,
                    json: projectResource.spec.json
                };
                projectResource.spec.version = nextVersion(projectResource.spec.version);
                projectResource.spec.oldVersions.push(oldVersion);
            }
            const patchedProjectResource = await patchProjectResource(NAMESPACE, projectId, JSON.stringify(projectResource.spec))
            if (patchedProjectResource.apiVersion) {
                // send status back to ui
                const message = `successfully generated project for ${projectResource.spec.displayName}[${projectResource.metadata.name}] and saved in repository '${projectResource.spec.repository?.name}'.`
                return resource.status(200).json(getGenerateCodeResponse(userName, projectId, message));
            }
            // send error status back to ui
            const message = `generated project: ${projectResource.spec.displayName}[${projectResource.metadata.name}] and saved successfully in repository '${projectResource.spec.repository?.name}' but project couldn't get updated.`
            return resource.status(500).json(getGenerateCodeError(message));
        });
    });
});

// updateProject (grpc calls to core)
codeOperationsRouter.post("/re_generate_code", requireUserNameMiddleware, async (req, res) => {
    const {repositoryName, json, projectName, userName} = req.body;
    try {
        const payload = {
            "projectName": projectName,
            "userName": userName,
            "json": json,
            "repositoryName": repositoryName
        }
        projectGrpcClient.RegenerateCode(payload, (err: any, response: { fileChunk: any; }) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({fileChunk: response.fileChunk.toString()});
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

const getGenerateCodeResponse = (userName: string, projectId: string, message: string) => {
    const generateCodeResponse: GenerateCodeResponse = {
        userName: userName,
        projectId: projectId,
        message: message,
    }
    return generateCodeResponse;
}

const getGenerateCodeError = (message: string) => {
    const generateCodeError: GenerateCodeError = {
        message: message,
    }
    return generateCodeError;
}

export default codeOperationsRouter;
