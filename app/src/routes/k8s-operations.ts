import {requireEmailMiddleware} from '../middlewares/auth';
import {Request, Response, Router} from 'express';
import {getCurrentContext} from '../store/k8s/kube-client';
import Logger from '../utils/logger';
import {getGetCurrentContextError, getGetCurrentContextResponse} from "../models/k8s";

const k8sOperationsRouter = Router();

// returns current-context.
k8sOperationsRouter.get('/current-context', requireEmailMiddleware, async (_request: Request, response: Response) => {
    // TODO dummy delay given
    await new Promise(r => setTimeout(r, 1000));
    const contextName = await getCurrentContext();
    try {
        return response.status(200).json(getGetCurrentContextResponse(contextName));
    } catch (e: any) {
        const message = `current context couldn't be fetched[${e.message}].`;
        Logger.error(message);
        return response.status(500).json(getGetCurrentContextError(message));
    }
});

export default k8sOperationsRouter;
