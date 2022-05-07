import {Response, Request} from 'express'
import {isValidObjectId} from 'mongoose'
import Influencers from '../../../models/Influencers'

export default async (req: Request, res: Response) => {
	try {
		const {influencerId} = req.query
		if (!influencerId) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'influencerId was not found',
						field: 'influencerId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!isValidObjectId(influencerId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong influencerId format',
						field: 'influencerId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _deleted = await Influencers.findByIdAndDelete(influencerId)

		return res.status(204).json({
			message: 'Influencer was deleted successfully',
			influencer: _deleted?._id,
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
