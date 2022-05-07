import {Admins} from '../../../models'
import {Response, Request} from 'express'
import {AdminRoles} from '../../../types'
import * as jwt from 'jsonwebtoken'
import {isValidObjectId} from 'mongoose'

export default async (req: Request, res: Response) => {
	try {
		const {adminId: AdminId} = req.query
		//@ts-ignore
		const {role: AdminRole} = req.user

		if (!AdminId || !isValidObjectId(AdminId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'adminId',
					},
				],
			})
		}

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

		const _admin = await Admins.findById(AdminId)

		if (!_admin) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'AdminId was not found',
						field: 'adminId',
					},
				],
			})
		}

		const _deletedAdmin = await Admins.findByIdAndDelete(AdminId)

		return res.status(200).json({
			status: 'Success',
			AdminId: _deletedAdmin?._id,
			message: 'Successfully deleted admin',
		})
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
