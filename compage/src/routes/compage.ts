import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";

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
        projectGrpcClient.CreateProject(payload, (err: any, response: { fileChunk: any; }) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err);
            }
            const fileChunk = response.fileChunk;
            console.log(fileChunk)
            return res.status(200).json({fileChunk: fileChunk.toString()});
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
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
