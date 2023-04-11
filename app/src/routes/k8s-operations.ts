import {requireUserNameMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {GetCurrentContextResponse, GetCurrentContextError} from './models';
import {getCurrentContext} from "../store/kube-client";
import Logger from "../util/logger";

const k8sOperationsRouter = Router();

// returns current-context.
k8sOperationsRouter.get('/current-context', requireUserNameMiddleware, async (request: Request, response: Response) => {
    // TODO dummy delay given
    await new Promise(r => setTimeout(r, 1000));
    const contextName = await getCurrentContext();
    try {
        return response.status(200).json(getGetCurrentContextResponse(contextName));
    } catch (e) {
        const message = `current context couldn't be fetched.`;
        Logger.debug(`${e} : ${message}`);
        Logger.error(`${message}`);
        return response.status(500).json(getGetCurrentContextError(message));
    }
});

const getGetCurrentContextError = (message: string) => {
    const getCurrentContextError: GetCurrentContextError = {
        message,
    };
    return getCurrentContextError;
};

const getGetCurrentContextResponse = (contextName: string) => {
    const getCurrentContextResponse: GetCurrentContextResponse = {
        contextName,
    };
    return getCurrentContextResponse;
};

export default k8sOperationsRouter;
