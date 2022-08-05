import {Response, Request} from 'express'
import {isValidObjectId} from 'mongoose'
import {Stores} from '../../models'

export default async (req: Request, res: Response) => {
	try {
		const {storeId} = req.query
		if (!storeId) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'storeId was not found',
						field: 'storeId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!isValidObjectId(storeId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong storeId format',
						field: 'storeId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const _deleted = await Stores.findByIdAndDelete(storeId)

		return res.status(204).json({
			message: 'store was deleted successfully',
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
