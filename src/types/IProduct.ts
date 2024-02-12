import {Document} from 'mongoose'

export interface IUnitPriceSchema {
	min: number
	max: number
	createdAt: Date
	updatedAt: Date
}

export interface IProductPrice {
	selling: IUnitPriceSchema
	cost: IUnitPriceSchema
	profit: IUnitPriceSchema
	createdAt: Date
	updatedAt: Date
}

export interface IProduct extends Document {
	title: string
	thumbnail: string
	description: string
	price: IProductPrice
	isHot: boolean
	category: string
	createdAt: Date
	updatedAt: Date
	isArchived: boolean
}
