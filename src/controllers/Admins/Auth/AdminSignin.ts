import {Admins} from '../../../models'
import {Response} from 'express'
import {CustomRequest} from '../../../types'
import {ISignin} from '../../../types'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

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
		const _admin = await Admins.findOne({
			email,
		})
		if (!_admin) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Email was not found',
				requestTime: new Date().toISOString(),
			})
		} else {
			const _verifyLogin = await bcrypt.compare(password, _admin.password)
			if (!_verifyLogin) {
				return res.status(401).json({
					status: 'Failure',
					message: 'Wrong credentials',
					requestTime: new Date().toISOString(),
				})
			}
			const payload = {
				email,
				fullName: _admin.fullName,
				role: _admin.role,
				image: _admin.image,
				_id: _admin._id,
			}
			if (process.env.ADMIN_SECRET_KEY) {
				jwt.sign(
					payload,
					process.env.ADMIN_SECRET_KEY,
					{
						expiresIn: '48h',
					},
					async (_, encoded) => {
						console.log(`Access Token generated for Admin : ${email}`)
						return res.status(200).json({
							status: 'success',
							message: 'admin was logged in successfully.',
							token: encoded,
							fullName: _admin.fullName,
							image: _admin.image,
							email: _admin.email,
							_id: _admin._id,
							role: _admin.role,
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
