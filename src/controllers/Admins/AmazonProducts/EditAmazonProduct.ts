import {Response, Request} from 'express'
import {AmazonProducts} from '../../../models'
import {isValidObjectId} from 'mongoose'

export default async (req: Request, res: Response) => {
	try {
		const {amazonProductId} = req.query

		if (!amazonProductId) {
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
		const _verifyProduct = await AmazonProducts.findOne({
			title: req.body.title,
		})

		if (_verifyProduct && _verifyProduct._id != amazonProductId) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Product title already exist',
				requestTime: new Date().toISOString(),
			})
		}
		const {title, thumbnail, price, competitorLinks, category, revenue} =
			req.body

		let productData = {}

		const PRODUCT = await AmazonProducts.findById(amazonProductId)

		if (!PRODUCT) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Product does not exist',
						field: 'amazonProductId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (title && title !== '') {
			const newTitle = title
				.split(' ')
				.map((val: string) => val.charAt(0).toUpperCase() + val.slice(1))
				.join(' ')
			productData = {...productData, title: newTitle}
		}

		if (thumbnail && thumbnail !== '') {
			productData = {...productData, thumbnail: thumbnail}
		}
		if (revenue && revenue !== '') {
			productData = {...productData, revenue: revenue}
		}
		if (price.selling.min && price.selling.min !== 0) {
			productData = {
				...productData,
				price: {...price, selling: {...price.selling, min: price.selling.min}},
			}
		}

		if (price.selling.max && price.selling.max !== 0) {
			productData = {
				...productData,
				price: {...price, selling: {...price.selling, max: price.selling.max}},
			}
		}

		if (price.cost.min && price.cost.min !== 0) {
			productData = {
				...productData,
				price: {...price, cost: {...price.cost, min: price.cost.min}},
			}
		}
		if (price.cost.max && price.cost.max !== 0) {
			productData = {
				...productData,
				price: {...price, cost: {...price.cost, max: price.cost.max}},
			}
		}

		if (competitorLinks && competitorLinks !== '') {
			productData = {...productData, competitorLinks: competitorLinks}
		}

		if (category && category !== '') {
			productData = {...productData, category: category}
		}

		const UPDATED_PRODUCT = await AmazonProducts.findByIdAndUpdate(
			amazonProductId,
			{
				$set: productData,
			},
			{
				new: true,
			}
		)

		return res.status(200).json({
			status: 'Success',
			message: 'Amazon product was updated successfully',
			amazonProductId: UPDATED_PRODUCT?._id,
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
