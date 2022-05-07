import {Response} from 'express'
import {CustomRequest, IInfulencer} from '../../../types'
import {isValidObjectId} from 'mongoose'
import Influencers from '../../../models/Influencers'

export default async (req: CustomRequest<IInfulencer>, res: Response) => {
	try {
		const {influencerId} = req.query
		if (!influencerId) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'influencerId was not found',
						field: 'influencerId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!isValidObjectId(influencerId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong influencerId format',
						field: 'influencerId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const {
			channelName,
			description,
			image,
			country,
			platform,
			category,
			followers,
			age,
		} = req.body

		let influencerData = {}

		const _influencer = await Influencers.findById(influencerId)

		if (!_influencer) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'influencer does not exist',
						field: 'influencerId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (channelName && channelName !== '') {
			influencerData = {...influencerData, channelName: channelName}
		}
		if (image && image !== '') {
			influencerData = {...influencerData, image: image}
		}

		if (description && description !== '') {
			influencerData = {...influencerData, description: description}
		}
		if (country && country !== '') {
			influencerData = {...influencerData, country: country}
		}
		if (platform && platform !== '') {
			influencerData = {...influencerData, platform: platform}
		}
		if (category && category !== '') {
			influencerData = {...influencerData, category: category}
		}
		if (followers && followers !== 0) {
			influencerData = {...influencerData, followers: followers}
		}
		if (age && age !== 0) {
			influencerData = {...influencerData, age: age}
		}

		const UPDATED_INFLUENCER = await Influencers.findByIdAndUpdate(
			influencerId,
			{
				$set: influencerData,
			},
			{
				new: true,
			}
		)

		return res.status(200).json({
			status: 'Success',
			message: 'product was updated successfully',
			influencerId: UPDATED_INFLUENCER?._id,
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
