import {Users} from '../../models'
import {Response} from 'express'
import {CustomRequest} from '../../types'
import {ISignin} from '../../types'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import {UserType} from '../../types'

export default async (req: CustomRequest<ISignin>, res: Response) => {
	try {
		const {email, password} = req.body
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
		if (!password || password === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong/missing password',
						field: 'password',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _user = await Users.findOne({
			email,
		}).populate('favoriteProducts')
		if (!_user) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Email was not found',
				requestTime: new Date().toISOString(),
			})
		} else {
			const _verifyLogin = await bcrypt.compare(password, _user.password)
			if (!_verifyLogin) {
				return res.status(401).json({
					status: 'Failure',
					message: 'Wrong credentials',
					requestTime: new Date().toISOString(),
				})
			}
			const payload = {
				email,
				fullName: _user.fullName,
				_id: _user._id,
				stripeId: _user.stripeId,
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
						return res.status(200).json({
							status: 'success',
							message: 'User was logged in successfully.',
							token: encoded,
							fullName: _user.fullName,
							email: _user.email,
							_id: _user._id,
							type: UserType.STANDARD,
							stripeId: _user.stripeId,
							activeSubscription: _user.activeSubscription,
							favorites: _user.favoriteProducts,
							bundleType: _user.bundleType,
							accountStatus: _user.status,
							requestTime: new Date().toISOString(),
						})
					}
				)
			}
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
