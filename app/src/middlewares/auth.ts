import {NextFunction, Request, Response} from 'express';
import {X_EMAIL_HEADER} from '../utils/constants';

export const requireEmailMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    // below code is committed as we are not using it for now.
    const unauthorized = (message: string) => response.status(401).json({
        message
    });

    // const email = request.header(X_EMAIL_HEADER);
    // if (!email) {
    //     unauthorized(`Required ${X_EMAIL_HEADER} header not found.`);
    //     return;
    // }

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
};