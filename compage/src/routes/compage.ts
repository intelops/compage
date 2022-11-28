import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";
import * as fs from "fs";
import * as os from "os";
import {pushToExistingProjectOnGithub, PushToExistingProjectOnGithubRequest} from "../util/simple-git/existing-project";
import {getUser} from "./store";
import {cloneExistingProjectFromGithub, CloneExistingProjectFromGithubRequest} from "../util/simple-git/clone";

const rimraf = require("rimraf");
const tar = require('tar')
const compageRouter = Router();
const projectGrpcClient = getProjectGrpcClient();

// createProject (grpc calls to compage-core)
compageRouter.post("/create_project", async (req, res) => {
    const {repositoryName, yaml, projectName, userName, email} = req.body;
    const cleanup = (downloadedProjectPath: string) => {
        // remove directory created, delete directory recursively
        rimraf(downloadedProjectPath, () => {
            console.debug(`${downloadedProjectPath} is cleaned up`);
        });
    }

    try {
        const payload = {
            "projectName": projectName,
            "userName": userName,
            "yaml": yaml,
            "repositoryName": repositoryName
        }
        const originalProjectPath = `${os.tmpdir()}/${projectName}`
        const downloadedProjectPath = `${originalProjectPath}_downloaded`
        try {
            fs.mkdirSync(downloadedProjectPath, {recursive: true});
        } catch (err: any) {
            if (err.code !== 'EEXIST') {
                return res.status(500).json({
                    repositoryName: repositoryName,
                    userName: userName,
                    projectName: projectName,
                    message: err,
                    error: `unable to create project : ${projectName} directory with error : ${err}`
                });
            }
        }
        const projectTarFilePath = `${downloadedProjectPath}/${projectName}_downloaded.tar.gz`;
        let call = projectGrpcClient.CreateProject(payload);
        call.on('data', async (err: any, response: { fileChunk: any }) => {
            if (err) {
                cleanup(downloadedProjectPath)
                return res.status(500).json({
                    repositoryName: repositoryName,
                    userName: userName,
                    projectName: projectName,
                    message: `unable to create project : ${projectName}`,
                    error: err
                });
            }
            if (response.fileChunk) {
                fs.appendFileSync(projectTarFilePath, response.fileChunk);
                console.debug(`writing tar file chunk to: ${projectTarFilePath}`);
            }
        });
        call.on('error', async (response: any) => {
            return res.status(500).json({
                repositoryName: repositoryName,
                userName: userName,
                projectName: projectName,
                message: `unable to create project : ${projectName}`,
                error: response.details
            });
        });
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
                // clone existing repository
                const cloneExistingProjectFromGithubRequest: CloneExistingProjectFromGithubRequest = {
                    clonedProjectPath: `${downloadedProjectPath}`,
                    userName: userName,
                    password: <string>getUser(<string>userName),
                    repositoryName: repositoryName
                }

                await cloneExistingProjectFromGithub(cloneExistingProjectFromGithubRequest)

                // save to github
                const pushToExistingProjectOnGithubRequest: PushToExistingProjectOnGithubRequest = {
                    createdProjectPath: `${downloadedProjectPath}` + `${originalProjectPath}`,
                    existingProject: cloneExistingProjectFromGithubRequest.clonedProjectPath + "/" + repositoryName,
                    userName: userName,
                    email: email,
                    password: <string>getUser(<string>userName),
                    repositoryName: repositoryName
                }

                await pushToExistingProjectOnGithub(pushToExistingProjectOnGithubRequest)
                console.log(`saved ${downloadedProjectPath} to github`)
                cleanup(downloadedProjectPath);

                // send status back to ui
                return res.status(200).json({
                    repositoryName: repositoryName,
                    userName: userName,
                    projectName: projectName,
                    message: `created project: ${projectName} and saved in repository : ${repositoryName} successfully`,
                    error: ""
                });
            });
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            repositoryName: repositoryName,
            userName: userName,
            projectName: projectName,
            message: `unable to create project : ${projectName}`,
            error: err
        });
    }
});

// updateProject (grpc calls to compage-core)
compageRouter.post("/update_project", async (req, res) => {
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
