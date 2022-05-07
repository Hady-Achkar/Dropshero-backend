import {Request, Response} from 'express'
import {Products} from '../../models'

export default async (req: Request, res: Response) => {
	try {
		const allProducts = await Products.find({}).sort({createdAt: -1})

		return res.status(200).json({
			status: 'Success',
			message: 'Products were fetched successfully.',
			products: allProducts,
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
