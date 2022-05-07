import {Request, Response} from 'express'
import {Products} from '../../models'
import {isValidObjectId} from 'mongoose'

export default async (req: Request, res: Response) => {
	try {
		const {productId} = req.query

		if (!productId || productId === '') {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'productId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!isValidObjectId(productId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong productId format',
						field: 'productId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const _product = await Products.findById(productId)

		if (!_product) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'productId was not found',
						field: 'productId',
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
