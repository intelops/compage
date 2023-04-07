import {requireUserNameMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {K8sOpsError, K8sOpsResponse} from './models';
import {getCurrentContext} from "../store/kube-client";
import Logger from "../util/logger";

const k8sOpsRouter = Router();

// returns current-context.
k8sOpsRouter.get('/current-context', requireUserNameMiddleware, async (request: Request, response: Response) => {
    // TODO dummy delay given
    await new Promise(r => setTimeout(r, 1000));
    const contextName = await getCurrentContext();
    try {
        return response.status(200).json(getK8sOpsResponse(contextName));
    } catch (e) {
        const message = `current context couldn't be fetched.`;
        Logger.debug(`${e} : ${message}`);
        Logger.error(`${message}`);
        return response.status(500).json(getK8sOpsError(message));
    }
});

const getK8sOpsError = (message: string) => {
    const k8sOpsError: K8sOpsError = {
        message,
    };
    return k8sOpsError;
};

const getK8sOpsResponse = (contextName: string) => {
    const k8sOpsResponse: K8sOpsResponse = {
        contextName,
    };
    return k8sOpsResponse;
};

export default k8sOpsRouter;
