import axios from 'axios';
import {btoa} from 'buffer';
import {Router} from 'express';
import {getToken, setToken} from '../util/user-client';
import config from '../util/constants';
import {requireUserNameMiddleware} from '../middlewares/auth';
import {LoginError} from './models';
import Logger from '../util/logger';

const authOperationsRouter = Router();

const getBasicAuthenticationPair = () => {
    return btoa(config.client_id + ':' + config.client_secret);
};

authOperationsRouter.post('/login', async (req, res) => {
    const {code} = req.body;
    // Request to exchange code for an access token
    axios({
        url: `https://github.com/login/oauth/access_token`, method: 'POST', data: {
            client_id: config.client_id,
            client_secret: config.client_secret,
            code,
            redirect_uri: config.redirect_uri
        }
    }).then(response => {
        const params = new URLSearchParams(response.data);
        const accessToken = params.get('access_token');
        Logger.info('Access token retrieved');
        // Request to return data of a user that has been authenticated
        return axios(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        }).then((resp) => {
            setToken(resp.data.login, resp.data.email, accessToken as string).then(userResource => {
                if (userResource.apiVersion) {
                    Logger.info(`${userResource.metadata.name} user updated`);
                    return res.status(200).json(resp.data);
                } else {
                    Logger.info(`${resp.data.login} user couldn't be updated`);
                    return res.status(400).json(getLoginError('error occurred while updating user to k8s resource'));
                }
            });
        }).catch((error) => {
            return res.status(400).json(getLoginError(JSON.stringify(error)));
        });
    }).catch((error) => {
        return res.status(500).json(getLoginError(JSON.stringify(error)));
    });
});

authOperationsRouter.get('/logout', requireUserNameMiddleware, async (req, res) => {
    const {userName} = req.query;
    const bearerToken = `${getBasicAuthenticationPair()}`;
    const accessToken = await getToken(userName as string);
    axios({
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${bearerToken}`,
        },
        url: `https://api.github.com/applications/${config.client_id}/token`,
        method: 'PATCH',
        data: {
            access_token: accessToken
        }
    }).then((response) => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText);
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

authOperationsRouter.get('/check_token', requireUserNameMiddleware, async (req, res) => {
    const {userName} = req.query;
    axios({
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${getBasicAuthenticationPair()}`,
        },
        url: `https://api.github.com/applications/${config.client_id}/token`,
        method: 'POST',
        data: {
            access_token: await getToken(userName as string)
        }
    }).then((response) => {
        if (response.status !== 200) {
            return res.status(response.status).json(response.statusText);
        }
        return res.status(200).json(response.data);
    }).catch((error) => {
        Logger.debug(`error occurred while retrieving access token from github : ${JSON.stringify(error)}`);
        return res.status(500).json(error);
    });
});

export default authOperationsRouter;

const getLoginError = (error: string): LoginError => {
    Logger.debug(`error occurred while retrieving access token from github : ${JSON.stringify(error)}`);
    return {message: error};
};
