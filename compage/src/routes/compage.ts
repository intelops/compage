import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";
import * as fs from "fs";
import * as os from "os";
import {pushProjectToGithub, PushProjectToGithubRequest} from "../util/simple-git-operations";
import {getUser} from "./store";

const rimraf = require("rimraf");
const tar = require('tar')
const compageRouter = Router();
const projectGrpcClient = getProjectGrpcClient();

// createProject (grpc calls to compage-core)
compageRouter.post("/create_project", async (req, res) => {
    const {repositoryName, yaml, projectName, userName, email} = req.body;
    try {
        const payload = {
            "projectName": projectName,
            "userName": userName,
            "yaml": yaml,
            "repositoryName": repositoryName
        }
        const projectPath = `${os.tmpdir()}/${projectName}_downloaded`
        try {
            fs.mkdirSync(projectPath, {recursive: true});
        } catch (err: any) {
            if (err.code !== 'EEXIST') {
                return res.status(500).json({
                    repositoryName: repositoryName,
                    userName: userName,
                    projectName: projectName,
                    message: "",
                    error: `unable to create project : ${projectName} directory with error : ${err}`
                });
            }
        }
        const projectTarFilePath = `${projectPath}/${projectName}_downloaded.tar.gz`;
        let call = projectGrpcClient.CreateProject(payload);
        call.on('data', async (response: { fileChunk: any }) => {
            if (response.fileChunk) {
                fs.appendFileSync(projectTarFilePath, response.fileChunk);
                console.debug(`Writing tar file chunk to: ${projectTarFilePath}`);
            }
        });
        call.on('end', () => {
            // extract tar file
            fs.createReadStream(projectTarFilePath).pipe(
                tar.extract({
                    strip: 1,
                    C: projectPath
                })
            )

            // save to github
            const pushProjectToGithubRequest: PushProjectToGithubRequest = {
                projectPath: `${projectPath}/` + `${os.tmpdir()}/${projectName}`,
                userName: userName,
                email: email,
                password: <string>getUser(<string>userName),
                repositoryName: repositoryName
            }
            pushProjectToGithub(pushProjectToGithubRequest)
            console.log(`saved ${projectPath} to github`)

            // remove directory created, delete directory recursively
            rimraf(projectPath, () => {
                console.debug(`${projectPath} is cleaned up`);
            });

            return res.status(200).json({
                repositoryName: repositoryName,
                userName: userName,
                projectName: projectName,
                message: `created project: ${projectName} and saved in repository : ${repositoryName} successfully`,
                error: ""
            });
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            repositoryName: repositoryName,
            userName: userName,
            projectName: projectName,
            message: "",
            error: `unable to create project : ${projectName}`
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
