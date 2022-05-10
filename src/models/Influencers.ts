import {model, Schema} from 'mongoose'
import {IInfulencer} from '../types'

const InfluencersSchema = new Schema<IInfulencer>(
	{
		channelName: {
			type: String,
			trim: true,
			required: [true, 'channelName is a required field'],
			unique: true,
		},
		platform: {
			type: String,
			trim: true,
			required: [true, 'platform is a required field'],
		},
		category: {
			type: String,
			trim: true,
			required: [true, 'category is a required field'],
		},
		followers: {
			type: Number,
			required: [true, 'followers is a required field'],
		},
		country: {
			type: String,
			trim: true,
			required: [true, 'country is a required field'],
		},
		youtube: {
			type: String,
		},
		instagram: {
			type: String,
		},
		snapchat: {
			type: String,
		},
		tiktok: {
			type: String,
		},
		description: {
			type: String,
			trim: true,
			required: [true, 'description is a required field'],
		},
		language: {
			type: String,
			trim: true,
			required: [true, 'language is a required field'],
		},
		image: {
			type: String,
			trim: true,
			required: [true, 'image is a required field'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
export default model<IInfulencer>('Influencers', InfluencersSchema)
