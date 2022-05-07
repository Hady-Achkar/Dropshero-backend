import {Response} from 'express'
import {isValidObjectId} from 'mongoose'
import {Products} from '../../../models'
import {AdminRoles} from '../../../types'

export default async (req: any, res: Response) => {
	try {
		const {role: AdminRole} = req.user
		const {productId: ProductId} = req.query

		if (AdminRole !== AdminRoles.OWNER && AdminRole !== AdminRoles.SUPER) {
			return res.status(401).json({
				status: 'Failure',
				errors: [
					{
						name: 'Not authorized',
						field: 'role',
					},
				],
			})
		}

		if (!isValidObjectId(ProductId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'productId',
					},
				],
			})
		}

		const PRODUCT = await Products.findById(ProductId)

		if (!PRODUCT) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'productId was not found',
						field: 'productId',
					},
				],
			})
		}

		const {isArchived} = PRODUCT

		const ARCHIVED_PRODUCT = await Products.findByIdAndUpdate(ProductId, {
			$set: {
				isArchived: !isArchived,
			},
		})

		return res.status(200).json({
			status: 'Success',
			message: 'Product was archived successfully',
			productId: ARCHIVED_PRODUCT?._id,
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
