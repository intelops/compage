import {getToken} from "../util/user-store";
import {NextFunction, Request, Response} from "express";
import {X_USER_NAME_HEADER} from "../util/constants";

export const requireUserNameMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const unauthorized = (message: string) => response.status(401).json({
        status: 401,
        message: message
    });

    const userName = request.header(X_USER_NAME_HEADER);
    if (!userName) {
        unauthorized(`Required ${X_USER_NAME_HEADER} header not found.`);
        return;
    }

    try {
        let token = await getToken(<string>userName);
        if (token === undefined || token === "" || token === null) {
            unauthorized(`token lost from server, needs to re-login to github`);
            return
        }
    } catch (e: any) {
        unauthorized(`token lost from server, needs to re-login to github`);
        return
    }

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}