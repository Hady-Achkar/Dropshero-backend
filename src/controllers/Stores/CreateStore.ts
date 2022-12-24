import {Request, Response} from 'express'
import {Stores} from '../../models'
export default async (req: Request, res: Response) => {
	try {
		const {name, category, link, type} = req.body
		await Stores.create({
			name,
			category,
			link,
			type,
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
