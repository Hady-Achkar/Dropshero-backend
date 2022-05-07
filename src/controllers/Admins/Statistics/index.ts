import axios from 'axios'
import {Response} from 'express'
import {Stripe} from '../../../lib'
import {Admins, Products, Users} from '../../../models'
import {AccountStatus, BundleType} from '../../../types'

export default async (req: any, res: Response) => {
	try {
		const NEW_CUSTOMERS = await Users.find({status: AccountStatus.VERIFIED})
			.sort({createdAt: -1})
			.limit(12)
			.select('-password -favoriteProducts')

		const BALANCE = await Stripe.balance.retrieve()

		const NEW_TRANSACTIONS = await Stripe.balanceTransactions.list({
			limit: 12,
		})
		const ADMINS = await Admins.find().sort({createdAt: -1}).select('-password')

		const ACTIVE_PROMOS = await Stripe.promotionCodes.list({active: true})

		const COUNT_PRODUCTS = await Products.estimatedDocumentCount()

		const COUNT_SUBS = await Users.countDocuments({
			status: AccountStatus.VERIFIED,
		})

		const COUNT_MONTHLY_SUBS = await Users.countDocuments({
			status: AccountStatus.VERIFIED,
			bundleType: BundleType.MONTHLY,
		})

		const COUNT_ONE_TIME_SUBS = await Users.countDocuments({
			status: AccountStatus.VERIFIED,
			bundleType: BundleType.ONE_TIME,
		})

		const COUNT_GUESTS = await Users.countDocuments({
			status: AccountStatus.NOT_VERIFIED,
		})

		const COUNT_EXPIRES = await Users.countDocuments({
			status: AccountStatus.EXPIRED,
		})

		return res.status(200).json({
			status: 'Success',
			message: 'Statistics fetched successfully',
			data: {
				latestCustomers: NEW_CUSTOMERS,
				latestTransactions: NEW_TRANSACTIONS.data,
				admins: ADMINS,
				activePromos: ACTIVE_PROMOS.data,
				balance: {
					available: BALANCE.available,
					pending: BALANCE.pending,
				},

				counts: {
					products: COUNT_PRODUCTS,
					subscribers: {
						total: COUNT_SUBS,
						monthly: COUNT_MONTHLY_SUBS,
						one_time: COUNT_ONE_TIME_SUBS,
					},
					nonSubscribers: COUNT_GUESTS,
					expiredSubscribers: COUNT_EXPIRES,
				},
			},
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
