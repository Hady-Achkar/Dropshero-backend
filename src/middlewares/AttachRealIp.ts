import {NextFunction, Request, Response} from 'express'

export default async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //@ts-ignore
        req.userIP = req.headers['x-real-ip']
        next()
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error: err.message,
                requestTime: new Date().toISOString(),
            })
        }
    }
}
