import {Request, Response} from 'express'
import {Stores} from '../../models'
import {CustomRequest, IStore} from '../../types'
export default async (req: CustomRequest<IStore>, res: Response) => {
	try {
		const {storeId} = req.query
		const {name, category, link, type, description} = req.body
		let storeData = {}

		if (!storeId) {
			return res.status(404).json({
				message: 'missing storeId in query',
			})
		}

		if (name) {
			storeData = {...storeData, name}
		}
		if (category) {
			storeData = {...storeData, category}
		}
		if (link) {
			storeData = {...storeData, link}
		}
		if (type) {
			storeData = {...storeData, type}
		}

		if (description) {
			storeData = {...storeData, description}
		}

		const _store = await Stores.findByIdAndUpdate(
			storeId,
			{
				$set: storeData,
			},
			{
				new: true,
			}
		)

		if (!_store) {
			return res.status(500).json({
				message: 'Internal server error.',
			})
		}
		return res.status(204).json({
			message: 'Store was updated successfully',
			data: _store?._id,
		})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
