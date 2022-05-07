import {Request, Response} from 'express'
import {Admins} from '../../../models'
import {isValidObjectId} from "mongoose";

export default async (
    req: Request,
    res: Response
) => {
    try {
        const {adminId} = req.query
        if (!adminId || adminId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing adminId',
                        field: 'adminId',
                        type: 'ObjectId'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!isValidObjectId(adminId)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Wrong adminId format',
                        field: 'adminId',
                        type: 'ObjectId'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const admin = await Admins.findById(adminId).select('-password')
        if (!admin) {
            return res.status(404).json({
                status: 'Failure',
                message: 'Admin was not found',
                admin: null,
                requestTime: new Date().toISOString(),
            })
        }
        return res.status(200).json({
            status: 'Success',
            message: 'Admin was fetched successfully',
            admin: admin,
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
