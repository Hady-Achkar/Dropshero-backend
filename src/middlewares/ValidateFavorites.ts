import {isValidObjectId} from "mongoose";
import {NextFunction, Request, Response} from 'express'
import {Products, Users} from "../models";

export default async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {productId} = req.query
        if (!productId || productId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing productId',
                        field: 'productId',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!isValidObjectId(productId)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'wrong productId format',
                        field: 'productId',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        //@ts-ignore
        const {_id: UserId} = req.user
        const USER = await Users.findById(UserId).populate('favoriteProducts')
        if (!USER) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User was not found',
                requestTime: new Date().toISOString(),
            })
        }
        const _verifyProduct = await Products.findById(productId)
        if (!_verifyProduct) {
            return res.status(404).json({
                status: 'Failure',
                message: 'Product was not found',
                product: null,
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
