import {Request, Response} from 'express'
import {Stripe} from '../../../lib'
import {AdminRoles} from '../../../types'

export default async (req: Request, res: Response) => {
	try {
		//@ts-ignore
		const {role: AdminRole} = req.user
		if (AdminRole !== AdminRoles.OWNER && AdminRole !== AdminRoles.SUPER) {
			return res.status(401).json({
				status: 'Failure',
				errors: [
					{
						name: 'not authorized',
						field: 'role',
					},
				],
			})
		}
		const RECENT_TRANSACTIONS = await Stripe.balanceTransactions.list({
			limit: 12,
		})
		return res.status(200).json({
			status: 'Success',
			message: 'Transactions fetched successfully',
			transactions: RECENT_TRANSACTIONS,
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
