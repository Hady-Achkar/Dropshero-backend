import {Response} from 'express'
import {isValidObjectId} from 'mongoose'
import {AmazonProducts} from '../../../models'
import {AdminRoles} from '../../../types'

export default async (req: any, res: Response) => {
	try {
		const {role: AdminRole} = req.user
		const {amazonProductId: ProductId} = req.query

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

		const PRODUCT = await AmazonProducts.findById(ProductId)

		if (!PRODUCT) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'amazonProductId was not found',
						field: 'amazonProductId',
					},
				],
			})
		}

		const {isArchived} = PRODUCT

		const ARCHIVED_PRODUCT = await AmazonProducts.findByIdAndUpdate(ProductId, {
			$set: {
				isArchived: !isArchived,
			},
		})

		return res.status(200).json({
			status: 'Success',
			message: 'Amazon Product was archived successfully',
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
