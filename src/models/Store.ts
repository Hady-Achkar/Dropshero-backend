import {model, Schema} from 'mongoose'
import {IStore} from '../types'

const StoresSchema = new Schema<IStore>(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'channelName is a required field'],
			unique: true,
		},
		category: {
			type: String,
			trim: true,
			required: [true, 'category is a required field'],
		},
		link: {
			type: String,
			required: [true, 'followers is a required field'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
export default model<IStore>('Stores', StoresSchema)
