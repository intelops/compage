import axios from "axios";
import {Router} from "express";
import {getUser} from "./store";

const githubRouter = Router();

githubRouter.post("/create_repository", async (req, res) => {
    const {repositoryName, description, userName} = req.body;
    if (getUser(userName) === undefined) {
        // TODO change message and may impl later
        return res.status(401).json("server restarted and lost the local cache of tokens")
    }
    axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${getUser(userName)}`,
        },
        url: `https://api.github.com/user/repos`, method: "POST", data: {
            name: repositoryName,
            description: description,
            private: true,
        }
    }).then(response => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText)
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

githubRouter.get("/list_repositories", async (req, res) => {
    const {userName} = req.query;
    if (getUser(<string>userName) === undefined) {
        // TODO change message and may impl later
        return res.status(401).json("server restarted and lost the localcache of tokens")
    }
    axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${getUser(<string>userName)}`,
        },
        url: `https://api.github.com/user/repos`,
        method: "GET"
    }).then(response => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText)
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

githubRouter.put("/commit_compage_yaml", async (req, res) => {
    const {message, committer, content, repositoryName, sha} = req.body;
    if (getUser(committer.userName) === undefined) {
        // TODO change message and may be impl too later
        return res.status(401).json("server restarted and lost the local cache of tokens")
    }
    axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${getUser(committer.userName)}`,
        },
        url: `https://api.github.com/repos/${committer.userName}/${repositoryName}/contents/.compage/config.json`,
        method: "PUT",
        data: {
            message: message,
            content: content,
            committer: {
                name: committer.userName,
                email: committer.email
            },
            sha: sha
        }
    }).then((response) => {
        if (response.status !== 200) {
            return res.status(response.status).json(response)
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(400).json(error);
    });
});

githubRouter.get("/pull_compage_yaml", async (req, res) => {
    const {userName, repositoryName} = req.query;
    if (getUser(<string>userName) === undefined) {
        // TODO change message and may impl later
        return res.status(401).json("server restarted and lost the local cache of tokens")
    }
    axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${getUser(<string>userName)}`,
        },
        url: `https://api.github.com/repos/${userName}/${repositoryName}/contents/.compage/config.json`,
        method: "GET",
    }).then((response) => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText)
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

export default githubRouter;