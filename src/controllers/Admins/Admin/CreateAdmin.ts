import {Admins} from '../../../models'
import {Response} from 'express'
import {AdminRoles, CustomRequest, IAdmin} from '../../../types'
import * as jwt from 'jsonwebtoken'

export default async (req: CustomRequest<IAdmin>, res: Response) => {
	try {
		const {email, password, fullName, role, image} = req.body
		//@ts-ignore
		const {role: AdminRole} = req.user

		if (!AdminRole || AdminRole !== AdminRoles.OWNER) {
			return res.status(401).json({
				status: 'Failure',
				errors: [
					{
						name: 'Not Authorized',
						field: 'role',
					},
				],
			})
		}

		if (!fullName || fullName === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Missing fullname',
						field: 'fullName',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!email || email === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Missing Email Address',
						field: 'email',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!password) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Missing Password',
						field: 'password',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (password.length < 6) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Password should be 6 characters or more',
						field: 'email',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const NEW_ADMIN = await Admins.create({
			email,
			password,
			fullName,
			role,
			image,
		})

		const payload = {
			email,
			fullName: NEW_ADMIN.fullName,
			role: NEW_ADMIN.role,
			_id: NEW_ADMIN._id,
			image: NEW_ADMIN.image,
		}
		if (process.env.ADMIN_SECRET_KEY) {
			jwt.sign(
				payload,
				process.env.ADMIN_SECRET_KEY,
				{
					expiresIn: '48h',
				},
				async (_, encoded) => {
					console.log(`Access Token generated for admin : ${email}`)
					return res.status(200).json({
						status: 'Success',
						message: 'Admin account was created successfully.',
						token: encoded,
						fullName: NEW_ADMIN.fullName,
						email: NEW_ADMIN.email,
						_id: NEW_ADMIN._id,
						role: NEW_ADMIN.role,
						image: NEW_ADMIN.image,
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
