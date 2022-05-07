import {Request, Response} from 'express'
import {Admins} from '../../../models'

export default async (req: Request, res: Response) => {
	try {
		//@ts-ignore
		const {_id: AdminId} = req.user
		const _admin = await Admins.findById(AdminId).select('-password')
		if (!_admin) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: '_id was not found',
						field: '_id',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		return res.status(200).json({
			status: 'Success',
			message: 'Admin was fetched successfully',
			admin: _admin,
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
