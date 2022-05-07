import {Request, Response} from 'express'
import {Stripe} from "../../lib";
import {Users} from '../../models'
import {AccountStatus, IProduct, UserType} from "../../types";
import {BundleType} from "../../types/enums";

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {_id: UserId, stripeId} = req.user
        const {subscriptionId} = req.body
        await Stripe.subscriptions.del(
            subscriptionId
        );

        const updatedUser = await Users.findByIdAndUpdate(UserId, {
            $set: {
                activeSubscription: '',
                inTrial: false,
                isTrialLegit: false,
                activePrice: '',
                status: AccountStatus.NOT_VERIFIED,
                //@ts-ignore
                bundleType: '',
            }
        }, {new: true})
        if (!updatedUser) {
            return res.status(500).json({
                status: 'Failure',
                message: 'Internal Server Error',
                error: 'Something went wrong',
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
        return res.status(200).json({
            status: 'Success',
            message: 'User was fetched successfully',
            user: {
                ...updatedUser.toObject(),
                payments,
                invoices,
                subscriptions,
                paymentMethods
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
