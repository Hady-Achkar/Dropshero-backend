import {Request, Response} from 'express'
import Influencers from '../../models/Influencers'

export default async (_: Request, res: Response) => {
	try {
		const _influencers = await Influencers.find({})

		return res.status(200).json({
			message: 'Influencers were fetched successfully',
			influencers: _influencers,
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
