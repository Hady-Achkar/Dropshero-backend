import {Request, Response} from 'express'
import {AmazonProducts} from '../../models'

export default async (req: Request, res: Response) => {
	try {
		const allProducts = await AmazonProducts.find({
			isArchived: false,
		}).sort({createdAt: -1})

		const length = await AmazonProducts.find({
			isArchived: false,
		}).countDocuments()
		return res.status(200).json({
			status: 'Success',
			message: 'Products were fetched successfully.',
			products: allProducts,
			length,
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
