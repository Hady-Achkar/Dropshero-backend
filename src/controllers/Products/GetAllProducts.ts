import {Request, Response} from 'express'
import {Products} from '../../models'

export default async (req: Request, res: Response) => {
	try {
		//@ts-ignore
		const {page} = req.query
		if (!page || page === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing page',
						field: 'page',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		//@ts-ignore
		if (isNaN(page)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Page is not a number',
						field: 'page',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		//@ts-ignore
		let skip = parseInt(page as string) > 0 ? parseInt(page * 10) : 0
		let limit = 10
		const allProducts = await Products.find({
			isArchived: false,
		})
			.sort({createdAt: -1})
			.limit(limit)
			.skip(skip)
		const length = await Products.find({
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
