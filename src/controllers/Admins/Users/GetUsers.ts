import {Request, Response} from 'express'
import {Users} from '../../../models'

export default async (_: Request, res: Response) => {
	try {
		const allUsers = await Users.find({})
			.sort({createdAt: -1})
			.select('-password')
		const length = await Users.find({}).countDocuments()
		return res.status(200).json({
			status: 'Success',
			message: 'users were fetched successfully.',
			users: allUsers,
			length,
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
