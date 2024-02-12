import {Response} from 'express'
import {Products} from '../../../models'
import {CustomRequest, IAddProduct} from '../../../types'
import {isValidObjectId} from 'mongoose'

export default async (req: CustomRequest<IAddProduct>, res: Response) => {
	try {
		const {productId} = req.query
		if (!productId) {
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
		const _verifyProduct = await Products.findOne({
			title: req.body.title,
		})

		if (_verifyProduct && _verifyProduct._id != productId) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Product title already exist',
				requestTime: new Date().toISOString(),
			})
		}
		const {title, thumbnail, price, description, isHot, category} = req.body

		let productData = {}

		const PRODUCT = await Products.findById(productId)

		if (!PRODUCT) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Product does not exist',
						field: 'productId',
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

		if (description && description !== '') {
			productData = {...productData, description: description}
		}

		if (isHot) {
			productData = {...productData, isHot: isHot}
		}

		if (category && category !== '') {
			productData = {...productData, category: category}
		}

		const UPDATED_PRODUCT = await Products.findByIdAndUpdate(
			productId,
			{
				$set: productData,
			},
			{
				new: true,
			}
		)

		return res.status(200).json({
			status: 'Success',
			message: 'product was updated successfully',
			productId: UPDATED_PRODUCT?._id,
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
