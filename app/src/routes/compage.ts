import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";
import * as fs from "fs";
import * as os from "os";
import {pushToExistingProjectOnGithub, PushToExistingProjectOnGithubRequest} from "../util/simple-git/existing-project";
import {getToken} from "../util/user-store";
import {cloneExistingProjectFromGithub, CloneExistingProjectFromGithubRequest} from "../util/simple-git/clone";
import {GenerateProjectRequest, GenerateProjectResponse, Project} from "./models";
import {requireUserNameMiddleware} from "../middlewares/auth";

const rimraf = require("rimraf");
const tar = require('tar')
const compageRouter = Router();
const projectGrpcClient = getProjectGrpcClient();

const getGenerateProjectResponse = (generateProjectRequest: GenerateProjectRequest, message: string, error: string) => {
    let generateProjectResponse: GenerateProjectResponse = {
        repositoryName: generateProjectRequest.repository.name,
        userName: generateProjectRequest.user.name,
        projectName: generateProjectRequest.project.name,
        message: message,
        error: error
    }
    return generateProjectResponse;
}

// generateProject (grpc calls to core)
compageRouter.post("/create_project", requireUserNameMiddleware, async (req, res) => {
    const generateProjectRequest: GenerateProjectRequest = req.body;
    const cleanup = (downloadedProjectPath: string) => {
        // remove directory created, delete directory recursively
        rimraf(downloadedProjectPath, () => {
            console.debug(`${downloadedProjectPath} is cleaned up`);
        });
    }

    // create directory hierarchy here itself as creating it after receiving data will not be proper.
    const originalProjectPath = `${os.tmpdir()}/${generateProjectRequest.project.name}`
    const downloadedProjectPath = `${originalProjectPath}_downloaded`
    try {
        fs.mkdirSync(downloadedProjectPath, {recursive: true});
    } catch (err: any) {
        if (err.code !== 'EEXIST') {
            let message = `unable to generate project : ${generateProjectRequest.project.name}`
            let error = `unable to generate project : ${generateProjectRequest.project.name} directory with error : ${err}`
            return res.status(500).json(getGenerateProjectResponse(generateProjectRequest, message, error));
        } else {
            // first clean up and then recreate (it might be a residue of previous run)
            cleanup(downloadedProjectPath)
            fs.mkdirSync(downloadedProjectPath, {recursive: true});
        }
    }
    const projectTarFilePath = `${downloadedProjectPath}/${generateProjectRequest.project.name}_downloaded.tar.gz`;

    // save project metadata (in compage db or somewhere)
    // need to save project-name, compage-yaml version, github repo and latest commit to the db
    const payload: Project = {
        projectName: generateProjectRequest.project.name,
        userName: generateProjectRequest.user.name,
        yaml: JSON.stringify(generateProjectRequest.yaml),
        repositoryName: generateProjectRequest.repository.name,
        metadata: JSON.stringify(generateProjectRequest.metadata)
    }

    // call to grpc server to generate the project
    let call = projectGrpcClient.GenerateProject(payload);
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
        let message = `unable to generate project : ${generateProjectRequest.project.name}`
        let error = response.details
        return res.status(500).json(getGenerateProjectResponse(generateProjectRequest, message, error));
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
            let password = <string>await getToken(<string>generateProjectRequest.user.name);
            // clone existing repository
            const cloneExistingProjectFromGithubRequest: CloneExistingProjectFromGithubRequest = {
                clonedProjectPath: `${downloadedProjectPath}`,
                userName: <string>generateProjectRequest.user.name,
                password: password,
                repository: generateProjectRequest.repository
            }

            let error: string = await cloneExistingProjectFromGithub(cloneExistingProjectFromGithubRequest)
            if (error.length > 0) {
                // send status back to ui
                let message = `couldn't generate project: ${generateProjectRequest.project.name} due to : ${error}.`
                // error = ""
                return res.status(500).json(getGenerateProjectResponse(generateProjectRequest, message, error));
            }

            // save to GitHub
            const pushToExistingProjectOnGithubRequest: PushToExistingProjectOnGithubRequest = {
                generatedProjectPath: `${downloadedProjectPath}` + `${originalProjectPath}`,
                existingProject: cloneExistingProjectFromGithubRequest.clonedProjectPath + "/" + generateProjectRequest.repository.name,
                userName: generateProjectRequest.user.name,
                email: generateProjectRequest.user.email,
                password: password,
                repository: generateProjectRequest.repository
            }

            error = await pushToExistingProjectOnGithub(pushToExistingProjectOnGithubRequest)
            if (error.length > 0) {
                // send status back to ui
                let message = `couldn't generate project: ${generateProjectRequest.project.name} due to : ${error}.`
                return res.status(500).json(getGenerateProjectResponse(generateProjectRequest, message, error));
            }

            console.log(`saved ${downloadedProjectPath} to github`)
            cleanup(downloadedProjectPath);

            // send status back to ui
            let message = `generated project: ${generateProjectRequest.project.name} and saved in repository : ${generateProjectRequest.repository.name} successfully`
            return res.status(200).json(getGenerateProjectResponse(generateProjectRequest, message, error));
        });
    });
});

// updateProject (grpc calls to core)
compageRouter.post("/update_project", requireUserNameMiddleware, async (req, res) => {
    const {repositoryName, yaml, projectName, userName} = req.body;
    try {
        const payload = {
            "projectName": projectName,
            "userName": userName,
            "yaml": yaml,
            "repositoryName": repositoryName
        }
        projectGrpcClient.UpdateProject(payload, (err: any, response: { fileChunk: any; }) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({fileChunk: response.fileChunk.toString()});
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default compageRouter;
