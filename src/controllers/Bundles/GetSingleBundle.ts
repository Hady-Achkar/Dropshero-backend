import {Request, Response} from 'express'
import {Stripe} from '../../lib'

export default async (
    req: Request,
    res: Response,
) => {
    try {
        const {priceId} = req.query
        if (!priceId || priceId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing priceId',
                        field: 'priceId',
                        type: 'string'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const price = await Stripe.prices?.retrieve(priceId as string, {expand: ['product']})
        return res.status(200).json({
            status: 'Success',
            message: 'Prices fetched',
            prices: price,
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
