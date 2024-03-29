import {model, Schema} from 'mongoose'
import {IProduct, IProductPrice, IUnitPriceSchema} from '../types'

const unitPriceSchema = new Schema<IUnitPriceSchema>(
	{
		min: {
			type: Number,
			required: [true, 'selling is a required field'],
		},
		max: {
			type: Number,
			required: [true, 'selling is a required field'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
const priceSchema = new Schema<IProductPrice>(
	{
		selling: unitPriceSchema,
		cost: unitPriceSchema,
		profit: unitPriceSchema,
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
const ProductsSchema = new Schema<IProduct>(
	{
		title: {
			type: String,
			trim: true,
			required: [true, 'title is a required field'],
			unique: true,
		},
		thumbnail: {
			type: String,
			trim: true,
			required: [true, 'Thumbnail is a required field'],
		},
		description: {
			type: String,
			trim: true,
			required: [true, 'description is a required field'],
		},
		price: priceSchema,
		category: {
			type: String,
			trim: true,
		},
		isHot: {
			type: Boolean,
		},
		isArchived: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
)
ProductsSchema.pre('save', async function (next) {
	this.title = this.title
		.split(' ')
		.map((val: string) => val.charAt(0).toUpperCase() + val.slice(1))
		.join(' ')
	this.price.profit = {
		min: this.price.selling.min - this.price.cost.min,
		max: this.price.selling.max - this.price.cost.max,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	}
	next()
})
export default model<IProduct>('Products', ProductsSchema)
