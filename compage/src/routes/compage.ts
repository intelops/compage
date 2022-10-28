import {getProjectGrpcClient} from "../grpc/project";
import {Router} from "express";

const compageRouter = Router();

const projectGrpcClient = getProjectGrpcClient()
// generateProject (grpc calls to compage-core)
compageRouter.post("/create_project", async (req, res) => {
    const {repoName, yaml, projectName, userName} = req.body;
    try {
        const payload = {
            "name": projectName,
            "user": userName,
            "yaml": yaml,
            "repository": repoName
        }
        projectGrpcClient.GenerateProject(payload, (err: any, response: { name: string, fileChunk: any; }) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({name: response.name, fileChunk: response.fileChunk.toString()});
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default compageRouter;
