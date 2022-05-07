import {Request, Response} from 'express'
import {Users} from '../../../models'
import {isValidObjectId} from 'mongoose'
import {Stripe} from '../../../lib'
import {AdminRoles} from '../../../types'

export default async (req: Request, res: Response) => {
	try {
		const {userId} = req.query

		//@ts-ignore
		const {role: AdminRole} = req.user

		if (AdminRole === AdminRoles.SUPPORT) {
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
		if (!userId || userId === '') {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!isValidObjectId(userId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong userId format',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const _user = await Users.findById(userId)

		if (!_user) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'user was not found',
						field: '_id',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		await Stripe.customers.del(_user.stripeId)

		await Users.findByIdAndDelete(_user._id)

		return res.status(204).json({
			status: 'Success',
			message: 'User was deleted successfully',
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
