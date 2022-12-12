import {getToken} from "../util/user-store";
import {NextFunction, Request, Response} from "express";

export const requireUserNameMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const unauthorized = (message: string) => response.status(401).json({
        status: 401,
        message: message
    });

    const requestHeader = "X-User-Name";
    const userName = request.header(requestHeader);
    if (!userName) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }

    let token = await getToken(<string>userName);
    if (token === undefined || token === "" || token === null) {
        unauthorized(`token lost from server, needs to re-login to github`);
        return
    }

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}