import {Request, Response} from 'express'
import {Stripe} from "../../lib";
import {Users} from "../../models";
import {AccountStatus, BundleType} from "../../types";

export default async (
    req: Request,
    res: Response
) => {
    try {
        const {priceId} = req.query
        const {paymentMethodId, coupon} = req.body
        //@ts-ignore
        const {stripeId, _id: UserId} = req.user
        if (!priceId || priceId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing priceId',
                        field: 'priceId',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!paymentMethodId || paymentMethodId === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing paymentMethodId',
                        field: 'paymentMethodId',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const _verifyPrice = await Stripe.prices?.retrieve(priceId as string, {expand: ['product']})
        if (!_verifyPrice.id) {
            return res.status(404).json({
                status: 'Failure',
                message: 'Price was not found',
                requestTime: new Date().toISOString(),
            })
        }
        const oldUser = await Users.findById(UserId).populate('favoriteProducts')
        if (!oldUser) {
            return res.status(400).json({
                status: 'Failure',
                message: 'User was not found',
                requestTime: new Date().toISOString(),
            })
        }
        if (oldUser.status === AccountStatus.TRIAL || oldUser.status === AccountStatus.VERIFIED) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Account already has an active product',
                requestTime: new Date().toISOString(),
            })
        }
        const paymentMethod = await Stripe.paymentMethods.attach(
            paymentMethodId,
            {customer: stripeId},
        )
        await Stripe.customers?.update(stripeId, {
            invoice_settings: {
                default_payment_method: paymentMethod?.id,
            }
        })
        const _verifyUserStripe = await Stripe.customers?.retrieve(stripeId, {expand: ['invoice_settings']})
        if (!_verifyUserStripe.id) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Stripe customer was not found',
                requestTime: new Date().toISOString(),
            })
        }
        if (_verifyPrice.recurring !== null) {
            //@ts-ignore
            if (_verifyUserStripe.invoice_settings.default_payment_method === null) {
                return res.status(400).json({
                    status: 'Failure',
                    message: 'Customer doesnt have payment method',
                    requestTime: new Date().toISOString(),
                })
            }
            if (coupon && coupon !== '') {
                const subscription = await Stripe.subscriptions?.create({
                    customer: stripeId,
                    items: [{price: priceId as string}],
                    payment_behavior: 'default_incomplete',
                    coupon,
                    metadata: {
                        //@ts-ignore
                        name: _verifyPrice.name,
                        //@ts-ignore
                        description: _verifyPrice.description,
                    }
                })
                if (subscription.latest_invoice) {
                    const invoice = await Stripe.invoices.pay(
                        //@ts-ignore
                        subscription.latest_invoice
                    );
                    console.log(invoice)
                    const updatedUser = await Users.findByIdAndUpdate(UserId, {
                        $set: {
                            bundleType: BundleType.MONTHLY,
                            activeSubscription: subscription.id,
                            status: AccountStatus.VERIFIED
                        }
                    }, {
                        new: true
                    }).populate('favoriteProducts').select('-password')
                    return res.status(200).json({
                        status: 'Success',
                        message: 'Subscription was created successfully',
                        user: updatedUser,
                        requestTime: new Date().toISOString(),
                    })
                } else {
                    return res.status(500).json({
                        message: 'Internal Server Error',
                        error: 'Subscription was not completed',
                        requestTime: new Date().toISOString(),
                    })
                }
            } else {
                const subscription = await Stripe.subscriptions?.create({
                    customer: stripeId,
                    items: [{price: priceId as string}],
                    payment_behavior: 'default_incomplete',
                    metadata: {
                        //@ts-ignore
                        name: _verifyPrice.name,
                        //@ts-ignore
                        description: _verifyPrice.description,
                    }
                })
                if (subscription.latest_invoice) {
                    const invoice = await Stripe.invoices.pay(
                        //@ts-ignore
                        subscription.latest_invoice
                    );
                    console.log(invoice)
                    const updatedUser = await Users.findByIdAndUpdate(UserId, {
                        $set: {
                            bundleType: BundleType.MONTHLY,
                            activeSubscription: subscription.id,
                            status: AccountStatus.VERIFIED
                        }
                    }, {
                        new: true
                    }).populate('favoriteProducts').select('-password')
                    return res.status(200).json({
                        status: 'Success',
                        message: 'Subscription was created successfully',
                        user: updatedUser,
                        requestTime: new Date().toISOString(),
                    })
                } else {
                    return res.status(500).json({
                        message: 'Internal Server Error',
                        error: 'Subscription was not completed',
                        requestTime: new Date().toISOString(),
                    })
                }
            }


        } else {
            const verifyCoupon = await Stripe.coupons.retrieve(coupon)

            const paymentIntent = await Stripe.paymentIntents.create({
                //@ts-ignore
                amount: verifyCoupon && coupon && coupon !== '' ? (_verifyPrice.unit_amount - (_verifyPrice.unit_amount) * (verifyCoupon.percent_off / 100)) : _verifyPrice.unit_amount as number,
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
                    activePrice: priceId as string,
                    bundleType: BundleType.ONE_TIME,
                    status: AccountStatus.VERIFIED
                }
            }, {
                new: true
            }).populate('favoriteProducts').select('-password')

            return res.status(200).json({
                status: 'Success',
                message: 'Subscription was created successfully with a lifetime period',
                user: updatedUser,
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
