import {Request, Response} from 'express'
import {Users} from '../../../models'
import {isValidObjectId} from 'mongoose'

export default async (req: Request, res: Response) => {
	try {
		const {userId} = req.query

		if (!userId || userId === '') {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!isValidObjectId(userId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong userId format',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const _user = await Users.findById(userId).select('-password')

		if (!_user) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'user was not found',
						field: '_id',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		return res.status(200).json({
			status: 'Success',
			message: 'User was fetched successfully',
			user: _user,
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
