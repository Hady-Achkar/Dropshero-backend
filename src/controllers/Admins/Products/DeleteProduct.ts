import {Request, Response} from 'express'
import {isValidObjectId} from 'mongoose'
import {Products} from '../../../models'

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

		await Products.findByIdAndDelete(productId)

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
