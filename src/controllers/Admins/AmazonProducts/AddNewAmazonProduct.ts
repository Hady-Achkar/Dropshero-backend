import {Request, Response} from 'express'
import {IAddProduct} from '../../../types'
import {AmazonProducts} from '../../../models'

export default async (req: Request, res: Response) => {
	try {
		const {
			title,
			price,
			thumbnail,
			supplierLinks,
			competitorLinks,
			category,
			revenue,
		} = req.body

		const newAmazonProduct = await AmazonProducts.create({
			title,
			price,
			thumbnail,
			supplierLinks,
			competitorLinks,
			category,
			revenue,
			isArchived: false,
		})
		return res.status(200).json({
			status: 'Success',
			message: 'Amazon Product was created successfully.',
			productId: newAmazonProduct._id,
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
