import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';

export default async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                status: 'Failure',
                message: 'Not authorized',
                requestTime: new Date().toISOString(),
            });
        }

        if (token.startsWith('Bearer')) {
            // Splice token and remove the word bearer and get the whole token
            token = token.slice(7, token.length).trimLeft();
        }
        // Verify that the passed token is valid with the system JWT Secret
        if (!process.env.ADMIN_SECRET_KEY) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error: 'Something went wrong trying to fetch the secret key',
                requestTime: new Date().toISOString(),
            });
        }
        //@ts-ignore
        req.user = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
        next();
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error: err.message,
                requestTime: new Date().toISOString(),
            });
        }
    }
};
