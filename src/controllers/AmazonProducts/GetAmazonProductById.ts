import {Request, Response} from 'express'
import {AmazonProducts} from '../../models'
import {isValidObjectId} from 'mongoose'

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

		const _product = await AmazonProducts.findById(amazonProductId)

		if (!_product) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'amazonProductId was not found',
						field: 'amazonProductId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		return res.status(200).json({
			status: 'Success',
			message: 'Product was fetched successfully',
			product: _product,
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
