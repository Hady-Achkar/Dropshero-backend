import {Request, Response} from 'express'
import {Admins} from '../../../models'

export default async (req: Request, res: Response) => {
	try {
		//@ts-ignore
		const {_id: UserId} = req.user
		const _allAdmins = await Admins.find({
			_id: {
				$ne: UserId,
			},
		}).select('-password')
		return res.status(200).json({
			status: 'Success',
			admins: _allAdmins,
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
