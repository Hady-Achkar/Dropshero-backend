import {Document} from 'mongoose'

export interface IUnitPriceSchema {
	min: number
	max: number
	createdAt: Date
	updatedAt: Date
}

export interface IAmazonProductPrice {
	selling: IUnitPriceSchema
	cost: IUnitPriceSchema
	profit: IUnitPriceSchema
	createdAt: Date
	updatedAt: Date
}

export interface IAmazonProduct extends Document {
	title: string
	thumbnail: string
	price: IAmazonProductPrice
	supplierLinks: string[]
	competitorLinks: string
	category: string
	createdAt: Date
	updatedAt: Date
	isArchived: boolean
}
