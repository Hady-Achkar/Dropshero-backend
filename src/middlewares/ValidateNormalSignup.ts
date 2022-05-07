import {NextFunction, Response} from 'express'
import {CustomRequest, ISignup} from "../types";
import {Users} from "../models";

export default async (
    req: CustomRequest<ISignup>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            email,
            password, fname, lname
        } = req.body
        if (!email || email === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing email',
                        field: 'email',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!password || password === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing password',
                        field: 'password',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!fname || fname === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing fname',
                        field: 'fname',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!lname || lname === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing lname',
                        field: 'lname',
                        type: 'string'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }

        const _verifyUser = await Users.findOne({
            email,
        })
        if (_verifyUser) {
            return res.status(400).json({
                status: 'Failure',
                message: 'User already exist',
                requestTime: new Date().toISOString(),
            })
        }
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
