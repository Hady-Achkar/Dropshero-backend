import {Request, Response} from 'express'
import {Users} from "../../models";

export default async (
    req: Request,
    res: Response
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
        //@ts-ignore
        const {_id: UserId} = req.user
        const USER = await Users.findById(UserId).populate('favoriteProducts')
        if (!USER) {
            return res.status(400).json({
                status: 'Failure',
                message: 'User was not found.',
                requestTime: new Date().toISOString(),
            })
        }
        const _verifyAlreadyFound = USER.favoriteProducts.find(item => item._id == productId)
        if (_verifyAlreadyFound) {
            return res.status(200).json({
                status: 'Success',
                message: 'Product already exists in array',
                favorites: USER.favoriteProducts,
                requestTime: new Date().toISOString(),
            })
        } else {
            const updatedUser = await Users.findByIdAndUpdate(UserId, {
                $push: {
                    favoriteProducts: productId
                }
            }, {new: true}).populate('favoriteProducts')
            if (!updatedUser) {
                return res.status(500).json({
                    status: 'Failure',
                    message: 'Something went wrong',
                    requestTime: new Date().toISOString(),
                })
            }
            return res.status(200).json({
                status: 'Success',
                message: 'Product was added successfully to the user',
                favorites: updatedUser.favoriteProducts,
                requestTime: new Date().toISOString(),
            })
        }
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
