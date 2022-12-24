import {model, Schema} from 'mongoose'
import {IStore} from '../types'

const StoresSchema = new Schema<IStore>(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'name is a required field'],
			unique: true,
		},
		category: {
			type: String,
			trim: true,
			required: [true, 'category is a required field'],
		},
		link: {
			type: String,
			trim: true,
			required: [true, 'link is a required field'],
		},
		type: {
			type: String, // brand store - amazon store - dropshipping store
			trim: true,
			required: [true, 'type is a required field'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
export default model<IStore>('Stores', StoresSchema)
