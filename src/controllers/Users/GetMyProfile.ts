import {Request, Response} from 'express'
import {Users} from '../../models'
import {Stripe} from "../../lib";

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {_id: UserId, stripeId} = req.user
        const _verifyUser = await Users.findById(UserId).populate('favoriteProducts').select('-password')
        if (!_verifyUser) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User was not found',
                user: null,
                requestTime: new Date().toISOString(),
            })
        }
        const payments = await Stripe.paymentIntents.list({
            customer: stripeId,
        });
        const invoices = await Stripe.invoices.list({
            customer: stripeId,
        });
        const subscriptions = await Stripe.subscriptions?.list({
            customer: stripeId,
            status: 'all',
            expand: ['data.default_payment_method'],
        })
        const paymentMethods = await Stripe.paymentMethods?.list({
            customer: stripeId,
            type: 'card',
        })
        const customer = await Stripe.customers.retrieve(stripeId)

        return res.status(200).json({
            status: 'Success',
            message: 'User was fetched successfully',
            user: {
                ..._verifyUser.toObject(),
                payments,
                invoices,
                subscriptions,
                paymentMethods,
                //@ts-ignore
                defaultPaymentMethod: customer.invoice_settings.default_payment_method
            },
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
