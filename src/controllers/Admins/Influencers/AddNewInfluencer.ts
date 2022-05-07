import {Response} from 'express'
import Influencers from '../../../models/Influencers'
import {CustomRequest, IInfulencer} from '../../../types'

export default async (req: CustomRequest<IInfulencer>, res: Response) => {
	try {
		const {
			channelName,
			description,
			image,
			country,
			platform,
			category,
			followers,
			age,
		} = req.body

		const _influencer = await Influencers.create({
			channelName,
			description,
			image,
			country,
			platform,
			category,
			followers,
			age,
		})

		return res.status(200).json({
			status: 'Success',
			message: 'Influencer was created successfully.',
			productId: _influencer._id,
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
