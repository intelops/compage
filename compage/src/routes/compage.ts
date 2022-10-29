import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";
import * as fs from "fs";
import * as os from "os";

const rimraf = require("rimraf");
const tar = require('tar')
const compageRouter = Router();
const projectGrpcClient = getProjectGrpcClient();

// createProject (grpc calls to compage-core)
compageRouter.post("/create_project", async (req, res) => {
    const {repoName, yaml, projectName, userName} = req.body;
    try {
        const payload = {
            "projectName": projectName,
            "userName": userName,
            "yaml": yaml,
            "repositoryName": repoName
        }
        const projectDir = `${os.tmpdir()}/${projectName}_downloaded`
        try {
            fs.mkdirSync(projectDir, {recursive: true});
        } catch (err: any) {
            if (err.code !== 'EEXIST') {
                return res.status(500).json({
                    repositoryName: repoName,
                    userName: userName,
                    projectName: projectName,
                    message: "",
                    error: `unable to create project : ${projectName} directory with error : ${err}`
                });
            }
        }
        const projectTarFilePath = `${projectDir}/${projectName}_downloaded.tar.gz`;
        let call = projectGrpcClient.CreateProject(payload);
        call.on('data', async (response: { fileChunk: any }) => {
            if (response.fileChunk) {
                fs.appendFileSync(projectTarFilePath, response.fileChunk);
                console.debug(`Writing tar file chunk to: ${projectTarFilePath}`);
            }
        });
        call.on('end', () => {
            // TODO need to be removed later. Its currently required for debugging.
            // const files = fs.readdirSync(projectDir);
            // files.forEach(file => {
            //     console.log("file : ", file);
            // });

            // extract tar file
            fs.createReadStream(projectTarFilePath).pipe(
                tar.extract({
                    strip: 1,
                    C: projectDir
                })
            )

            // save to github
            console.log(`saved ${projectDir} to gihub`)

            // remove directory created, delete directory recursively
            rimraf(projectDir, () => {
                console.debug(`${projectDir} is cleaned up`);
            });

            return res.status(200).json({
                repositoryName: repoName,
                userName: userName,
                projectName: projectName,
                message: `created project: ${projectName} and saved in repository : ${repoName} successfully`,
                error: ""
            });
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            repositoryName: repoName,
            userName: userName,
            projectName: projectName,
            message: "",
            error: `unable to create project : ${projectName}`
        });
    }
});

// updateProject (grpc calls to compage-core)
compageRouter.post("/update_project", async (req, res) => {
    const {repoName, yaml, projectName, userName} = req.body;
    try {
        const payload = {
            "projectName": projectName,
            "userName": userName,
            "yaml": yaml,
            "repositoryName": repoName
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
