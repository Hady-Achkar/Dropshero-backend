import {Response} from 'express'
import {CustomRequest, IAddProduct} from '../../../types'
import {Products} from '../../../models'

export default async (req: CustomRequest<IAddProduct>, res: Response) => {
	try {
		const {
			isHot,
			title,
			whereToSell,
			price,
			thumbnail,
			supplierLinks,
			competitorLinks,
			category,
			description,
			marketingAngel,
			marketingVideo,
			targets,
			advertisementText,
		} = req.body

		const newProduct = await Products.create({
			isHot,
			title,
			whereToSell,
			price,
			thumbnail,
			supplierLinks,
			competitorLinks,
			category,
			description,
			marketingAngel,
			marketingVideo,
			targets,
			advertisementText,
			isArchived: false,
		})
		return res.status(200).json({
			status: 'Success',
			message: 'Product was created successfully.',
			productId: newProduct._id,
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
