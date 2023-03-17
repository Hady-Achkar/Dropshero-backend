 import {Response} from 'express'
import * as jwt from 'jsonwebtoken'
import {
	AccountStatus,
	BundleType,
	CustomRequest,
	ISignup,
	UserType,
} from '../../../types'
import {Users} from '../../../models'
import {Stripe} from '../../../lib'

export default async (req: CustomRequest<ISignup>, res: Response) => {
	try {
		const {email, password, fname, lname} = req.body

		const NEW_USER = await Users.create({
			email,
			password,
			fname,
			lname,
			type: UserType.STANDARD,
			bundleType: BundleType.ONE_TIME,
			status: AccountStatus.VERIFIED,
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
						bundleType: BundleType.ONE_TIME,
						accountStatus: AccountStatus.VERIFIED,
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
