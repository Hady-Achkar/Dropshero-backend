import {Request, Response} from 'express'
import {Admins} from '../../../models'
import * as bcrypt from 'bcryptjs'
import {isValidObjectId} from 'mongoose'
import {AdminRoles} from '../../../types'

export default async (req: Request, res: Response) => {
	try {
		const {adminId} = req.query
		const {fullName, password, image} = req.body

		//@ts-ignore
		const {role: AdminRole} = req.user

		if (!AdminRole || AdminRole !== AdminRoles.OWNER) {
			return res.status(401).json({
				status: 'Failure',
				errors: [
					{
						name: 'not authorized',
						field: 'role',
					},
				],
			})
		}

		if (!adminId || adminId === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing adminId',
						field: 'adminId',
						type: 'ObjectId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!isValidObjectId(adminId)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong adminId format',
						field: 'adminId',
						type: 'ObjectId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _verifyAdmin = await Admins.findById(adminId)

		if (!_verifyAdmin) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Admin was not found',
				requestTime: new Date().toISOString(),
			})
		}
		let adminData = {}

		if (fullName && fullName !== '') {
			adminData = {
				...adminData,
				fullName: fullName
					.split(' ')
					.map((val: string) => val.charAt(0).toUpperCase() + val.slice(1))
					.join(' '),
			}
		}
		if (password && password.length >= 6) {
			const hashedPassword = await bcrypt.hash(password, 10)
			adminData = {...adminData, password: hashedPassword}
		}

		if (image && image !== '') {
			adminData = {...adminData, image: image}
		}

		const UPDATED_ADMIN = await Admins.findByIdAndUpdate(adminId, {
			$set: adminData,
		})

		if (!UPDATED_ADMIN) {
			return res.status(400).json({
				message: 'Failure',
				errors: [
					{
						name: 'Could not update admin',
						field: '_id',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		return res.status(200).json({
			status: 'Success',
			message: 'Admin was updated successfully',
			adminId: UPDATED_ADMIN._id,
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
