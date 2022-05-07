import {Request, Response} from 'express'
import {isValidObjectId} from 'mongoose'
import Influencers from '../../models/Influencers'

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

		const _influencer = await Influencers.findById(influencerId)

		if (!_influencer) {
			return res.status(404).json({
				status: 'Failure',

				message: 'influencer does not exist',
				field: 'influencerId',
			})
		}

		return res.status(200).json({
			status: 'Success',
			message: 'Influencer was fetched successfully',
			influencer: _influencer,
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
