import {NextFunction, Response} from 'express'
import {CustomRequest, IAddProduct} from '../types'

export default async (
	req: CustomRequest<IAddProduct>,
	res: Response,
	next: NextFunction
) => {
	try {
		const {description, category, price, thumbnail, title, isHot} = req.body
		if (!title || title === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing title',
						field: 'title',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!thumbnail || thumbnail === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing thumbnail',
						field: 'thumbnail',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!description || description === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing description',
						field: 'description',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price',
						field: 'price',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price.selling) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price.selling',
						field: 'price.selling',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price.cost) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price.cost',
						field: 'price.cost',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price.selling.min || price.selling.min === 0) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price selling min',
						field: 'price selling min',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (isNaN(price.selling.min)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Price selling min is not a number',
						field: 'price selling min',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price.selling.max || price.selling.max === 0) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price selling max',
						field: 'price selling max',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (isNaN(price.selling.max)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Price selling is not a number',
						field: 'price selling max',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price.cost.min || price.cost.min === 0) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price cost min',
						field: 'price cost min',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (isNaN(price.cost.min)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Price cost min is not a number',
						field: 'price cost min',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (!price.cost.max || price.cost.max === 0) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing price cost max',
						field: 'price cost max',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		if (isNaN(price.cost.max)) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Price cost is not a number',
						field: 'price cost max',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (isHot === undefined) {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing isHot',
						field: 'isHot',
						type: 'boolean',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!category || category === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'category is not found',
						field: 'category',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		next()
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
