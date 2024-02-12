import {Response} from 'express'
import {Stores} from '../../models'
import {CustomRequest, IStore} from '../../types'
export default async (req: CustomRequest<IStore>, res: Response) => {
	try {
		const {name, category, link, type, description} = req.body
		await Stores.create({
			name,
			category,
			link,
			type,
			description,
		})

		return res.status(204).json({
			message: 'Store was created successfully',
		})
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	}
}
