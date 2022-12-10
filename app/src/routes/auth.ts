import axios from "axios";
import {btoa} from "buffer";
import {Router} from "express";
import {getToken, setToken} from "../util/token-store";
import config from "../util/constants";
import {requireUserNameMiddleware} from "../middlewares/auth";

const authRouter = Router();

const getBasicAuthenticationPair = () => {
    return btoa(config.client_id + ":" + config.client_secret);
}

authRouter.post("/authenticate", async (req, res) => {
    const {code} = req.body;
    console.log("Code :", code)
    console.log("config.client_id :", config.client_id)
    console.log("config.client_secret :", config.client_secret)
    console.log("Code :", config.redirect_uri)
    // Request to exchange code for an access token
    axios({
        url: `https://github.com/login/oauth/access_token`, method: "POST", data: {
            client_id: config.client_id,
            client_secret: config.client_secret,
            code: code,
            redirect_uri: config.redirect_uri
        }
    }).then(response => {
        let params = new URLSearchParams(response.data);
        const access_token = params.get("access_token");
        console.log("Access token retrieved")
        // Request to return data of a user that has been authenticated
        return axios(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        }).then((response) => {
            setToken(response.data.login, <string>access_token)
            console.log("User token retrieved")
            return res.status(200).json(response.data);
        }).catch((error) => {
            return res.status(400).json(error);
        });
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

authRouter.get("/logout", requireUserNameMiddleware, async (req, res) => {
    const {userName} = req.query
    const bearerToken = `${getBasicAuthenticationPair()}`
    console.log("bearerToken : ", bearerToken)
    const accessToken = await getToken(<string>userName)
    console.log("accessToken : ", accessToken)
    console.log("config.client_id: ", config.client_id)
    axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${bearerToken}`,
        },
        url: `https://api.github.com/applications/${config.client_id}/token`,
        method: "PATCH",
        data: {
            access_token: accessToken
        }
    }).then((response) => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText)
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

authRouter.get("/check_token", requireUserNameMiddleware, async (req, res) => {
    const {userName} = req.query;
    axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${getBasicAuthenticationPair()}`,
        },
        url: `https://api.github.com/applications/${config.client_id}/token`,
        method: "POST",
        data: {
            access_token: await getToken(<string>userName)
        }
    }).then((response) => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText)
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

export default authRouter;