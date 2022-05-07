import {Request, Response} from 'express'
import {Contact} from "../../models";

export default async (
    req: Request,
    res: Response
) => {
    try {
        const {email, fullName, message} = req.body

        if (!email || email === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing email',
                        field: 'email',
                        type: 'string'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!fullName || fullName === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing fullName',
                        field: 'fullName',
                        type: 'string'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!message || message === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing message',
                        field: 'message',
                        type: 'string'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }

        await Contact.create({
            email,
            fullName,
            message
        })
        return res.status(204).json({
            status: 'Success',
            message: 'Contact was created successfully',
            requestTime: new Date().toISOString(),
        })
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
