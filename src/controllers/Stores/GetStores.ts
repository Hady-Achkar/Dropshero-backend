import {Response, Request} from 'express'
import {Stores} from '../../models'
export default async (_: Request, res: Response) => {
	try {
		const stores = await Stores.find({}).sort({createdAt: -1})

		return res.status(200).json({
			message: 'Stores were fetched successfully.',
			data: stores,
		})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: 'Internal server error',
				error: error.message,
			})
		}
	}
}
