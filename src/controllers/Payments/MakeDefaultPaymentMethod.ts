import {Request, Response} from 'express'
import {Stripe} from "../../lib";

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {stripeId} = req.user
        const {paymentMethodId} = req.body
        if (!paymentMethodId || paymentMethodId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing paymentMethodId',
                        field: 'paymentMethodId',
                        type: 'string',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        await Stripe.customers.update(stripeId, {
            invoice_settings: {
                default_payment_method: paymentMethodId
            }
        })
        return res.status(204).json({
            status: 'Success',
            message: 'default payment method changed',
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
