import {Users} from '../../models'
import {Response} from 'express'
import {CustomRequest, ISignup, UserType} from '../../types'
import * as jwt from 'jsonwebtoken'
import {Stripe} from '../../lib'

export default async (req: CustomRequest<ISignup>, res: Response) => {
	try {
		const {email, password, fname, lname} = req.body

		const NEW_USER = await Users.create({
			email,
			password,
			fname,
			lname,
			type: UserType.STANDARD,
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
					console.log(`Access Token generated for user : ${email}`)

					if (req.body.referral) {
						await Stripe.customers.update(NEW_USER.stripeId, {
							metadata: {referral: req.body.referral},
						})
					}

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
						type: UserType.STANDARD,
						stripeId: NEW_USER.stripeId,
						paymentMethods: paymentMethods.data,
						subscriptions: [],
						activeSubscription: NEW_USER.activeSubscription,
						favorites: NEW_USER.favoriteProducts,
						bundleType: NEW_USER.bundleType,
						accountStatus: NEW_USER.status,
						requestTime: new Date().toISOString(),
					})
				}
			)
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
}
