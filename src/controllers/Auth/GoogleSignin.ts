import {Users} from '../../models'
import {Response} from 'express'
import {CustomRequest, ISignup} from '../../types'
import * as jwt from 'jsonwebtoken'
import {UserType} from '../../types'
import {v4} from 'uuid'
import {Stripe} from '../../lib'

export default async (req: CustomRequest<ISignup>, res: Response) => {
    try {
        const {email, fname, lname} = req.body
        const password = v4()
        if (!email || email === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Wrong/missing email',
                        field: 'email',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!fname || fname === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Wrong/missing fname',
                        field: 'fname',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!lname || lname === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Wrong/missing lname',
                        field: 'lname',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }


        const _verify = await Users.findOne({email})
        if (!_verify) {
            const NEW_USER = await Users.create({
                email,
                password,
                fname,
                lname,
                type: UserType.GOOGLE,
            })
            const payload = {
                email,
                fullName: NEW_USER.fullName,
                _id: NEW_USER._id,
                stripeId: NEW_USER.stripeId,
            }
            if (process.env.USERS_SECRET_KEY) {
                jwt.sign(
                    payload,
                    process.env.USERS_SECRET_KEY,
                    {
                        expiresIn: '48h',
                    },
                    async (_, encoded) => {
                        console.log(`Access Token generated for Instructor : ${email}`)
                        const paymentMethods = await Stripe.paymentMethods?.list({
                            customer: NEW_USER.stripeId,
                            type: 'card',
                        })
                        return res.status(200).json({
                            status: 'Success',
                            message: 'User account was created successfully.',
                            token: encoded,
                            fullName: NEW_USER.fullName,
                            email: NEW_USER.email,
                            _id: NEW_USER._id,
                            type: UserType.GOOGLE,
                            stripeId: NEW_USER.stripeId,
                            paymentMethods: paymentMethods.data,
                            subscriptions: [],
                            activeSubscription: NEW_USER.activeSubscription,
                            favorites: NEW_USER.favoriteProducts,
                            bundleType: NEW_USER.bundleType,
                            accountStatus: NEW_USER.status,
                            requestTime: new Date().toISOString(),
                        })
                    },
                )
            }
        } else {
            const USER = await Users.findOne({
                email,
                type: UserType.GOOGLE,
            }).populate('favoriteProducts')
            //Useless check just to shut the linter
            if (!USER) {
                return res.status(404).json({
                    status: 'Failure',
                    message: 'Bad request, User was not found.',
                    requestTime: new Date().toISOString(),
                })
            }
            const payload = {
                email,
                fullName: USER.fullName,
                _id: USER._id,
                stripeId: USER.stripeId,
            }
            if (process.env.USERS_SECRET_KEY) {
                jwt.sign(
                    payload,
                    process.env.USERS_SECRET_KEY,
                    {
                        expiresIn: '48h',
                    },
                    async (_, encoded) => {
                        console.log(`Access Token generated for Instructor : ${email}`)
                        const _verifyStripeUser = await Stripe.customers.retrieve(USER.stripeId).catch(err => {
                            switch (err.type) {

                                case 'StripeCardError':
                                    // A declined card error
                                    err.message; // => e.g. "Your card's expiration year is invalid."
                                    break;
                                case 'StripeRateLimitError':
                                    // Too many requests made to the API too quickly
                                    break;
                                case 'StripeInvalidRequestError':
                                    console.log(err.message)
                                    return res.status(404).json({
                                        status: 'Failure',
                                        message: 'Stripe customer was not found',
                                        requestTime: new Date().toISOString(),
                                    })
                                // Invalid parameters were supplied to Stripe's API
                                case 'StripeAPIError':
                                    // An error occurred internally with Stripe's API
                                    break;
                                case 'StripeConnectionError':
                                    // Some kind of error occurred during the HTTPS communication
                                    break;
                                case 'StripeAuthenticationError':
                                    // You probably used an incorrect API key
                                    break;
                                default:
                                    // Handle any other types of unexpected errors
                                    break;
                            }
                        })
                        if (!_verifyStripeUser) {
                            return res.status(404).json({
                                status: 'Failure',
                                message: 'User was not found in stripe',
                                requestTime: new Date().toISOString(),
                            })
                        }
                        const paymentMethods = await Stripe.paymentMethods?.list({
                            customer: USER.stripeId,
                            type: 'card',
                        })
                        return res.status(200).json({
                            status: 'Success',
                            message: 'User account was created successfully.',
                            token: encoded,
                            fullName: USER.fullName,
                            email: USER.email,
                            _id: USER._id,
                            type: UserType.GOOGLE,
                            stripeId: USER.stripeId,
                            paymentMethods: paymentMethods.data,
                            subscriptions: [],
                            activeSubscription: USER.activeSubscription,
                            favorites: USER.favoriteProducts,
                            bundleType: USER.bundleType,
                            accountStatus: USER.status,
                            requestTime: new Date().toISOString(),
                        })
                    },
                )
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
            return res.status(500).json({
                message: 'Internal Server Error',
                error: err.message,
                requestTime: new Date().toISOString(),
            })
        }
    }
};
