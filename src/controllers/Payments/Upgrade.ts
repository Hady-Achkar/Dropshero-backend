import {Request, Response} from 'express'
import {Stripe} from '../../lib'
import {Users} from "../../models";
import {AccountStatus, BundleType} from "../../types";

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {stripeId, _id: UserId} = req.user
        const {coupon} = req.body
        let verifyCoupon = null
        if (coupon) {
            verifyCoupon = await Stripe.coupons.retrieve(coupon)
        }
        const invoices = await Stripe.invoices.list({customer: stripeId})
        const allPrices = await Stripe.prices?.list(
            {
                expand: ['data.product']
            }
        )
        const _verifyPrice = allPrices.data.find(item => item.nickname === 'one_time')
        const oldUser = await Users.findById(UserId).populate('favoriteProducts')
        if (!oldUser) {
            return res.status(400).json({
                status: 'Failure',
                message: 'User was not found',
                requestTime: new Date().toISOString(),
            })
        }
        if (oldUser.status === AccountStatus.VERIFIED && oldUser.bundleType
            === BundleType.ONE_TIME) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Account already has an active product',
                requestTime: new Date().toISOString(),
            })
        }
        const _verifyUserStripe = await Stripe.customers.retrieve(stripeId)
        //@ts-ignore
        if (!_verifyUserStripe.invoice_settings.default_payment_method) {
            return res.status(400).json({
                status: 'Failure',
                message: 'User has no valid paymentMethod',
                requestTime: new Date().toISOString(),
            })
        }
        // @ts-ignore
        const tobeDiscountedFromCoupon = _verifyPrice.unit_amount * (verifyCoupon?.percent_off / 100) || 0;
        const lastInvoiceAmount = invoices.data[invoices.data.length - 1].amount_paid || 0
        const totalDiscountedPrice = verifyCoupon ? (lastInvoiceAmount + tobeDiscountedFromCoupon) : lastInvoiceAmount

        const paymentIntent = await Stripe.paymentIntents.create({
            //@ts-ignore
            amount: verifyCoupon && coupon && coupon !== '' ? (_verifyPrice.unit_amount - totalDiscountedPrice) : (_verifyPrice.unit_amount - lastInvoiceAmount) as number,
            currency: 'usd',
            payment_method_types: ['card'],
            customer: stripeId,
            //@ts-ignore
            payment_method: _verifyUserStripe.invoice_settings.default_payment_method,
            //@ts-ignore
            metadata: {
                //@ts-ignore
                name: _verifyPrice.name,
                //@ts-ignore
                description: _verifyPrice.description,
            },
            receipt_email: oldUser.email
        })
        const confirmedPaymentIntent = await Stripe.paymentIntents.confirm(
            paymentIntent.id,
            {
                //@ts-ignore
                payment_method: _verifyUserStripe.invoice_settings.default_payment_method,
                receipt_email: oldUser.email
            }
        )
        const updatedUser = await Users.findByIdAndUpdate(UserId, {
            $set: {
                activeSubscription: paymentIntent.id,
                //@ts-ignore
                activePrice: _verifyPrice.id as string,
                bundleType: BundleType.ONE_TIME,
                status: AccountStatus.VERIFIED
            }
        }, {
            new: true
        }).populate('favoriteProducts').select('-password')

        return res.status(200).json({
            status: 'Success',
            message: 'Upgraded successfully',
            user: updatedUser,
            requestTime: new Date().toISOString(),
        })
    } catch
        (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error: err.message,
                requestTime: new Date().toISOString(),
            })
        }
    }
}
