import {Request, Response} from 'express'
import {isValidObjectId} from 'mongoose'
import {AmazonProducts} from '../../../models'

export default async (req: Request, res: Response) => {
	try {
		const {amazonProductId} = req.query

		if (!amazonProductId || amazonProductId === '') {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'amazonProductId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!isValidObjectId(amazonProductId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong amazonProductId format',
						field: 'amazonProductId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		await AmazonProducts.findByIdAndDelete(amazonProductId)

		return res.status(204).json({
			status: 'Success',
			message: 'Successfully delete product',
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
