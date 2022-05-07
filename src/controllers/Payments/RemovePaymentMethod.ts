import {Request, Response} from 'express'
import {Stripe} from '../../lib'
import {Users} from '../../models'

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {_id: UserId, stripeId} = req.user
        const {paymentMethodId} = req.body
        if (!paymentMethodId || paymentMethodId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing paymentMethodId',
                        field: 'paymentMethodId',
                        type: 'stripe id'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }

        const paymentMethod = await Stripe.paymentMethods.detach(
            paymentMethodId
        );
        return res.status(204).json({
            status: 'Success',
            message: 'Payment method was removed successfully',
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
